<template>
    <div class="profile-container" v-if="korisnikA">
      <div v-if="korisnikA.kor_uloga === 'menadzer'" class="purchase-section">
        <h2>Zahtevi za komentare za vašu fabriku</h2>
        <div v-if="filteredKomentari.length === 0">Nema zahteva za vašu fabriku.</div>
        <div v-for="komentar in filteredKomentari" :key="komentar.id" class="purchase">
          <p>Komentar: {{ komentar.rec_tekst }}</p>
          <p>Ocena: {{ komentar.rec_ocena }} </p>
          
         
          <span v-if="users.length === 0">Nema korisnika</span>
        <div v-if="users.length > 0" class="redovi">
          Email: <strong>{{ getKupacInfo(komentar.rec_kor_id).kor_email }}</strong> 
          Ime: <strong>{{ getKupacInfo(komentar.rec_kor_id).kor_ime }}</strong> 
          Prezime: <strong>{{ getKupacInfo(komentar.rec_kor_id).kor_prezime }}</strong> 
          Kompanija: <strong>{{ getKupacInfo(komentar.rec_kor_id).kor_ime_kompanije }}</strong> 
        </div>
         
          
          <div v-if="komentar.rec_status === 0">
            <button @click="approveComment(komentar)" class="btn approve">Odobri</button>
            <button @click="rejectComment(komentar)" class="btn reject">Odbij</button>
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
    return komentari.value.filter(komentar =>
    komentar.rec_status===0
    );
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
  
  .input-row {
    display: flex;
    gap: 20px;
  }
  
  .input-group {
    flex: 1;
    margin-bottom: 15px;
    text-align: left;
  }
  
  .input-group label {
    display: block;
    margin-bottom: 5px;
    color: #fff;
  }
  
  .input-group input,
  .input-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 10px;
  }
  
  .input-group input:disabled,
  .input-group select:disabled {
    background-color: #f0f0f0;
    color: #888;
  }
  
  form {
    padding: 20px;
  }
  
  .btn.approve {
    background-color: #4CAF50;
  }
  
  .btn.reject {
    background-color: #f44336;
  }
  
  .btn {
    margin-left: 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    background-color: #513509;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .btn:hover {
    background-color: #5b330d;
  }
  
  .error {
    color: red;
    margin-top: 10px;
  }
  
  .success {
    color: green;
    margin-top: 10px;
  }
  
  .purchase {
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
    margin-bottom: 10px;
    color: #fff;
  }
  
  .chocolates-container {
    display: flex;
    overflow-x: auto;
    gap: 10px;
  }
  
  .chocolate {
    flex: 0 0 auto;
    width: 150px;
  }
  
  .chocolate img {
    width: 100px;
    height: 100px;
  }
  
  .white {
    color: #fff;
  }
  
  .redovi {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: rgba(224, 163, 78, 0.5);
    margin-bottom: 10px;
  }
  </style>
  