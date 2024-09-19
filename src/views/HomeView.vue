<template>
  <div class="home">
    <div class="background"></div> 
    <div class="content">
     
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
  min-height: 100vh;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; 
  background-image: url('../assets/b1.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  opacity: 0.3;
  filter: blur(3px);
  z-index: -1;
}

.content {
  position: relative;
  z-index: 1;
  color: black;
  min-height: 100vh; 
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}


.logo{
  max-width: 300px;
  max-height: 100px;
}
</style>
