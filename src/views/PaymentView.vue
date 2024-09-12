<template>
  <div class="payment-container">
    <div class="total-price">Ukupan iznos: {{ totalPrice }} RSD</div>
    <div id="paypal-button-container" class="paypal-button-container"></div>
    <button @click="cancel" class="cancel-button">Otkazi</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PlacanjeView",
  data() {
    return {
      stavkeList: [], // Holds the list of cart items
      totalPrice: 0, // Holds the total price
      korisnikId: null, // Holds the user ID
    };
  },
  methods: {
    // Cancel button handler
    cancel() {
      this.$router.push("/korpa");
    },
    // PayPal buttons configuration with success and error alerts
    initializePayPalButton() {
      window.paypal
        .Buttons({
          style: {
            layout: "vertical",
            color: "blue",
          },
          // Create an order
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: this.totalPrice.toString(),
                    currency_code: "EUR",
                  },
                },
              ],
            });
          },
          // On successful transaction approval
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              if (details.status === "COMPLETED") {
                alert("Transaction successful! Thank you for your purchase.");
                console.log("Transaction details:", details);

                const kupovinaData = {
                  kup_kor_id: this.korisnikId,
                  kup_fab_id: 6, // Hardcoded fabric ID
                  kup_datum: new Date().toISOString(),
                  kup_kpn_id: null,
                  uk_cena: this.totalPrice,
                  kup_valuta: "RSD",
                  kup_status: details.status,
                  kup_pp_id: details.id,
                };

                console.log("Purchase data:", kupovinaData);

                axios
                  .post("https://localhost:44333/api/kupovina", kupovinaData)
                  .then((response) => {
                    this.stavkeList.forEach((stavka) => {
                      const stavkaData = {
                        sk_cena_pj: stavka.skrp_cena_pj,
                        sk_par_id: stavka.skrp_par_id,
                        sk_kup_id: response.data.id,
                        sk_kolicina: stavka.skrp_kolicina,
                      };

                      axios
                        .post(
                          "https://localhost:44333/api/stavka-kupovine",
                          stavkaData
                        )
                        .then(() => {
                          axios
                            .delete(
                              `https://localhost:44333/api/stavka-korpe/user/${this.korisnikId}`
                            )
                            .then(() => {
                              this.$router.push("/");
                            });
                        })
                        .catch((error) => {
                          console.error(
                            "Error sending purchase item data:",
                            error
                          );
                        });
                    });
                  })
                  .catch((error) => {
                    console.error("Error sending purchase data:", error);
                  });
              }
            });
          },
          // On transaction error
          onError: (err) => {
            console.error("PayPal Error:", err);
            alert("Transaction failed. Please try again.");
          },
        })
        .render("#paypal-button-container");
    },
  },
  mounted() {
    const korisnik = localStorage.getItem("korisnik");
    this.korisnikId = JSON.parse(korisnik).id;

    const state = window.history.state;

    if (state) {
      this.totalPrice = state.totalPrice || 0;
      this.stavkeList = JSON.parse(state.stavkeList) || [];
    }

    console.log(this.stavkeList);
    console.log(this.totalPrice);

    this.initializePayPalButton();
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
