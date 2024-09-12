<template>
  <div class="cart-container">
    <div class="cart-list">
      <div v-if="stavkeList && stavkeList.length > 0">
        <div v-for="(stavke, fabrikaId) in groupedByFabric" :key="fabrikaId">
          <!-- Check if fabric data exists before rendering the fabric name -->
          <h2 class="fabric-title" v-if="fabrike[fabrikaId]">
            {{ fabrike[fabrikaId]?.fab_naziv }}
            <!-- Fabric name -->
          </h2>
          <div v-for="stavka in stavke" :key="stavka.id" class="cart-item">
            <img
              :src="
                'https://localhost:44333/resources' +
                parfemi[stavka.skrp_par_id]?.par_slika
              "
              class="item-image"
              alt="Perfume Image"
            />
            <div class="item-details">
              <h3 class="item-title">
                {{ parfemi[stavka.skrp_par_id]?.par_naziv }}
              </h3>
              <p class="item-description">
                {{ parfemi[stavka.skrp_par_id]?.par_opis }}
              </p>
              <p class="item-volume">
                {{ parfemi[stavka.skrp_par_id]?.par_mililitraza }} ml
              </p>
              <p class="item-price">Price: {{ stavka.skrp_cena_pj }} RSD</p>
              <p class="item-total">
                Total: {{ stavka.skrp_kolicina * stavka.skrp_cena_pj }} RSD
              </p>
            </div>
            <div class="item-quantity-controls">
              <button
                class="quantity-btn"
                @click="dekrementKolicina(stavka.id)"
                :disabled="stavka.skrp_kolicina <= 1"
              >
                -
              </button>
              <span class="quantity-number">{{ stavka.skrp_kolicina }}</span>
              <button
                class="quantity-btn"
                @click="inkrementKolicina(stavka.id)"
              >
                +
              </button>
            </div>
            <button class="remove-btn" @click="deleteStavka(stavka.id)">
              Remove
            </button>
          </div>
        </div>
        <div class="total-price">Ukupan iznos: {{ totalPrice }} RSD</div>
        <button class="checkout-btn" @click="goToPayment">
          <i class="fa fa-credit-card" style="margin-right: 5px"></i> Nastavi na
          placanje
        </button>
      </div>
      <p v-else class="empty-cart-message">Your cart is empty</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export default {
  data() {
    return {
      stavkeList: [], // List of cart items
      parfemi: {}, // Perfume data
      fabrike: {}, // Fabric data
    };
  },
  computed: {
    totalPrice() {
      return this.stavkeList.reduce(
        (acc, item) => acc + item.skrp_kolicina * item.skrp_cena_pj,
        0
      );
    },
    groupedByFabric() {
      const grouped = {};
      this.stavkeList.forEach((stavka) => {
        const parfem = this.parfemi[stavka.skrp_par_id];
        if (parfem) {
          const fabrikaId = parfem.par_fab_id;
          if (!grouped[fabrikaId]) {
            grouped[fabrikaId] = [];
          }
          grouped[fabrikaId].push(stavka);
        }
      });
      return grouped;
    },
  },
  methods: {
    async fetchStavkeKorpe() {
      try {
        const korisnik = localStorage.getItem("korisnik");
        if (!korisnik) {
          toastr.error("User is not logged in");
          return;
        }
        const korisnikId = JSON.parse(korisnik).id;
        const korpaResponse = await axios.get(
          `https://localhost:44333/api/korpa/user/${korisnikId}`
        );
        if (korpaResponse.status === 200 && korpaResponse.data) {
          const korpaId = korpaResponse.data.id;

          const stavkeResponse = await axios.get(
            `https://localhost:44333/api/stavka-korpe/korpa/${korpaId}`
          );
          this.stavkeList = stavkeResponse.data;
          console.log(this.stavkeList);

          await Promise.all(
            this.stavkeList.map(async (stavka) => {
              const parfemId = stavka.skrp_par_id;
              if (!this.parfemi[parfemId]) {
                const parfemResponse = await axios.get(
                  `https://localhost:44333/api/parfem/${parfemId}`
                );
                const parfem = parfemResponse.data;
                this.parfemi[parfemId] = parfem;

                // Fetch fabric information if not already fetched
                const fabrikaId = parfem.par_fab_id;
                if (!this.fabrike[fabrikaId]) {
                  const fabrikaResponse = await axios.get(
                    `https://localhost:44333/api/fabrika/${fabrikaId}`
                  );
                  this.fabrike[fabrikaId] = fabrikaResponse.data;
                }
              }
            })
          );
        }
      } catch (error) {
        toastr.error("Error loading cart items");
        console.error("Error loading cart items:", error);
      }
    },
    async inkrementKolicina(id) {
      try {
        const response = await axios.put(
          `https://localhost:44333/api/stavka-korpe/inkrement/${id}`
        );
        if (response.status === 200) {
          const updatedStavka = this.stavkeList.find(
            (stavka) => stavka.id === id
          );
          if (updatedStavka) {
            updatedStavka.skrp_kolicina++;
          }
        }
      } catch (error) {
        toastr.error("Error increasing quantity");
      }
    },
    async dekrementKolicina(id) {
      try {
        const response = await axios.put(
          `https://localhost:44333/api/stavka-korpe/dekrement/${id}`
        );
        if (response.status === 200) {
          const updatedStavka = this.stavkeList.find(
            (stavka) => stavka.id === id
          );
          if (updatedStavka && updatedStavka.skrp_kolicina > 1) {
            updatedStavka.skrp_kolicina--;
          }
        }
      } catch (error) {
        toastr.error("Error decreasing quantity");
      }
    },
    async deleteStavka(id) {
      try {
        const response = await axios.delete(
          `https://localhost:44333/api/stavka-korpe/${id}`
        );
        if (response.status === 200) {
          this.fetchStavkeKorpe();
          toastr.success("Item removed");
        }
      } catch (error) {
        toastr.error("Error removing item");
      }
    },
    goToPayment() {
      this.$router.push({
        path: "/placanje",
        state: {
          totalPrice: this.totalPrice,
          stavkeList: JSON.stringify(this.stavkeList),
        },
      });
    },
  },
  mounted() {
    this.fetchStavkeKorpe();
  },
};
</script>

