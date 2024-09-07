<template>
  <header>
    <nav v-if="!authState.isLoggedIn" class="navbar stunning-navbar">
      <router-link to="/">Home</router-link>
      <router-link to="/registration">Registration</router-link>
      <router-link to="/login">Login</router-link>
    </nav>
    
    <nav v-if="authState.korisnikUloga === 'administrator' && authState.isLoggedIn" class="navbar stunning-navbar">
      <router-link to="/">Home</router-link>
      <router-link to="/vesti">Vesti</router-link>
      <router-link to="/login">Logout</router-link>
      <router-link to="/users">Users</router-link>

    </nav>

    <nav v-if="authState.korisnikUloga === 'menadzer' && authState.isLoggedIn" class="navbar stunning-navbar">
      <router-link to="/">Home</router-link>
      <router-link to="/vesti">Vesti</router-link>
      <router-link to="/login">Logout</router-link>
    </nav>

    <nav v-if="authState.korisnikUloga === 'radnik' && authState.isLoggedIn" class="navbar stunning-navbar">
      <router-link to="/">Home</router-link>
      <router-link to="/vesti">Vesti</router-link>
      <router-link to="/login">Logout</router-link>
    </nav>

    <nav v-if="authState.korisnikUloga === 'kupac' && authState.isLoggedIn" class="navbar stunning-navbar">
      <router-link to="/">Home</router-link>
      <router-link to="/vesti">Vesti</router-link>
      <router-link to="/login">Logout</router-link>
    </nav>
  </header>

  <router-view />
</template>



<script setup>
import { useAuth } from './auth';  

const { state: authState, checkLoginStatus } = useAuth();

checkLoginStatus();  
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


</style>
