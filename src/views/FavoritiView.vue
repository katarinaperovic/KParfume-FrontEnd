<template>
  <div class="cokolade">
    <h2>Favoriti</h2>
    <span class="nemaparfema" v-if="filteredParfemi.length === 0">
      Nemate omiljenih parfema.
    </span>
    <div class="card-container">
      <div
        v-for="parfem in filteredParfemi"
        :key="parfem.id"
        :class="['card', { 'card-nedostupan': !parfem.par_dostupan }]"
      >
        <div class="image-container">
          <img
            :src="'https://localhost:44333/resources' + parfem.par_slika"
            class="cokolada-image"
            alt="Logo fabrike"
          />
          <h3 v-show="!parfem.par_dostupan" class="nedostupan">NEDOSTUPAN</h3>
          <h3
            v-if="
              cene[parfem.id] && cene[parfem.id].sc_cena && parfem.par_dostupan
            "
            class="cenaUgao"
          >
            {{ cene[parfem.id].sc_cena }} €
          </h3>

          <h3 class="mililitrazaUgao">{{ parfem.par_mililitraza }}ml</h3>
        </div>
        <div class="card-content">
          <div class="title-fav-container">
            <i
              :class="
                isFavorite(parfem.id)
                  ? 'fa-solid fa-heart fav-icon'
                  : 'fa-regular fa-heart fav-icon'
              "
              @click="toggleFavorite(parfem)"
              v-if="korisnikUloga === 'kupac'"
            ></i>
            <strong>{{ parfem.par_naziv }}</strong>
          </div>

          <div class="cokolada-details">
            <div class="category-vrsta-container">
              <p
                :class="{
                  'kat-zen': parfem.par_kp_id === 1,
                  'kat-muski': parfem.par_kp_id === 2,
                  'kat-unisex': parfem.par_kp_id === 3,
                }"
              >
                {{
                  parfem.par_kp_id === 1
                    ? "ženski"
                    : parfem.par_kp_id === 2
                    ? "muški"
                    : parfem.par_kp_id === 3
                    ? "unisex"
                    : "N/A"
                }}
              </p>

              <p
                :class="{
                  'vrsta-cvetni': parfem.par_vp_id === 1,
                  'vrsta-orijentalni': parfem.par_vp_id === 2,
                  'vrsta-citrusni': parfem.par_vp_id === 3,
                  'vrsta-drvenasti': parfem.par_vp_id === 4,
                }"
              >
                {{
                  parfem.par_vp_id === 1
                    ? "cvetni"
                    : parfem.par_vp_id === 2
                    ? "orijentalni"
                    : parfem.par_vp_id === 3
                    ? "citrusni"
                    : parfem.par_vp_id === 4
                    ? "drvenasti"
                    : "N/A"
                }}
              </p>

              <p
                :class="{
                  'tip-zimski': parfem.par_tp_id === 1,
                  'tip-prolecni': parfem.par_tp_id === 2,
                  'tip-letnji': parfem.par_tp_id === 3,
                  'tip-jesenji': parfem.par_tp_id === 4,
                }"
              ></p>
            </div>

            <p>Dostupna količina: {{ parfem.par_kolicina }}</p>
            <p class="opis">{{ parfem.par_opis }}</p>
          </div>

          <div class="button-container">
            
            
            <button
              @click="addToCart(parfem)"
              v-if="korisnikUloga === 'kupac' && parfem.par_dostupan"
              :class="{ invisible: !parfem.par_dostupan }"
            >
              Dodaj u korpu
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, computed } from "vue";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

// Variables for parfemi, favorites, and prices
const parfemi = ref([]);
const favorites = ref([]);
const cene = ref([]);
const korisnikUloga = ref("");
const korisnikovId = ref("");

const filteredParfemi = computed(() => {
  return parfemi.value.filter((parfem) => favorites.value.includes(parfem.id));
});

// Fetch perfumes and favorite list on mount
onMounted(() => {
  const korisnik = JSON.parse(localStorage.getItem("korisnik"));
  korisnikUloga.value = korisnik ? korisnik.kor_uloga : "";
  korisnikovId.value = korisnik ? korisnik.id : "";

  loadFavorites();
  loadParfemi();
});

async function loadParfemi() {
  try {
    const response = await axios.get("https://localhost:44333/api/parfem");
    parfemi.value = response.data;

    // Fetch prices for each perfume
    await Promise.all(
      parfemi.value.map(async (parfem) => {
        if (!cene.value[parfem.id]) {
          const ceneResponse = await axios.get(
            `https://localhost:44333/api/stavka-cenovnika/parfemId/${parfem.id}`
          );
          if (ceneResponse.data) {
            cene.value[parfem.id] = ceneResponse.data;
          }
        }
      })
    );
  } catch (error) {
    console.error("Greška prilikom učitavanja parfema:", error);
  }
}

