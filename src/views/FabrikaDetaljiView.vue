<template>
  <div>
    <h2>Detalji o fabrici</h2>
    <!-- Ovaj div sadrži samo detalje o fabrici i ima pozadinsku boju -->
    <div v-if="fabrika" class="detalji">
      <img :src="'https://localhost:44333/resources' + fabrika.fab_logo" class="fabrika-logo" alt="Logo fabrike"> <br>
      <strong class="naslov"> {{ fabrika.fab_naziv }}</strong> <br>
      <strong>Radno vreme:</strong> {{ fabrika.fab_vreme_od }}<strong>-</strong>{{ fabrika.fab_vreme_do }} <br>
      <strong>Lokacija:</strong> {{ fabrika.fab_adresa }} <br> 
      {{ fabrika.fab_grad }} {{ fabrika.fab_pos_br }} <br>
    </div>

    <div v-if="fabrika">
      
      <!-- Komentari komponenta sa prosleđenim fabrikaId -->
      <komentari :fabrika="fabrika" :fabrikaId="fabrika.id"></komentari>
    </div>

    <div v-else>
      <p>Učitavanje detalja fabrike...</p>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Komentari from '@/views/KomentariView.vue';

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
.detalji {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: rgba(128, 100, 62, 0.5); /* Ova pozadina je samo za detalje */
  color: beige;
  font-style: italic;
}
.naslov{
  font-size: 30px;
  font-family: fantasy;
}
</style>
