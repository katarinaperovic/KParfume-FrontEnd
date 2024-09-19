<template>
    <div class="vesti-view">
        <button v-if="!isCreatingNews" class="create-news-btn" @click="openCreateNewsForm" v-show="korisnikUloga==='administrator'">Kreiraj vest</button>

  
      <div v-if="isCreatingNews" class="create-news-form">
        <form @submit.prevent="createNews">
          <input class="form-input" type="text" v-model="newVest.ves_naslov" placeholder="Naslov" required />
          
          <div class="custom-file-input">
          <label for="file-upload" class="file-label">{{ selectedFileName || 'Odaberite sliku' }}</label>
          <input id="file-upload" type="file" @change="onFileSelected" accept="image/*" required>
        </div>
          <textarea class="form-textarea" v-model="newVest.ves_tekst" placeholder="Tekst" required></textarea>
          <button class="submit-btn" type="submit">Objavi</button>
        </form>
      </div>
  

    <div v-if="!isCreatingNews && vestiList.length === 0" class="no-news-message">
      Trenutno nema vesti.
    </div>

      <div class="vesti-list">
        <div v-for="vest in vestiList" :key="vest.id" class="vest-card">
          <img :src="'https://localhost:44333/resources' + vest.ves_slika" class="vest-image" alt="Slika vesti">
          <h2 class="vest-title">{{ vest.ves_naslov }}</h2>
          <p class="vest-text">{{ truncateText(vest.ves_tekst, 100) }}</p>
         
       
        <button class="read-more-btn" @click="$router.push(`/vest/${vest.id}`)">Pročitajte više</button>
        <button class="delete-btn" v-if="String(vest.ves_admin_id) === String(korisnikId)" @click="deleteVest(vest.id)">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 6h18v2H3V6zm2 4h14l-1 12H6L5 10zm10-6V1H9v3H4v2h16V3h-5z"/>
  </svg>
</button>

        </div>
      </div>
  
      <div v-if="selectedVest">
        <NewsDetail :vest="selectedVest" @commentSubmitted="loadComments(selectedVest.id)" />
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        vestiList: [], 
        newVest: {
          ves_naslov: '',
          ves_slika: '',
          ves_tekst: '',
          ves_admin_id: this.korisnikId, 
        },
        isCreatingNews: false,
        selectedVest: null, // The news item to show in detail
        selectedFileName: '',
        korisnikUloga: '', 
        korisnikId: '', 
      };
    },
    methods: {
      openCreateNewsForm() {
        this.isCreatingNews = !this.isCreatingNews;
      },
      async createNews() {
  try {
    const today = new Date();
    const ves_d = today.toISOString().split('T')[0]; 
    const response = await axios.post('https://localhost:44333/api/vest', {
      ves_naslov: this.newVest.ves_naslov,
      ves_slika: this.newVest.ves_slika,  
      ves_tekst: this.newVest.ves_tekst,
      ves_admin_id: this.korisnikId,
      ves_datum: ves_d
    });
    console.log(this.newVest);
    this.vestiList.push(response.data);
    this.newVest = { ves_naslov: '', ves_slika: '', ves_tekst: '', ves_admin_id: this.korisnikId };
    this.isCreatingNews = false;
  } catch (error) {
    console.error("Error creating news:", error);
  }
}
,
      async fetchNews() {
        try {
          const response = await axios.get('https://localhost:44333/api/vest');
          this.vestiList = response.data;
          console.log(this.vestiList);
        } catch (error) {
          console.error("Error fetching news:", error);
        }
      },
      
      truncateText(text, length) {
        return text.length > length ? text.substring(0, length) + '...' : text;
      },async deleteVest(vestId) {
      try {
        await axios.delete(`https://localhost:44333/api/vest/${vestId}`);
        this.vestiList = this.vestiList.filter(vest => vest.id !== vestId);
      } catch (error) {
        console.error("Error deleting news:", error);
      }
    },
     
    async onFileSelected(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFileName = file.name;
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await axios.post('https://localhost:44333/api/images/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          // Update novaFabrika's logo with the file path from the server response
          this.newVest.ves_slika = response.data.filePath || response.data.path || response.data.url;
         console.log(this.newVest.ves_slika);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
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
  width: 100%;
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
  }
  
  .vest-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  
  
.no-news-message {
  color: #ccc;
  text-align: center; 
  font-size: 24px; 
  position: absolute; 
  top: 50%; 
  left: 50%; 
  transform: translate(-50%, -50%);
  width: 100%; 
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
  
  .delete-btn:hover {
    background-color: #d81919;
  }
  </style>