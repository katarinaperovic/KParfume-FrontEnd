<!-- NewsDetailView.vue -->
<template>
    <div class="news-detail">
      
      <div v-if="vest && vest.ves_naslov" class="news-detail">
        <h1>{{ vest.ves_naslov }}</h1>
        <p>Datum objavljivanja: {{ vest.ves_datum !== '0001-01-01' ? vest.ves_datum : 'Datum nije dostupan' }}</p>
        <img :src="'https://localhost:44333/resources' + vest.ves_slika" alt="Slika vesti" class="vest-image">
       
        <p>{{ vest.ves_tekst }}</p>
        </div>
  
      <h2>Komentari</h2>
      <div v-if="komentari.length > 0">
        <div v-for="komentar in komentari" :key="komentar.id" class="komentar">
          <p v-if="users[komentar.kom_kor_id]">
            <strong>{{ users[komentar.kom_kor_id]?.kor_email || 'Nepoznat korisnik' }}</strong> 
            ({{ komentar.kom_datum }}):
          </p>
          <p>{{ komentar.kom_tekst }}</p>
          <button class="dbutton" v-if="String(vest.ves_admin_id) === String(korisnikId)" @click="deleteKomentar(String(komentar.id))">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 6h18v2H3V6zm2 4h14l-1 12H6L5 10zm10-6V1H9v3H4v2h16V3h-5z"/>
  </svg>
</button>
        </div>
      </div>
      <p v-else>Nema još komentara</p>
  
      <div v-if="korisnikUloga==='kupac'">
        <h3>Dodaj komentar</h3>
        <form @submit.prevent="submitComment">
          <textarea v-model="newComment" placeholder="Unesite komentar" required></textarea>
          <button type="submit">Objavi</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: ['id'],
    data() {
      return {
        vest: {}, 
        komentari: [], 
        newComment: '', 
        korisnikId: '', 
        korisnikUloga:'',
        users: {},
      };
    },
    methods: {
      async fetchVest() {
        try {
          const response = await axios.get(`https://localhost:44333/api/vest/${this.id}`);
          this.vest = response.data;
         
        } catch (error) {
          console.error('Error fetching news:', error);
        }
      },
      async fetchComments() {
        try {
          const response = await axios.get(`https://localhost:44333/api/komentar/vest/${this.id}`);
          this.komentari = response.data.value;

           // user details
        await Promise.all(
          this.komentari.map(async (komentar) => {
            if (!this.users[komentar.kom_kor_id]) {
              
              const userResponse = await axios.get(
                `https://localhost:44333/api/users/${komentar.kom_kor_id}`
              );
              
              this.users[komentar.kom_kor_id] = userResponse.data;
            }
          })
        );



          console.log(this.komentari);
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      },async deleteKomentar(commentId) {
      try {
        console.log(`Deleting comment with ID: ${commentId}`); 
        await axios.delete(`https://localhost:44333/api/komentar/${commentId}`);
        this.komentari = this.komentari.filter(komentar => String(komentar.id) !== String(commentId));
      } catch (error) {
        console.error("Error deleting news:", error);
      }
    },
      async submitComment() {
        try {
            const today = new Date();
            const kom_d = today.toISOString().split('T')[0]; 
          await axios.post('https://localhost:44333/api/komentar', {
            kom_kor_id: this.korisnikId,
            kom_ves_id: this.id,
            kom_tekst: this.newComment,
            kom_datum: kom_d
          });
          this.newComment = '';
          this.fetchComments(); 
        } catch (error) {
          console.error('Error submitting comment:', error);
        }
      },
    },
    mounted() {
      this.fetchVest();
      this.fetchComments();
  
      const korisnik = JSON.parse(localStorage.getItem('korisnik'));
      this.korisnikUloga = korisnik ? korisnik.kor_uloga : '';
      this.korisnikId = korisnik ? korisnik.id : null;
    },
  };
  </script>
  
  <style scoped>
  .news-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  color: white; 
  background-color: #333; 
  border-radius: 10px;
}

.vest-image {
  width: 100%;
  max-width: 600px; /* Max width of the image */
  max-height: 400px; /* Max height of the image */
  object-fit: cover; /* Ensure the image keeps aspect ratio */
  margin-bottom: 20px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

h1 {
  color: white; 
}

p {
  color: white; 
}

textarea {
  width: 100%;
  background-color: #444; /* Dark background for textarea */
  color: white; /* White text in textarea */
  padding: 10px;
  margin-bottom: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #45a049;
}
.dbutton {
  position: absolute;
  top: 10px; /* Position from the top */
  right: 10px; /* Position from the right */
  background-color: #ff0000;
  color: white;
  padding: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dbutton:hover {
    background-color: #cc0000;
}



/* Style for individual comments */
.komentar {
  background-color: #6f6e6e; /* Dark background for each comment */
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  color: white;
  position: relative; 
}

.komentar p {
  margin: 5px 0;
}

.komentar strong {
  font-weight: bold;
  color:#d2d1f1; /* Different color for the user's name */
}
  </style>
  