async function loadFavorites() {
  try {
    const response = await axios.get(`https://localhost:44333/api/favorit`);
    favorites.value = response.data
      .filter((f) => String(f.fav_kor_id) === String(korisnikovId.value))
      .map((fav) => fav.fav_par_id);
  } catch (error) {
    console.error("Error loading favorites:", error);
  }
}

function isFavorite(parfemId) {
  return favorites.value.includes(parfemId);
}

async function toggleFavorite(parfem) {
  if (isFavorite(parfem.id)) {
    await removeFromFavorites(parfem);
  } else {
    await addToFavorit(parfem);
  }
}

async function addToFavorit(parfem) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const favorit = {
      fav_kor_id: korisnikovId.value,
      fav_dat: today,
      fav_par_id: parfem.id,
    };

    await axios.post("https://localhost:44333/api/favorit", favorit);
    favorites.value.push(parfem.id);
    toastr.success("Parfem je uspešno dodat u favorite!");
  } catch (error) {
    toastr.error("Greška prilikom dodavanja u favorite!");
  }
}

async function removeFromFavorites(parfem) {
  try {
    await axios.delete(
      `https://localhost:44333/api/favorit/${parfem.id}/${korisnikovId.value}`
    );
    favorites.value = favorites.value.filter((favId) => favId !== parfem.id);
  } catch (error) {
    console.error("Error removing from favorites:", error);
  }
}

const addToCart = async (parfem) => {
  try {
    const korisnikId = korisnikovId.value;
    const korpaResponse = await axios.get(
      `https://localhost:44333/api/korpa/user/${korisnikId}`
    );

    if (korpaResponse.status === 200 && korpaResponse.data) {
      const korpaId = korpaResponse.data.id;
      console.log("Korpa id je:", korpaResponse);

      const stavkaKorpe = {
        skrp_par_id: parfem.id,
        skrp_cena_pj: 0,
        skrp_krp_id: korpaId,
        skrp_kolicina: 1,
      };

      await axios.post("https://localhost:44333/api/stavka-korpe", stavkaKorpe);

      toastr.success("Parfem je uspešno dodat u korpu!");
    } else {
      toastr.error("Korpa nije pronađena");
    }
  } catch (error) {
    console.error("Greška prilikom dodavanja u korpu:", error);
    toastr.error("Parfem je vec dodat u korpu!");
  }
};
</script>

<style scoped>
.cokolade {
  padding: 20px;
  font-family: "Arial", sans-serif;
}

.cokolade h2 {
  color: #ddd1f1;
}

h2 {
  text-align: center;
  color: #4f2a06;
  font-size: 2.5rem;
  margin-bottom: 30px;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
}

.card {
  width: 320px;
  background-color: #ddf9f6;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-10px);
}

.image-container {
  position: relative;
  background-color: #f8efef;
  padding: 15px;
}

.nedostupan {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(255, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 1.2rem;
  font-weight: bold;
}

.cenaUgao {
  position: absolute;
  top: 10px; /* Udaljenost od vrha */
  left: 10px; /* Udaljenost od leva */
  background-color: rgba(
    255,
    174,
    0,
    0.834
  ); /* Poluproziran crveni pozadinski boja */
  color: white; /* Boja teksta */
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 1.2rem;
  font-weight: bold;
}

.mililitrazaUgao {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(82, 8, 39, 0.834);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 1.2rem;
  font-weight: bold;
}

.cokolada-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
}

.card-content {
  padding: 20px;
  flex-grow: 1; /* Make the content fill available space */
  color: #fffdfd;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-nedostupan {
  background-color: #d3d3d3; /* Svetlo siva boja */
  color: #7f7f7f; /* Tamnija boja za tekst */
}

.card-content strong {
  font-size: 1.4rem;
  color: #4f2a06;
  margin-bottom: 15px;
}

