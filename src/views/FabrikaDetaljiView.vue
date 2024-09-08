<template>
    <div>
      <h2>Detalji o fabrici</h2>
      <div v-if="fabrika" class="detalji">
       
        <img :src="'https://localhost:44333/resources' + fabrika.fab_logo" class="fabrika-logo" alt="Logo fabrike"> <br>
        <strong>Naziv:</strong> {{ fabrika.fab_naziv }} <br>
        <strong>Radno vreme:</strong> {{ fabrika.fab_vreme_od }}<strong>-</strong>{{ fabrika.fab_vreme_do }} <br>
        <strong>Lokacija:</strong> {{ fabrika.fab_adresa }} <br> 
        {{ fabrika.fab_grad }} {{ fabrika.fab_pos_br }} <br>
        <!--
        <strong>Ocena: </strong>
          <span v-if="fabrika.ocena !== 0">{{ fabrika.ocena }}</span>
          <span v-else>Nema još ocena</span>-->
        
      </div>
      
      <div v-else>
        <p>Učitavanje detalja fabrike...</p>
      </div>
      <!-- Prosleđujemo fabrikaId komponenti Cokolade i komentarima -->
      <!--<komentari :fabrika="fabrika" :fabrikaId="fabrikaId"></komentari>-->
      <parfemi :fabrika="fabrika" :fabrikaId="fabrikaId"></parfemi>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios';
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import Parfemi from '@/views/ParfemiView.vue';
  //import Komentari from '@/views/KomentariView.vue';
  
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
  .fabrika-logo {
    width: 100px;
    height: 100px;
  }
.detalji{
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: rgba(128, 100, 62, 0.5);
  color: beige;
}
  </style>
  