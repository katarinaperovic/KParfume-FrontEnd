<template>
  <header>
    <nav v-if="!authState.isLoggedIn" class="navbar stunning-navbar">
      <router-link to="/">Home</router-link>
      <router-link to="/registration">Registracija</router-link>
      <router-link to="/login">Login</router-link>
    </nav>
    
    <nav v-if="authState.korisnikUloga === 'administrator' && authState.isLoggedIn" class="navbar stunning-navbar">
      <router-link to="/">Home</router-link>
      <router-link to="/vesti">Vesti</router-link>
      <router-link to="/ocene">Ocene</router-link>
      <router-link to="/users">Korisnici</router-link>
      <router-link v-if="authState.isLoggedIn" to="/profile">Profil</router-link> 
      <router-link to="/login">Logout</router-link>
      

    </nav>

    <nav v-if="authState.korisnikUloga === 'menadzer' && authState.isLoggedIn" class="navbar stunning-navbar">
      <router-link to="/">Home</router-link>
      <router-link to="/vesti">Vesti</router-link>
      <router-link to="/komentariZahtevi">Zahtevi za komentar </router-link>
      <router-link v-if="authState.isLoggedIn" to="/profile">Profil</router-link> 
      <router-link to="/login">Logout</router-link>
    </nav>

    <nav v-if="authState.korisnikUloga === 'radnik' && authState.isLoggedIn" class="navbar stunning-navbar">
      <router-link to="/">Home</router-link>
      <router-link to="/vesti">Vesti</router-link>
      <router-link v-if="authState.isLoggedIn" to="/profile">Profil</router-link> 
      <router-link to="/login">Logout</router-link>
    </nav>

    <nav v-if="authState.korisnikUloga === 'kupac' && authState.isLoggedIn" class="navbar stunning-navbar">
      <router-link to="/">Home</router-link>
      <router-link to="/vesti">Vesti</router-link>
      <router-link to="/kuponi">Kuponi</router-link>
      <router-link v-if="authState.isLoggedIn" to="/profile">Profil</router-link> 
      <router-link to="/login">Logout</router-link>
    </nav>
  </header>


  <button v-if="authState.korisnikUloga !== 'administrator' && authState.isLoggedIn"class="rate-app-btn" @click="showRatingForm = true">
      Ocenite aplikaciju
    </button>

    <!-- Rating Form Modal -->
   <!-- Rating Form Modal -->
   <div v-if="showRatingForm" class="rating-modal">
      <div class="rating-form">
        <!-- Close Button -->
        <button class="close-modal" @click="showRatingForm = false">&times;</button>
        
        <h3>Oceni aplikaciju</h3>
        
        <!-- Star Rating System -->
        <div class="star-rating">
          <input v-model="rating.ocn_vrednost" type="radio" id="star5" value="5" />
          <label for="star5">&#9733;</label>
          <input v-model="rating.ocn_vrednost" type="radio" id="star4" value="4" />
          <label for="star4">&#9733;</label>
          <input v-model="rating.ocn_vrednost" type="radio" id="star3" value="3" />
          <label for="star3">&#9733;</label>
          <input v-model="rating.ocn_vrednost" type="radio" id="star2" value="2" />
          <label for="star2">&#9733;</label>
          <input v-model="rating.ocn_vrednost" type="radio" id="star1" value="1" />
          <label for="star1">&#9733;</label>
        </div>

        <!-- Comment Box -->
        <textarea v-model="rating.ocn_kom" placeholder="Vaš komentar" required></textarea>

        <!-- Submit Button -->
        <button @click="submitRating">Pošalji</button>
      </div>
    </div>

  <router-view />
</template>



<script setup>
import { useAuth } from './auth';  
import { ref, onMounted,inject } from 'vue';

const { state: authState, checkLoginStatus } = useAuth();
const showRatingForm = ref(false);
const rating = ref({
  ocn_kor_id: null,  // Set user ID from auth state if available
  ocn_vrednost: null,
  ocn_kom: '',
  ocn_dat: new Date().toISOString().split('T')[0], 
});
const korisnikId = ref('');
checkLoginStatus();  
onMounted(() => {
  const korisnik = JSON.parse(localStorage.getItem('korisnik'));
  korisnikId.value = korisnik ? korisnik.id : '';
  console.log(korisnikId.value);
  rating.value.ocn_kor_id = korisnikId.value; 
});

