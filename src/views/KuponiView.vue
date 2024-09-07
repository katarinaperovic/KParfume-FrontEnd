<template>
    <div class="vesti-view">
       
  
      <div class="vesti-list">
        <div v-if="kuponiList && kuponiList.length > 0">
        <div v-for="kupon in kuponiList" :key="kupon.id" class="vest-card">
          <h2 class="vest-title">{{ kupon.kpn_kod }}</h2>
          <p class="vest-text">Popust: {{ truncateText(kupon.kpn_popust, 100) }} %</p>
          <p class="vest-text">{{ truncateText(kupon.kpn_opis, 100) }}</p>
          <p v-if="kupon.kpn_pk_valid==true" class="vest-text">VALIDAN SAMO ZA PRVU KUPOVINU</p>
       

        </div>
      </div>
 
  <p v-else class="no-coupons">Nemate dodeljenih kupona</p>
  </div>
      
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        kuponiList: [], 
        isCreatingNews: false,
        korisnikUloga: '', 
        korisnikId: '', 
      };
    },
    methods: {
     
      async fetchNews() {
        try {
          const response = await axios.get('https://localhost:44333/api/kupon');
          this.kuponiList = response.data.filter(k=>String(k.kpn_kor_id)===String(this.korisnikId));
          console.log(this.vestiList);
        } catch (error) {
          console.error("Error fetching kuponi:", error);
        }
      },
      
      truncateText(text, length) {
        return text.length > length ? text.substring(0, length) + '...' : text;
      },
     
    
},
    mounted() {
  this.fetchNews(); 

  const korisnik = JSON.parse(localStorage.getItem('korisnik'));
  this.korisnikUloga = korisnik ? korisnik.kor_uloga : '';
  this.korisnikId = korisnik ? korisnik.id : '';

  console.log(this.korisnikId);
}

  };
  </script>
  
  <style scoped>
  
  .vesti-view {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Arial', sans-serif;
  }
  
  .create-news-btn {
    display: inline-block;
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    margin-bottom: 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }
  
  .create-news-btn:hover {
    background-color: #45a049;
  }
  
  .create-news-form {
    margin-bottom: 30px;
  }
  
  .form-input, .form-textarea {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
  } 
  .custom-file-input {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  margin: 10px 0;
  cursor: pointer;
  background-color: #f9f9f9;
}

.custom-file-input input[type="file"] {
  display: none;
}

.file-label {
  flex-grow: 1;
  padding-right: 10px;
}

.custom-file-input:hover {
  background-color: #eee;
}
  
  .form-textarea {
    height: 100px;
    resize: none;
  }
  
  .submit-btn {
    background-color: #2196F3;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }
  
  .submit-btn:hover {
    background-color: #0b7dda;
  }
  
  /* News Card Styles */
  .vesti-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .vest-card {
    background-color: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    margin: 13px; 
  }
  
  .vest-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  
  .vest-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }
  
  .vest-title {
    font-size: 20px;
    margin: 15px 15px 10px;
    color: #333;
  }
  
  .vest-text {
    font-size: 16px;
    margin: 0 15px 20px;
    color: #666;
  }
  
  .read-more-btn {
    background-color:#ee770f;
    color: white;
    padding: 10px 20px;
    margin: 10px 15px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }
  
  .read-more-btn:hover {
    background-color:#ca7219;
  }
   .delete-btn {
    background-color: #f80000;
    color: white;
    padding: 10px 20px;
    margin: 10px 15px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }
  .no-coupons {
  color: #ccc;
  text-align: center; 
  font-size: 24px; 
  position: absolute; 
  top: 50%; 
  left: 50%; 
  transform: translate(-50%, -50%);
  width: 100%; 
}

  
  .delete-btn:hover {
    background-color: #d81919;
  }
  </style>