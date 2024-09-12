<template>
  <div class="profile-container" v-if="korisnikA">
    <div v-if="korisnikA.kor_uloga === 'menadzer'" class="purchase-section">
      <h2>Zahtevi za komentare za vašu fabriku</h2>
      <div v-if="filteredKomentari.length === 0">Nema zahteva za vašu fabriku.</div>
      <div v-for="komentar in filteredKomentari" :key="komentar.id" class="purchase">
        <div class="comment-section">
          <div class="comment-info">
            <p>Komentar: {{ komentar.rec_tekst }}</p>
            <div class="rating">
              <span v-for="n in 5" :key="n" class="star" :class="{ 'filled': n <= komentar.rec_ocena }">★</span>
            </div>
            <div class="action-buttons">
              <button @click="approveComment(komentar)" class="btn approve">Odobri</button>
              <button @click="rejectComment(komentar)" class="btn reject">Odbij</button>
            </div>
          </div>

          <div class="user-info" v-if="users.length > 0">
            <h3>Informacije o korisniku</h3>
            <p>Email: <strong>{{ getKupacInfo(komentar.rec_kor_id).kor_email }}</strong></p>
            <p>Ime i prezime: <strong>{{ getKupacInfo(komentar.rec_kor_id).kor_ime }} {{ getKupacInfo(komentar.rec_kor_id).kor_prezime }}</strong></p>
            <p>Kompanija: <strong>{{ getKupacInfo(komentar.rec_kor_id).kor_ime_kompanije }}</strong></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '../auth.js';
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const { state: authState, checkLoginStatus } = useAuth();
checkLoginStatus();

const korisnikA = ref(null);
const komentari = ref([]);
const users = ref([]);

const errorMessage = ref('');
const successMessage = ref('');

const getKomentari = async () => {
  try {
    const response = await axios.get(`https://localhost:44333/api/recenzija/getByFabrikaId/${korisnikA.value.kor_fab_id}`);
    komentari.value = response.data;
  } catch (error) {
    errorMessage.value = 'An error occurred while fetching purchase data.';
  }
};

const getAllUsers = async () => {
  try {
    const response = await axios.get('https://localhost:44333/api/users');
    users.value = response.data;
  } catch (error) {
    errorMessage.value = 'An error occurred while fetching user data.';
  }
};

const filteredKomentari = computed(() => {
  return komentari.value.filter(komentar => komentar.rec_status === 0);
});

const getKupacInfo = (rec_kor_id) => {
  return users.value.find(user => user.id === rec_kor_id) || {};
};

const approveComment = async (komentar) => {
  try {
    komentar.rec_status = 1;
    await axios.put(`https://localhost:44333/api/recenzija/${komentar.id}`, komentar);
    successMessage.value = 'Komentar je uspešno odobren.';
    await getKomentari(); 
  } catch (error) {
    errorMessage.value = 'Greška prilikom odobravanja komentara.';
  }
};

const rejectComment = async (komentar) => {
  try {
    komentar.rec_status = 2;
    await axios.put(`https://localhost:44333/api/recenzija/${komentar.id}`, komentar);
    successMessage.value = 'Komentar je odbijen.';
    await getKomentari();
  } catch (error) {
    errorMessage.value = 'Greška prilikom odbijanja komentara.';
  }
};

onMounted(async () => {
  korisnikA.value = authState.korisnik;
  await getAllUsers();
  await getKomentari();
});
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #7b6366;
}

h2 {
  margin-bottom: 20px;
  color: #fff;
}

.comment-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.comment-info {
  flex: 1;
  margin-right: 20px;
  color: #fff;
}

.user-info {
  flex: 1;
  color: #fff;
}

.rating {
  display: inline-block;
}

.star {
  font-size: 20px;
  color: #ccc;
}

.star.filled {
  color: #FFD700;
}

.action-buttons {
  margin-top: 10px;
}

.btn.approve {
  background-color: #4CAF50;
}

.btn.reject {
  background-color: #f44336;
}

.btn {
  margin-top: 5px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #513509;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-right: 10px;
}

.btn:hover {
  background-color: #5b330d;
}

.purchase {
  color: #fff;
}

h3 {
  color: #fff;
  margin-bottom: 10px;
}
</style>