const submitRating = async () => {
  try {
    if (!rating.value.ocn_kom.trim()) {
      alert('Komentar je obavezan! Molimo popunite komentar.');
      return;
    }
   
    const response = await fetch('https://localhost:44333/api/ocena', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rating.value),
    });
    
      showRatingForm.value = false; 
      rating.value.ocn_kor_id='';
      rating.value.ocn_kom='';
      rating.value.ocn_vrednost='';
      rating.value.ocn_dat='';
    
  } catch (error) {
    console.error('Error submitting rating:', error);
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

header {
  width: 100%;
  background: linear-gradient(135deg, #543a51, #5b2121); /* Gradient background */
  padding: 5px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  position: -webkit-sticky; 
  position: sticky; 
  top: 0; 
  z-index: 1000; /* Ensure it's above other elements */
 
}

.stunning-navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  position: relative;
}

.stunning-navbar a {
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  padding: 15px 30px;
  margin: 0 15px;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.1);
  transition: background 0.5s ease, box-shadow 0.3s ease, transform 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.stunning-navbar a::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 300%;
  height: 300%;
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-50%) translateY(-50%) rotate(45deg);
  transition: all 0.6s ease;
  opacity: 0;
  border-radius: 50%;
  z-index: -1;
}

.stunning-navbar a:hover {
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.5);
  transform: translateY(-5px);
}

.stunning-navbar a:hover::before {
  opacity: 1;
  transform: translateX(-50%) translateY(-50%) rotate(0deg);
  width: 150%;
  height: 150%;
}

.stunning-navbar a::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.7);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s ease-in-out;
}

.stunning-navbar a:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* Optional: Glow Effect */
header:before {
  content: '';
  position: absolute;
  top: -100px;
  left: -100px;
  width: 200px;
  height: 200px;
  background-color: rgba(252, 70, 107, 0.7);
  filter: blur(100px);
  z-index: -1;
  animation: glow 5s infinite alternate;
}

header:after {
  content: '';
  position: absolute;
  bottom: -100px;
  right: -100px;
  width: 200px;
  height: 200px;
  background-color: rgba(63, 94, 251, 0.7);
  filter: blur(100px);
  z-index: -1;
  animation: glow 5s infinite alternate;
}

@keyframes glow {
  0% {
    transform: translateX(0) translateY(0);
  }
  100% {
    transform: translateX(30px) translateY(30px);
  }
}

body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background-color: #2c3e50;
}

.rate-app-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #ff5722;
  color: white;
  border: none;
  border-radius: 50%;
  width: 90px;
  height: 60px;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s;
  z-index: 9999;
}

.rate-app-btn:hover {
  transform: scale(1.1);
  background-color: #5b2121;
}

/* Modal Styling */
.rating-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8); /* Darker background for better focus */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensures it appears above everything */
}

/* Modal content styling */
.rating-form {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  width: 400px;
  text-align: center;
  position: relative;
  z-index: 1001;
}


.rating-form input, .rating-form textarea {
  width: 100%;
  margin: 10px 0;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
}


.rating-form button {
  background-color: #ff5722;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.rating-form button:hover {
  background-color: #e64a19;
}

/* Star Rating Styling */
.star-rating {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  flex-direction: row-reverse; 
}

.star-rating input {
  display: none;
}

.star-rating label {
  font-size: 30px;
  color: #ccc;
  padding: 0 5px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.star-rating input:checked ~ label, 
.star-rating input:checked ~ label ~ label, 
.star-rating label:hover, 
.star-rating label:hover ~ label { 
  color: #ffca08;
}


.rating-form .close-modal {
  position: absolute;
  top: 10px;  
  right: 15px; 
  background: transparent;
  border: none;
  font-size: 30px;  
  color: #333;  
  cursor: pointer;
  z-index: 1002;  
}

.rating-form .close-modal:hover {
  color: #594641; 
}


</style>
