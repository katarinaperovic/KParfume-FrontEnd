<template>
    <div class="products">
      <h2>Proizvodi</h2>
      <ul>
        <li v-for="product in products" :key="product.id">
          <strong>{{ product.name }}</strong>: {{ product.price }} kn
          <button @click="editProduct(product)">Uredi</button>
        </li>
      </ul>
      <div v-if="editingProduct">
        <h3>Uređivanje proizvoda</h3>
        <form @submit.prevent="saveProduct">
          <label>Ime:</label>
          <input v-model="editedProduct.name" required>
          <label>Cijena:</label>
          <input v-model.number="editedProduct.price" required>
          <button type="submit">Spremi izmjene</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios';
  import { ref } from 'vue';
  
  const products = ref([]);
  const editingProduct = ref(null);
  const editedProduct = ref({});
  
  axios.get('http://localhost:8080/WebShopAppREST/rest/products/')
    .then(response => {
      products.value = response.data;
    })
    .catch(error => console.error(error));
  
  function editProduct(product) {
    editingProduct.value = product;
    editedProduct.value = { ...product };
  }
  
  function saveProduct() {
    axios.put(`http://localhost:8080/WebShopAppREST/rest/products/${editingProduct.value.id}`, editedProduct.value)
      .then(response => {
        // Osvježi proizvode nakon što su ažurirani
        axios.get('http://localhost:8080/WebShopAppREST/rest/products/')
          .then(response => {
            products.value = response.data;
            // Resetiraj uređivanje
            editingProduct.value = null;
            editedProduct.value = {};
          })
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  }
  </script>
  
  <style scoped>
  /* Stilovi za ProductsView */
  </style>
  