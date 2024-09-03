<template>
  <nav>
    | <router-link to="/">Home</router-link> |
    <router-link to="/registration">Registration</router-link> | 
    <router-link to="/login">Login</router-link> |
  </nav>
  <router-view/>
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

nav {
  padding: 30px;
}

nav img.logo {
  margin-right: 20px; 
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #ec9408;
}
</style>