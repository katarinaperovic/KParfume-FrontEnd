<template>
    <div class="vesti-view">
       
  
      <div class="vesti-list">
        <div v-if="oceneList && oceneList.length > 0">
        <div v-for="ocena in oceneList" :key="ocena.id" class="vest-card">
            <div class="rating-star">
            {{ ocena.ocn_vrednost }}
          </div>
          <h2 class="vest-title">{{ ocena.ocn_kom }}</h2>
          <p class="vest-text">Datum: {{ ocena.ocn_dat }}</p>
          <!-- Display user details using the users object and ocn_kor_id -->
          <div v-if="users[ocena.ocn_kor_id]" class="user-info">
            <p class="vest-text">
              Email: {{ users[ocena.ocn_kor_id].kor_email }}
            </p>
            <p class="vest-text">
              Ime i prezime: {{ users[ocena.ocn_kor_id].kor_ime }} {{ users[ocena.ocn_kor_id].kor_prezime }}
            </p>
          </div>
       

        </div>
      </div>
      <p v-else class="no-coupons">Nema ocena</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        oceneList: [],
        users: {},
        korisnikUloga: '', 
        korisnikId: '', 
      };
    },
    methods: {
     
      async fetchNews() {
        try {
          const response = await axios.get('https://localhost:44333/api/ocena');
          this.oceneList = response.data;
          // Sortiranje po datumu u opadajućem redosledu
      this.oceneList.sort((a, b) => new Date(b.ocn_dat) - new Date(a.ocn_dat));

 // For each ocn_kor_id, fetch the user details
 await Promise.all(
          this.oceneList.map(async (ocena) => {
            if (!this.users[ocena.ocn_kor_id]) {
              
              const userResponse = await axios.get(
                `https://localhost:44333/api/users/${ocena.ocn_kor_id}`
              );
              
              this.users[ocena.ocn_kor_id] = userResponse.data;
            }
          })
        );

          console.log(this.oceneList);
        } catch (error) {
          console.error("Error fetching ocene:", error);
        }
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
 
  width: 100%; 
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}


  .form-input, .form-textarea {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
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
  
  .vesti-list {
  display: flex;
  flex-wrap: wrap; 
  
  justify-content: center; 
}
.vest-card {
  position: relative;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  max-width: 100%; 
  padding: 60px; 
  margin: 15px;
}
.vest-card:hover {
  transform: translateY(-10px); 
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2); 
}

/* Star icon with rating inside */
.rating-star {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 80px;
  height: 80px;
  background-color: #fff836; /* Orange background */
  clip-path: polygon(
    50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%,
    50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%
  );
  display: flex;
  justify-content: center;
  align-items: center;
  color: #090909;
  font-size: 16px;
  font-weight: bold;
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
/* Style for the user info section */

.user-info {
  width: calc(100% + 120px); 
  margin-left: -60px; 
  background-color: #dedbf491;
  padding: 15px;
  border-radius: 0 0 10px 10px; 
  color: #944444;
}

.user-info p {
  margin: 0;
}

  .delete-btn:hover {
    background-color: #d81919;
  }
  </style>