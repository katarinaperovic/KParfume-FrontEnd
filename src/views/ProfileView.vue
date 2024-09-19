<template>
    <div class="profile-container" v-if="korisnik">
      <h2>Korisnički profil</h2>
      <form @submit.prevent="updateProfile">
        <div class="input-row">
        <div class="input-group">
            <label for="korisnickoIme">Korisničko ime:</label>
            <input type="text" v-model="korisnik.kor_email" disabled />
          </div>
          <div class="input-group">
        <label for="tipKorisnika">Tip korisnika:</label>
        <input type="text" 
         :value="String(korisnik.kor_uloga) === '0' ? 'ADMINISTRATOR' 
              : String(korisnik.kor_uloga) === '1' ? 'MENADŽER' 
              : String(korisnik.kor_uloga) === '2' ? 'RADNIK' 
              : String(korisnik.kor_uloga) === '3' ? 'KUPAC' 
              : 'Nepoznata uloga'" 
         disabled />
            </div>


        </div>
        <div class="input-row">
        <div class="input-group">
          <label for="ime">Ime:</label>
          <input type="text" v-model="korisnik.kor_ime" required pattern="[A-Za-z ]+" title="Molimo unesite samo slova" />
        </div>
        <div class="input-group">
          <label for="prezime">Prezime:</label>
          <input type="text" v-model="korisnik.kor_prezime" required  />
        </div>
      </div>
      <div class="input-row">
        <div class="input-group" v-if="String(korisnik.kor_uloga)==='3'">
          <label for="imeKompanije">Ime kompanije:</label>
          <input type="text" v-model="korisnik.kor_ime_kompanije" required/>
        </div>
        <div class="input-group">
          <label for="grad">Grad:</label>
          <input type="text" v-model="korisnik.kor_grad" required pattern="[A-Za-z ]+" title="Molimo unesite samo slova" />
        </div>
        <div class="input-group">
          <label for="grad">Država:</label>
          <input type="text" v-model="korisnik.kor_drzava" required pattern="[A-Za-z ]+" title="Molimo unesite samo slova" />
        </div>
        
      </div>
        
      <div class="input-row">
        <div class="input-group" >
          <label for="adresa">Adresa:</label>
          <input type="text" v-model="korisnik.kor_adresa" required/>
        </div>
        <div class="input-group">
          <label for="postanskiBroj">Poštanski broj:</label>
          <input type="text" v-model="korisnik.kor_pos_br"required pattern="[0-9]+" title="Molimo unesite samo brojeve" />
        </div>
        <div class="input-group">
          <label for="telefon">Telefon:</label>
          <input type="text" v-model="korisnik.kor_tel" required pattern="[0-9]+" title="Molimo unesite samo brojeve" />
        </div>
        
      </div>
       
     
        <button type="submit" class="btn">Update Profile</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
  

  
    </div>
  </template>
  
  <script setup>
  import { useAuth } from '../auth.js'; 
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  const { state: authState, checkLoginStatus } = useAuth();

  checkLoginStatus();  
  
  const korisnik = ref(null);
  const errorMessage = ref('');
  const successMessage = ref('');
  const korisnikIme = ref('');
  
  const getUserData = async () => {
    try {
      const response = await axios.get('https://localhost:44333/api/users');
      const allUsers = response.data;
      korisnik.value = allUsers.find(user => user.kor_email === authState.korisnik.kor_email);
      console.log(korisnik.value);
    } catch (error) {
      errorMessage.value = 'An error occurred while fetching user data.';
    }
  };
  
  const updateProfile = async () => {
    try {
      await axios.put(`https://localhost:44333/api/users/${korisnik.value.id}`, korisnik.value);
      successMessage.value = 'Profile updated successfully.';
    } catch (error) {
      errorMessage.value = 'An error occurred while updating the profile.';
    }
  };
  
  onMounted(() => {
    getUserData();
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

  background-color: #220813;
  
}

h2 {
  margin-bottom: 20px;
  color:#fff
}

.input-row {
  display: flex;
  gap: 30px;
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
  background-color: #7a7979;
  color: #2f2d2d;
  border: none;
  
}



form {
  padding: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #222749;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #222749;
}

.error {
  color: red;
  margin-top: 10px;
}

.success {
  color: green;
  margin-top: 10px;
}
  </style>
