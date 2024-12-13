<template>
  <div class="payment-container">
    <div class="total-price">Ukupan iznos: {{ totalPrice }} €</div>
    <div id="paypal-button-container" class="paypal-button-container"></div>
    <button @click="cancel" class="cancel-button">Otkaži</button>
  </div>
</template>

<script>
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export default {
  name: "PlacanjeView",
  data() {
    return {
      stavkeList: [], // Holds the list of cart items
      totalPrice: 0, // Holds the total price
      korisnikId: null, // Holds the user ID
      parfemi: {}, // Holds the perfume data
      kup_kpn_id: null, // Holds the KPN ID
      discountPercentage: 0, // Holds the discount percentage
      //updateCoupon: false,
    };
  },
  methods: {
    // Cancel button handler
    cancel() {
      this.$router.push("/korpa");
    },

    // Group items by fabrikaId
    groupItemsByFabrika() {
      const grouped = {};

      this.stavkeList.forEach((stavka) => {
        const parfemId = stavka.skrp_par_id;

        // Safely check if parfemi[parfemId] exists
        if (!this.parfemi[parfemId]) {
          console.error(`Parfem data is missing for parfemId: ${parfemId}`);
          return; // Skip this item if parfem data is missing
        }

        const parfemData = this.parfemi[parfemId];

        if (parfemData && parfemData.par_fab_id) {
          const fabrikaId = parfemData.par_fab_id;

          // Group items by fabrikaId
          if (!grouped[fabrikaId]) {
            grouped[fabrikaId] = [];
          }
          grouped[fabrikaId].push(stavka);
        } else {
          console.error(`par_fab_id is missing for parfemId: ${parfemId}`);
        }
      });

      return grouped;
    },

    // Calculate total price for a given fabrika group, applying discount
    calculateTotalPriceForFabrika(stavke) {
      const totalWithoutDiscount = stavke.reduce(
        (acc, item) => acc + item.skrp_kolicina * item.skrp_cena_pj,
        0
      );

      // Apply discount if it exists
      const discountAmount =
        (this.discountPercentage / 100) * totalWithoutDiscount;
      return totalWithoutDiscount - discountAmount;
    },

    initializePayPalButton() {
      window.paypal
        .Buttons({
          style: {
            layout: "vertical",
            color: "blue",
          },
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: this.totalPrice.toString(), // Total price will already include the discount
                    currency_code: "EUR",
                  },
                },
              ],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              if (details.status === "COMPLETED") {
                this.processSuccessfulTransaction(details);
                // if (this.updateCoupon) {
                if (this.kup_kpn_id) {
                  axios
                    .put(
                      `https://localhost:44333/api/kupon/iskoriscen/${this.kup_kpn_id}`
                    )
                    .catch((error) =>
                      console.error("Error updating coupon:", error)
                    );
                }
                // }
              }
            });
          },
          onError: (err) => {
            console.error("PayPal Error:", err);
            alert("Transaction failed. Please try again.");
          },
        })
        .render("#paypal-button-container");
    },

    async processSuccessfulTransaction(details) {
      const groupedItems = this.groupItemsByFabrika(); // Group items by fabrikaId
      const paypalIntentId = details.id; // Same PayPal intent ID

      // Process each distinct fabrika group
      for (const fabrikaId of Object.keys(groupedItems)) {
        const fabrikaStavke = groupedItems[fabrikaId];

        // Apply discount for each fabrika
        const fabrikaTotalPrice =
          this.calculateTotalPriceForFabrika(fabrikaStavke);

        const kupovinaData = {
          kup_kor_id: this.korisnikId,
          kup_fab_id: fabrikaId, // Unique fabrikaId for each group
          kup_datum: new Date().toISOString(),
          kup_kpn_id: this.kup_kpn_id, // Add the coupon ID if applied
          kup_uk_cena: fabrikaTotalPrice, // This now includes the discount
          kup_valuta: "EUR",
          kup_status: details.status,
          kup_pp_id: paypalIntentId, // Same PayPal intent ID for all purchases
        };

        try {
          const kupovinaResponse = await axios.post(
            "https://localhost:44333/api/kupovina",
            kupovinaData
          );

          const purchaseId = kupovinaResponse.data.id;

          // Post each item in the fabrika group as stavka_kupovine
          for (const stavka of fabrikaStavke) {
            const stavkaData = {
              sk_cena_pj: stavka.skrp_cena_pj,
              sk_par_id: stavka.skrp_par_id,
              sk_kup_id: purchaseId,
              sk_kolicina: stavka.skrp_kolicina,
            };

            await axios.post(
              "https://localhost:44333/api/stavka-kupovine",
              stavkaData
            );
          }
        } catch (error) {
          console.error(
            "Error processing purchase for fabrikaId:",
            fabrikaId,
            error
          );
        }
      }

      // Finally, clear the cart once all purchases are processed
      this.clearCart();
    },

    clearCart() {
      axios
        .delete(
          `https://localhost:44333/api/stavka-korpe/user/${this.korisnikId}`
        )
        .then(() => {
          toastr.success("Kupovina uspešna!");
          this.$router.push("/"); // Redirect to home page or any other desired page
        })
        .catch((error) => {
          console.error("Error clearing the cart:", error);
        });
    },
  },

  mounted() {
    const korisnik = localStorage.getItem("korisnik");
    if (korisnik) {
      this.korisnikId = JSON.parse(korisnik).id;
    }

    const state = window.history.state;

    if (state) {
      this.totalPrice = state.totalPrice || 0;
      this.stavkeList = JSON.parse(state.stavkeList) || [];
      this.kup_kpn_id = state.kup_kpn_id || null;

      if (this.kup_kpn_id) {
        axios
          .get(`https://localhost:44333/api/kupon/${this.kup_kpn_id}`)
          .then((response) => {
            this.discountPercentage = response.data.kpn_popust;
            // if (response.data.kpn_pk_valid) {
            //   this.updateCoupon = true;
            // }
          })
          .catch((error) => {
            console.error("Error fetching kupovina data:", error);
          });
      }

      const parfemPromises = this.stavkeList.map(async (stavka) => {
        const parfemId = stavka.skrp_par_id;

        console.log(`Fetching parfem data for parfemId: ${parfemId}`);

        try {
          if (!this.parfemi[parfemId]) {
            const response = await axios.get(
              `https://localhost:44333/api/parfem/${parfemId}`
            );
            if (response && response.data) {
              this.parfemi[parfemId] = response.data;
              console.log(
                `Fetched parfem data for parfemId: ${parfemId}`,
                response.data
              );
            } else {
              console.error(
                `No data received for parfemId: ${parfemId}`,
                response
              );
            }
          }
        } catch (error) {
          console.error(
            `Error fetching parfemi for parfemId: ${parfemId}`,
            error
          );
        }
      });

      Promise.all(parfemPromises)
        .then(() => {
          console.log("All parfemi fetched successfully, initializing PayPal");
          this.initializePayPalButton();
        })
        .catch((error) => {
          console.error("Error loading parfemi data:", error);
        });
    }
  },
};
</script>

<style scoped>
.payment-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.paypal-button-container {
  background-color: rgba(92, 171, 224, 0.363);
  max-height: 400px;
  overflow-y: auto;
  width: 400px;
  padding: 100px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.cancel-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #ff6347;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background-color: #ff3b20;
}

.total-price {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #fff;
}
</style>
