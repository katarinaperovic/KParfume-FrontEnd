<template>
    <div class="korisnici">
      <h2>Svi registrovani korisnici</h2>
      
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
        
        <button @click="sortBy('kor_ime')">{{ sortButtonLabel('imenu') }}</button>
        <button @click="sortBy('kor_prezime')">{{ sortButtonLabel('prezimenu') }}</button>
        <button @click="sortBy('kor_email')">{{ sortButtonLabel('emailu') }}</button>
      </div>
  
      <span v-if="filteredAndSortedKorisnici.length === 0">Nema korisnika</span>
      
      <ul>
        <li v-for="k in filteredAndSortedKorisnici" :key="k.id" class="redovi">
          Email: <strong>{{ k.kor_email }}</strong> 
          Ime: <strong>{{ k.kor_ime }}</strong> 
          Prezime: <strong>{{ k.kor_prezime }}</strong> 
          Uloga: <strong>{{ mapUloga(k.kor_uloga) }}</strong>
          <!--<span v-if="k.kor_fab_id"> 
            Id: <strong>{{ k.kor_fab_id }}</strong>
          </span>-->
          <span v-if="String(k.kor_uloga) === '3'"> 
            Kompanija: <strong>{{ k.kor_ime_kompanije }}</strong>
          </span>
        </li>
      </ul>
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
  console.log(korisnikId.value); 
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
    let result = korisnici.value
  
    // Pretraga
    if (searchIme.value) {
      result = result.filter(k => k.kor_ime.toLowerCase().includes(searchIme.value.toLowerCase()));
    }
    if (searchPrezime.value) {
      result = result.filter(k => k.kor_prezime.toLowerCase().includes(searchPrezime.value.toLowerCase()));
    }
    if (searchKorisnickoIme.value) {
      result = result.filter(k => k.kor_email.toLowerCase().includes(searchKorisnickoIme.value.toLowerCase()));
    }
  
    // Filtriranje
    if (filterUloga.value) {
      result = result.filter(k => String(k.kor_uloga) === String(filterUloga.value));
    }
  
    // Sortiranje
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
    'imenu': 'kor_ime',
    'prezimenu': 'kor_prezime',
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

  </script>
  
  <style scoped>
  .redovi {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: rgba(224, 163, 78, 0.5);
  }
  
  .filters {
    margin-bottom: 20px;
  }
  
  .filters input,
  .filters select,
  .filters button {
    margin-right: 10px;
    margin-bottom: 10px;
  }
  
  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #201f1f;
    color: rgb(255, 255, 255);
    cursor: pointer;
  }
  
  button:hover {
    background-color: #261504;
  }
  
  .error {
    color: red;
    margin-top: 10px;
  }
  </style>
  