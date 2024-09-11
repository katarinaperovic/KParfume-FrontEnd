<template>
  <div class="korpa-view">
    <h2>Stavke u korpi</h2>
    <div class="korpa-list">
      <div v-if="stavkeList && stavkeList.length > 0">
        <div v-for="stavka in stavkeList" :key="stavka.id" class="korpa-card">
          <div>Količina: {{ stavka.skrp_kolicina }}</div>
          <!-- Prikazivanje podataka o parfemu koristeći stavka.skr_par_id -->
          <h2 class="korpa-title">
            {{ parfemi[stavka.skrp_par_id]?.par_naziv }}
          </h2>
          <img
            :src="
              'https://localhost:44333/resources' +
              parfemi[stavka.skrp_par_id]?.par_slika
            "
            class="cokolada-image"
            alt="Logo fabrike"
          />

          <p class="korpa-text">
            Cena po komadu: {{ stavka.skrp_cena_pj }} RSD
          </p>
          <p class="korpa-text">
            Ukupno: {{ stavka.skrp_kolicina * stavka.skrp_cena_pj }} RSD
          </p>

          <!-- Prikazivanje dodatnih informacija o parfemu -->
          <div v-if="parfemi[stavka.skrp_par_id]" class="parfem-info">
            <p class="korpa-text">
              Mililitraža: {{ parfemi[stavka.skrp_par_id].par_mililitraza }} ml
            </p>
            <p class="korpa-text">
              Opis: {{ parfemi[stavka.skrp_par_id].par_opis }}
            </p>
          </div>
          <div class="pomocni-btn-div">
            <button class="pomocni-btn" @click="inkrementKolicina(stavka.id)">
              +
            </button>
            <button class="pomocni-btn" @click="dekrementKolicina(stavka.id)">
              -
            </button>
            <button class="pomocni-btn" @click="deleteStavka(stavka.id)">
              <i class="fa fa-trash"></i>
            </button>
          </div>
        </div>
        <button class="kupi-btn">Kupi</button>
      </div>
      <p v-else class="no-items">Korpa je prazna</p>
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
      stavkeList: [], // Lista stavki korpe
      parfemi: {}, // Objekat sa podacima o parfemima
      korisnikId: "", // ID korisnika
    };
  },
  methods: {
    async fetchStavkeKorpe() {
      try {
        const korisnikId = JSON.parse(localStorage.getItem("korisnik")).id;
        console.log(korisnikId);

        const korpaResponse = await axios.get(
          `https://localhost:44333/api/korpa/user/${korisnikId}`
        );
        if (korpaResponse.status === 200 && korpaResponse.data) {
          const korpaId = korpaResponse.data.id;

          const stavkeResponse = await axios.get(
            `https://localhost:44333/api/stavka-korpe/korpa/${korpaId}`
          );
          this.stavkeList = stavkeResponse.data;

          await Promise.all(
            this.stavkeList.map(async (stavka) => {
              if (!this.parfemi[stavka.skrp_par_id]) {
                const parfemResponse = await axios.get(
                  `https://localhost:44333/api/parfem/${stavka.skrp_par_id}`
                );
                this.parfemi[stavka.skrp_par_id] = parfemResponse.data;
              }
            })
          );
        }
      } catch (error) {
        console.error("Greška prilikom učitavanja stavki korpe:", error);
      }
    },

    async inkrementKolicina(id) {
      try {
        const response = await axios.put(
          `https://localhost:44333/api/stavka-korpe/inkrement/${id}`
        );
        if (response.status === 200) {
          // Update the local state for the specific item
          const updatedStavka = this.stavkeList.find(
            (stavka) => stavka.id === id
          );
          if (updatedStavka) {
            updatedStavka.skrp_kolicina++;
          }
          //toastr.success("Količina je uspešno povećana!");
        } else {
          //toastr.error("Došlo je do greške prilikom povećanja količine.");
        }
      } catch (error) {
        //toastr.error("Došlo je do greške prilikom povećanja količine.");
      }
    },

    async dekrementKolicina(id) {
      try {
        const response = await axios.put(
          `https://localhost:44333/api/stavka-korpe/dekrement/${id}`
        );
        if (response.status === 200) {
          // Update the local state for the specific item
          const updatedStavka = this.stavkeList.find(
            (stavka) => stavka.id === id
          );
          if (updatedStavka) {
            updatedStavka.skrp_kolicina--;
          }
          //toastr.success("Količina je uspešno smanjena!");
        } else {
          //toastr.error("Došlo je do greške prilikom smanjenja količine.");
        }
      } catch (error) {
        //toastr.error("Došlo je do greške prilikom smanjenja količine.");
      }
    },

    async deleteStavka(id) {
      try {
        const response = await axios.delete(
          `https://localhost:44333/api/stavka-korpe/${id}`
        );
        if (response.status === 200) {
          // Handle success, e.g., update the stavkeList
          console.log("Delete successful", response.data);
          this.fetchStavkeKorpe();
        } else {
          console.error("Delete failed", response.data);
        }
      } catch (error) {
        console.error("Error deleting stavka", error);
      }
    },
  },
  mounted() {
    this.fetchStavkeKorpe();
  },
};
</script>

<style scoped>
.korpa-view {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  font-family: "Arial", sans-serif;
}

.korpa-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.korpa-card {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  margin: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.korpa-title {
  font-size: 20px;
  margin: 15px 0;
  color: #333;
}

.korpa-text {
  font-size: 16px;
  color: #666;
}

.no-items {
  color: #ccc;
  text-align: center;
  font-size: 24px;
}

.pomocni-btn-div {
  display: flex;
  justify-content: center;
}

.pomocni-btn {
  background-color: #4caf50;
  color: white;
  width: 30px;
  height: 30px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.pomocni-btn:hover {
  background-color: #45a049;
  scale: 1.1;
}

.kupi-btn {
  background-color: #4caf50;
  color: white;
  width: 100px;
  height: 40px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.kupi-btn:hover {
  background-color: #45a049;
  scale: 1.01;
}
</style>
