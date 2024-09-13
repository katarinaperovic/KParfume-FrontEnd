<template>
  <div class="komentari">
    <h2 class="naslov">Komentari o fabrici</h2>
    <span class="nema" v-if="filteredKomentari.length === 0">Nema komentara</span>
    <div class="vesti-list">
      <div v-for="komentar in filteredKomentari" :key="komentar.id" class="vest-card">
        <strong class="odbijen" v-if="komentar.rec_status === 2">ODBIJEN</strong>
        <!-- Prikaz zvezdice sa ocenom -->
        <div class="rating-star">
          {{ komentar.rec_ocena }}
        </div>
        <!-- Komentar i korisnički podaci -->
        <div v-if="users[komentar.rec_kor_id]" class="user-info">
          
          <p>{{ users[komentar.rec_kor_id].kor_ime }} {{ users[komentar.rec_kor_id].kor_prezime }} :</p>
        </div>
        <h2 class="vest-title">{{ komentar.rec_tekst }}</h2>
       
        
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, computed, defineProps } from 'vue';
import { useAuth } from '../auth.js';

const props = defineProps({
  fabrikaId: Number
});

const komentari = ref([]);
const users = ref({});
const { state: authState, checkLoginStatus } = useAuth();
checkLoginStatus();

const korisnik = ref(null);

const filteredKomentari = computed(() => {
  if (authState.korisnikUloga === 'kupac' || authState.korisnikUloga === 'radnik' || authState.isLoggedIn === false) {
    return komentari.value.filter((komentar) => komentar.rec_status === 1);
  } else if (
    authState.korisnikUloga === 'menadzer' ||
    authState.korisnikUloga === 'administrator'
  ) {
    return komentari.value.filter(
      (komentar) => komentar.rec_status === 1 ||komentar.rec_status===2
    );
  } else {
    return [];
  }
});

onMounted(() => {
  korisnik.value = authState.korisnik;
  loadKomentari();
});

async function loadKomentari() {
  try {
    const response = await axios.get(
      `https://localhost:44333/api/recenzija/getByFabrikaId/${props.fabrikaId}`
    );
    komentari.value = response.data;

    // Fetch user details for each komentar.rec_kor_id
    await Promise.all(
      komentari.value.map(async (komentar) => {
        if (!users.value[komentar.rec_kor_id]) {
          const userResponse = await axios.get(
            `https://localhost:44333/api/users/${komentar.rec_kor_id}`
          );
          users.value[komentar.rec_kor_id] = userResponse.data;
        }
      })
    );
  } catch (error) {
    console.error('Greška prilikom učitavanja komentara:', error);
  }
}
</script>

<style scoped>
.vesti-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start; /* Rasporedi kartice ravnomerno */
  gap: 15px; /* Razmak između kartica */
  padding-left: 10px;
}

.vest-card {
  position: relative;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 300px; /* Fiksna širina za karticu */
  padding: 20px; /* Manji padding da kartica bude kompaktnija */
  margin: 15px 0; /* Smanjen margin za manje razmaka po vertikali */
}

.vest-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* Star icon with rating inside */
.rating-star {
  position: absolute;
  top: -2px;
  left: -4px;
  width: 60px; /* Manja zvezdica */
  height: 60px;
  background-color: #fff836;
  clip-path: polygon(
    50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%,
    50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%
  );
  display: flex;
  justify-content: center;
  align-items: center;
  color: #090909;
  font-size: 14px; /* Manji tekst za ocenu */
  font-weight: bold;
}

.vest-title {
  font-size: 18px; /* Smanjena veličina naslova */
  margin: 10px 0;
  color: #333;
}

.vest-text {
  font-size: 14px; /* Smanjena veličina teksta */
  margin: 5px 0 10px;
  color: #666;
}

/* Style for the user info section */
.user-info {
  background-color: #dedbf491;
  padding: 10px;
  border-radius: 0 0 10px 10px;
  color: #161616;
  margin-top: -5px;
  text-align: left;
  padding-left: 40px;
}

.odbijen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 0, 0, 0.5); 
  color: rgb(254, 253, 253);
  font-size: 24px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2; 
  text-align: center;
  border-radius: 10px; 
}


.naslov {
  color: rgb(248, 247, 247) !important; 
  font-size: 24px;
}

.nema {
  color: #ccc !important;
  text-align: center; 
  font-size: 24px; 
  position: absolute; 
  top: 70%; 
  left: 50%; 
  transform: translate(-50%, -50%);
  width: 100%; 
}

.user-info p {
  margin: 0;
  font-size: 12px; 
}



</style>
