<template>
  <div class="korisnici">
    <h2>Svi registrovani korisnici</h2>

    <!-- Filters section -->
    <div class="filters">
      <input v-model="searchIme" placeholder="Pretraga po imenu">
      <input v-model="searchPrezime" placeholder="Pretraga po prezimenu">
      <input v-model="searchKorisnickoIme" placeholder="Pretraga po emailu">
      <select v-model="filterUloga">
        <option value="">Sve uloge</option>
        <option value="3">Kupac</option>
        <option value="2">Radnik</option>
        <option value="1">Menadžer</option>
        <option value="0">Administrator</option>
      </select>
      <button @click="sortBy('kor_email')">{{ sortButtonLabel('emailu') }}</button>
    </div>

    <!-- No users found message -->
    <span v-if="filteredAndSortedKorisnici.length === 0" class="no-users">Nema korisnika</span>

    <!-- User list section -->
    <div class="user-list">
      <div v-for="k in filteredAndSortedKorisnici" :key="k.id" class="user-card">
        <div class="user-info">
          <!-- Colored div for Uloga -->
          <div :class="['uloga', mapUlogaClass(k.kor_uloga)]">
           {{ mapUloga(k.kor_uloga) }}
          </div>
          <p><strong>Email:</strong> {{ k.kor_email }}</p>
          <p><strong>Ime:</strong> {{ k.kor_ime }}</p>
          <p><strong>Prezime:</strong> {{ k.kor_prezime }}</p>
         
          <p v-if="String(k.kor_uloga) === '3'"><strong>Kompanija:</strong> {{ k.kor_ime_kompanije }}</p>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';

const korisnici = ref([]);
const searchIme = ref('');
const searchPrezime = ref('');
const searchKorisnickoIme = ref('');
const filterUloga = ref('');
const sortOrder = ref('asc');
const sortKey = ref('');
const korisnikId = ref('');

onMounted(() => {
  const korisnik = JSON.parse(localStorage.getItem('korisnik'));
  korisnikId.value = korisnik ? korisnik.id : '';
  loadKorisnici();
});

async function loadKorisnici() {
  try {
    const response = await axios.get('https://localhost:44333/api/users');
    korisnici.value = response.data.filter(k => String(k.id) !== String(korisnikId.value));
  } catch (error) {
    console.error('Greška prilikom učitavanja korisnika:', error);
  }
}

const filteredAndSortedKorisnici = computed(() => {
  let result = korisnici.value;

  if (searchIme.value) {
    result = result.filter(k => k.kor_ime.toLowerCase().includes(searchIme.value.toLowerCase()));
  }
  if (searchPrezime.value) {
    result = result.filter(k => k.kor_prezime.toLowerCase().includes(searchPrezime.value.toLowerCase()));
  }
  if (searchKorisnickoIme.value) {
    result = result.filter(k => k.kor_email.toLowerCase().includes(searchKorisnickoIme.value.toLowerCase()));
  }
  if (filterUloga.value) {
    result = result.filter(k => String(k.kor_uloga) === String(filterUloga.value));
  }

  if (sortKey.value) {
    result.sort((a, b) => {
      let comparison = 0;
      if (a[sortKey.value] > b[sortKey.value]) {
        comparison = 1;
      } else if (a[sortKey.value] < b[sortKey.value]) {
        comparison = -1;
      }
      return sortOrder.value === 'asc' ? comparison : -comparison;
    });
  }

  return result;
});

function sortBy(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
}

function sortButtonLabel(friendlyKey) {
  const keyMap = {
    'emailu': 'kor_email'
  };

  const internalKey = keyMap[friendlyKey];
  if (sortKey.value === internalKey) {
    return sortOrder.value === 'asc' ? `Sortirano po ${friendlyKey} (ASC)` : `Sortirano po ${friendlyKey} (DESC)`;
  } else {
    return `Sortiraj po ${friendlyKey}`;
  }
}

function mapUloga(uloga) {
  switch (String(uloga)) {
    case '0':
      return 'ADMINISTRATOR';
    case '1':
      return 'MENADŽER';
    case '2':
      return 'RADNIK';
    case '3':
      return 'KUPAC';
    default:
      return 'Nepoznata uloga';
  }

  
}
// Function to return the CSS class for different user roles
function mapUlogaClass(uloga) {
  switch (String(uloga)) {
    case '0':
      return 'admin';
    case '1':
      return 'manager';
    case '2':
      return 'worker';
    case '3':
      return 'customer';
    default:
      return '';
  }}
</script>

<style scoped>
.korisnici {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.filters {
  display: flex;
  justify-content: space-between; /* Align filters and buttons in one row */
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.filters input,
.filters select,
.filters button {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  flex: 1; 
}

button {
  background-color: #b2d1f4;
  color: rgb(8, 8, 8);
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #b2d1f4;
}

.no-users {
  font-size: 18px;
  color: #666;
  text-align: center;
}

.user-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.user-card {
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: box-shadow 0.3s;
}

.user-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.user-info p {
  margin: 8px 0;
  font-size: 14px;
  line-height: 1.5em; /* Added consistent line-height for uniform spacing */
}

.user-info strong {
  color: #4e1515;
}


.user-card p,
.user-card strong {
  text-align: left; 
}

/* Div for Uloga styling */
.uloga {
  padding: 10px;
  color: white;
  border-radius: 5px;
  margin-top: 10px;
  text-align: center;
}

/* Background colors for different roles */
.admin {
  background-color: #ff4c4c;
}

.manager {
  background-color: #ffcc00;
}

.worker {
  background-color: #4caf50;
}

.customer {
  background-color: #007bff;
}

</style>
