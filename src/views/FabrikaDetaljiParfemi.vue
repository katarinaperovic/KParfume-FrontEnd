<template>
    <div>
      <parfemi :fabrika="fabrika" :fabrikaId="fabrikaId"></parfemi>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios';
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import Parfemi from '@/views/ParfemiView.vue';
  
  const router = useRouter();
  const fabrika = ref(null);
  const fabrikaId = ref(null); 
  
  onMounted(() => {
    loadFabrikaDetails();
  });
  
  async function loadFabrikaDetails() {
    try {
      const id = router.currentRoute.value.params.id; 
      const response = await axios.get(`https://localhost:44333/api/fabrika/${id}`);
      fabrika.value = response.data;
      fabrikaId.value = id; 
    } catch (error) {
      console.error('Greška prilikom učitavanja detalja fabrike:', error);
    }
  }
  </script>
  
  <style scoped>

  </style>
  