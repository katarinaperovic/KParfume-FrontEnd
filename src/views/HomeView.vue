<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
  name: 'HomeView',
  components: {
   
  },
  setup() {
    const products = ref([]);

    onMounted(() => {
      
    })

    

    return {  };
  }
}
</script>