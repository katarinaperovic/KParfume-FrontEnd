<template>
    <div class="login-container">
      <div class="login" v-if="!authState.isLoggedIn">
        <h2>Login</h2>
        <form @submit.prevent="login">
          <div class="input-group">
            <label for="korisnickoIme">Email:</label>
            <input type="text" v-model="korisnickoIme" required />
          </div>
          <div class="input-group">
            <label for="lozinka">Lozinka:</label>
            <input type="password" v-model="lozinka" required />
          </div>
          <button type="submit" class="btn">Login</button>
        </form>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
      <div class="logged-in" v-else>
        <p>Do you want to log out?</p>
        <button @click="logout" class="btn logout">Logout</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  import { useAuth } from '../auth';  
  import { decodeToken } from '../jwtDecoder';
 

  const { state: authState, login: authLogin, logout: authLogout, checkLoginStatus } = useAuth();
  
  const korisnickoIme = ref('');
  const lozinka = ref('');
  const errorMessage = ref('');
  const router = useRouter();
  
  const login = async () => {
    try {
      const response = await axios.post('https://localhost:44333/api/users/login', {
        kor_email: korisnickoIme.value,
        kor_lozinka: lozinka.value,
      });

      
 const token = response.data.accessToken;
const korisnik = decodeToken(token);
authLogin(korisnik);
console.log(korisnik);

      router.push('/');
    } catch (error) {
  console.error('Error:', error);
  if (error.response) {
    console.error('Error response data:', error.response.data);
    console.error('Error response status:', error.response.status);
    console.error('Error response headers:', error.response.headers);
  } else if (error.request) {
    console.error('Error request:', error.request);
  } else {
    console.error('Error message:', error.message);
  }

  if (error.response && error.response.status === 404) {
    errorMessage.value = 'Invalid credentials.';
  } else {
    errorMessage.value = 'An error occurred. Please try again later.';
  }
}

  };
  
  const logout = () => {
    authLogout();  
    router.push('/login');
  };
  
  checkLoginStatus();  
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 15px;
    text-align: center;
    background-color: #7b6366;
    border-radius: 20px;
  }
  
  .login, .logged-in {
    border: 10px solid #ccc;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    background-color: #fff;
  }
  
  h2 {
    margin-bottom: 20px;
  }
  
  .input-group {
    margin-bottom: 15px;
    text-align: left;
  }
  
  .input-group label {
    display: block;
    margin-bottom: 5px;
  }
  
  .input-group input {
    width: calc(100% - 20px); 
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  form {
  padding: 0 10px; 
}
  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    background-color: #513509;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .btn:hover {
    background-color: #d87314;
  }
  
  .logout {
    background-color: #381014;
  }
  
  .logout:hover {
    background-color: #402023;
  }
  
  .error {
    color: red;
    margin-top: 10px;
  }
  </style>