.cokolada-details p {
  font-size: 1rem;
  color: #060606;
  font-style: oblique;
  margin: 1px 0;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.cokolada-details p::before {
  color: #4f2a06;
}
.nemaparfema {
  color: #ccc;
  text-align: center; 
  font-size: 24px; 
  position: absolute; 
  top: 50%; 
  left: 50%; 
  transform: translate(-50%, -50%);
  width: 100%; 
}

.cokolada-details {
  text-align: left;
  margin-bottom: 15px;
}

.button-container {
  display: flex;
  justify-content: space-between;
  padding: 0 15px 15px 15px;
  min-height: 50px;
}

.card button {
  flex: 1;
  padding: 10px;
  margin: 0 5px;
  background-color: #40050a;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.card button:hover {
  background-color: #1d0a0a;
}

.modal-content input {
  padding: 15px;
  background-color: #c7aef4;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.errors {
  color: red;
  grid-column: span 2;
  margin-left: 215px;
  margin-top: -30px !important;
}

/* For mobile responsiveness */
@media (max-width: 768px) {
  .card {
    width: 100%;
  }
}
/* Modal Styles */
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  background-color: rgba(142, 122, 126, 0.534);
}

.modal-content {
  background-color: rgb(44, 36, 67);
  border: 1px solid #ccc;
  border-radius: 15px;
  padding: 20px;

  width: 800px;
  max-width: 90%;

  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
  color: #c7aef4;
  font-size: 35px;
}

.close {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 2rem;
  cursor: pointer;
  color: #aaa;
  transition: color 0.3s ease;
}

.close:hover {
  color: #000;
}

.kat-zen {
  background-color: pink;
}

.kat-muski {
  background-color: lightblue;
}

.kat-unisex {
  background: linear-gradient(to right, pink, lightblue);
}

.vrsta-cvetni {
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("@/assets/cvetni.jpg");
  background-size: cover;
  background-position: center;
}

.vrsta-orijentalni {
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("@/assets/orijentalni.jpg");
  background-size: cover;
  background-position: center;
}

.vrsta-citrusni {
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("@/assets/citrusni.jpg");
  background-size: cover;
  background-position: center;
}

.vrsta-drvenasti {
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("@/assets/drvenasti.jpg");
  background-size: cover;
  background-position: center;
}

.tip-zimski {
  background-image: url("@/assets/zima.png");
  background-size: cover;
  background-position: center;
}

.tip-prolecni {
  background-image: url("@/assets/prolece.png");
  background-size: cover;
  background-position: center;
}

.tip-letnji {
  background-image: url("@/assets/leto.png");
  background-size: cover;
  background-position: center;
}

.tip-jesenji {
  background-image: url("@/assets/jesen.png");
  background-size: cover;
  background-position: center;
}
.opis {
  font-size: 18px !important;
  color: #a50404 !important;
  font-style: normal !important;
  margin: 10px 0 !important;
  font-weight: normal !important;
  display: block !important;
  align-items: normal !important;
}

.save-button {
  margin-top: 10px;
  padding: 10px;
  width: 100%;
  background-color: #40050a;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-button:hover {
  background-color: #291012;
}
.formm {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  row-gap: 30px;
  width: 70%;
  color: #f3deee;
  font-size: 20px;
}

.formm input:disabled {
  background-color: #4f4f4f;
  color: #edeaea;
}

.cokolada-details {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.category-vrsta-container {
  display: flex;
  justify-content: center; /* Razmak između kategorije i vrste */
  align-items: center; /* Poravnanje u istoj liniji */

  padding: 8px;

  border-radius: 10px; /* Zaobljene ivice */
  font-size: 1.2rem; /* Povećanje veličine fonta */
}

.category-vrsta-container p {
  flex: 1;
  min-width: 90px; /* Primer širine, prilagodite po potrebi */
  height: 50px; /* Primer visine, prilagodite po potrebi */
  background-size: cover;
  background-position: center;
  text-align: center;
  border-radius: 10px;
  margin: 0 4px;
  margin-top: -10px;
}

.kat-zen,
.kat-muski,
.kat-unisex {
  font-size: 1.2rem;
}

.vrsta-cvetni,
.vrsta-orijentalni,
.vrsta-citrusni,
.vrsta-drvenasti {
  font-size: 1.2rem;
}

.tip-zimski,
.tip-jesenji,
.tip-prolecni,
.tip-letnji {
  font-size: 1.2rem;
}

.button-container button.invisible {
  visibility: hidden !important;
}

.title-fav-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.fav-icon {
  position: absolute;
  bottom: 10px;
  left: 0;
  color: rgb(83, 36, 36);
  cursor: pointer;
  font-size: 1.5rem;
  border: 2px solid rgb(83, 36, 36);
  border-radius: 50%;
  padding: 5px;
  box-sizing: border-box;
}

.fa-regular.fa-heart {
  color: grey;
}

.fa-solid.fa-heart {
  color: red;
}
</style>