<style scoped>
@keyframes flyIn {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cart-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Segoe UI", "Roboto", sans-serif;
  color: #333;
}

.cart-list {
  display: flex;
  flex-direction: column;
}

.cart-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  background-color: #ffffffcc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  transition: all 0.3s;
  animation: flyIn 0.8s ease forwards;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item:hover {
  scale: 1.005;
}

.item-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 20px;
}

.item-details {
  flex-grow: 1;
}

.item-title {
  font-size: 18px;
  color: #000;
}

.item-description {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

.item-volume,
.item-price,
.item-total {
  font-size: 16px;
  color: #444;
}

.item-quantity-controls {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.quantity-btn {
  background-color: #003c7c;
  color: white;
  font-size: medium;
  border-radius: 3px;
  border: none;
  width: 28px;
  height: 28px;
  margin: 0 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.quantity-btn:hover {
  background-color: #002c5c;
}

.quantity-number {
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.remove-btn {
  text-transform: uppercase;
  font-weight: 600;
  background-color: #8a0f38;
  color: white;
  border-radius: 3px;
  height: 28px;
  border: none;
  padding: 0 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.remove-btn:hover {
  background-color: #6a0a2c;
}

.checkout-btn {
  background-color: #0056b3;
  color: white;
  border-radius: 5px;
  text-transform: uppercase;
  font-weight: 500;
  width: 100%;
  padding: 10px 0;
  border: none;
  font-size: 18px;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s;
}

.checkout-btn:hover {
  background-color: #003f7f;
}

.empty-cart-message {
  text-align: center;
  color: #aaa;
  font-size: 18px;
}

.total-price {
  display: flex;
  justify-content: center;
  padding: 10px;
  font-size: 20px;
  text-align: right;
  color: #fff;
  margin: 10px 0;
  font-weight: bold;
  animation: flyIn 0.8s ease forwards;
}

.fabric-title {
  color: #fff;
  animation: flyIn 0.8s ease forwards;
}
</style>
