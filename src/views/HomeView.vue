<template>
  <div class="home">
    <div class="background"></div> 
    <div class="content">
      <img alt="Vue logo" class="logo" src="../assets/ch1.jpg">
      <FabrikeView :fabrike="fabrike" @fabrikaAdded="handleFabrikaAdded" />
    </div>
  </div>
</template>

<script>
import FabrikeView from '../views/FabrikeView.vue';
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
  name: 'HomeView',
  components: {
    FabrikeView
  },
  setup() {
    const fabrike = ref([]);

    onMounted(() => {
      loadFabrike();
    });

    function loadFabrike() {
      axios.get('https://localhost:44333/api/fabrika')
        .then(response => {
          fabrike.value = response.data;
        })
        .catch(error => console.error(error));
    }

    function handleFabrikaAdded(newFabrika) {
      loadFabrike(); 
    }

    return { fabrike, handleFabrikaAdded };
  }
}
</script>


<style>
.home {
  position: relative; 
  overflow: hidden; 
  
 
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-image: url('../assets/c.jpg');
  background-size: cover; /* Pokriva celu površinu */
  background-position: center; /* Centriranje slike */
  background-attachment: fixed; /* Fiksiranje slike u odnosu na prozor pretraživača */
  background-repeat: no-repeat; /* Sprečava ponavljanje slike */
  min-height: 100vh;
  opacity: 0.5;
  filter: blur(3px); 
  z-index: -1; 
}

.content {
  position: relative; 
  z-index: 1; 
  color: black; 
  
}

.logo{
  max-width: 300px;
  max-height: 300px;
}
</style>
