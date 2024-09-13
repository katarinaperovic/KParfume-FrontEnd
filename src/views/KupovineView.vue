<template>
    <div class="profile-container" v-if="korisnik">
     
      
    <!-- Search and Sort Options -->
    <div v-if="korisnik.kor_uloga === 'kupac'" class="search-sort">
      <h2>Istorija kupovina</h2>
          <div class="search-filters">
          
          <label for="naziv">Naziv fabrike:</label>
          <input v-model="searchCriteria.nazivFabrike" id="naziv" type="text" />
        
  
            <label for="priceFrom">Cena od:</label>
            <input v-model.number="searchCriteria.priceFrom" id="priceFrom" type="number" />
  
            <label for="priceTo">Cena do:</label>
            <input v-model.number="searchCriteria.priceTo" id="priceTo" type="number" />
  
          </div>
          <div class="search-filters">
  <label for="dateFrom">Datum od:</label>
  <input v-model="searchCriteria.dateFrom" id="dateFrom" type="date" />

  <label for="dateTo">Datum do:</label>
  <input v-model="searchCriteria.dateTo" id="dateTo" type="date" />

  <label for="sortField">Sortiraj po:</label>
  <select v-model="sortCriteria.field" id="sortField">
    <option value="nazivFabrike">Naziv fabrike</option>
    <option value="cena">Cena</option>
    <option value="datumVreme">Datum</option>
  </select>

  <label for="sortOrder">Redosled:</label>
  <select v-model="sortCriteria.order" id="sortOrder">
    <option value="asc">Rastuće</option>
    <option value="desc">Opadajuće</option>
  </select>
</div>

        </div>
  
  <!-- Prikaz kupovina -->
  <div v-if="korisnik.kor_uloga === 'kupac'" class="purchase-section">
      <div v-if="filteredKupovine.length === 0">Nemate kupovina.</div>
      <div v-for="kupovina in sortedKupovine" :key="kupovina.id" class="purchase">
        <p>Datum i vreme: {{ new Date(kupovina.kup_datum).toLocaleString() }}</p>
        <p class="ukcena">Ukupna cena: {{ kupovina.kup_uk_cena }} rsd</p>
  
        
        <span v-if="fabrike.length === 0">Nema fabrike</span>
          <div v-if="fabrike.length > 0" class="redovi">
            Naziv: <strong>{{ getFabrikaInfo(kupovina.kup_fab_id).fab_naziv }}</strong> 
            Lokacija: <strong>{{  getFabrikaInfo(kupovina.kup_fab_id).fab_adresa }}</strong> ,
            <strong>{{  getFabrikaInfo(kupovina.kup_fab_id).fab_pos_br }}</strong>
            ,
            <strong>{{  getFabrikaInfo(kupovina.kup_fab_id).fab_grad }}</strong>,
            <strong>{{  getFabrikaInfo(kupovina.kup_fab_id).fab_drzava }}</strong>
            Radno vreme: <strong>{{  getFabrikaInfo(kupovina.kup_fab_id).fab_vreme_od }}</strong> -
            <strong>{{  getFabrikaInfo(kupovina.kup_fab_id).fab_vreme_do }}</strong> 
            
          </div>
  
          <div class="chocolates-container">
  <div v-for="stavka in kupovina.stavkeKupovine" :key="stavka.id" class="chocolate">
    <img :src="'https://localhost:44333/resources' + getParfemInfo(stavka.sk_par_id).par_slika" class="chocolate-image" alt="Slika parfema">
    <p>Naziv: {{ getParfemInfo(stavka.sk_par_id).par_naziv }}</p>
    <p>Cena: {{ stavka.sk_cena_pj }} rsd</p>
    <p>Količina: {{ stavka.sk_kolicina }}</p>
    <p>Ukupna cena: {{ stavka.sk_cena_pj * stavka.sk_kolicina }} rsd</p>
  </div>
</div>

      
      <div v-if="!hasReview(kupovina.id)">
  <button @click="showCommentForm(kupovina.id)" class="btn">Ostavi komentar</button>
  <div v-if="showCommentForms[kupovina.id]" class="comment-form">
    <textarea v-model="commentText[kupovina.id]" placeholder="Ostavite komentar"></textarea>
    <div>
      <label>Ocena:</label>
      <select v-model="rating[kupovina.id]">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    </div>
    <button @click="submitComment(kupovina.id)" class="btn">Pošalji</button>
    <p v-if="commentError[kupovina.id]" class="error">{{ commentError[kupovina.id] }}</p>
    <p v-if="existingCommentError[kupovina.id]" class="error">{{ existingCommentError[kupovina.id] }}</p>
  </div>
</div>

      </div>
    </div>
  


    <!--MENADZER-->

     <!-- Search and Sort Options -->
     <div v-if="korisnik.kor_uloga === 'menadzer'" class="search-sort">
      <h2>Istorija kupovina iz vaše fabrike</h2>
          <div class="search-filters">
          
            <label for="naziv">Ime kompanije:</label>
          <input v-model="searchCriteria.nazivKompanije" id="naziv" type="text" />

            <label for="priceFrom">Cena od:</label>
            <input v-model.number="searchCriteria.priceFrom" id="priceFrom" type="number" />
  
            <label for="priceTo">Cena do:</label>
            <input v-model.number="searchCriteria.priceTo" id="priceTo" type="number" />
  
          </div>
          <div class="search-filters">

           
  <label for="dateFrom">Datum od:</label>
  <input v-model="searchCriteria.dateFrom" id="dateFrom" type="date" />

  <label for="dateTo">Datum do:</label>
  <input v-model="searchCriteria.dateTo" id="dateTo" type="date" />

  <label for="sortField">Sortiraj po:</label>
  <select v-model="sortCriteria.field" id="sortField">
    <option value="nazivKompanije">Ime kompanije</option>
    <option value="cena">Cena</option>
    <option value="datumVreme">Datum</option>
  </select>

  <label for="sortOrder">Redosled:</label>
  <select v-model="sortCriteria.order" id="sortOrder">
    <option value="asc">Rastuće</option>
    <option value="desc">Opadajuće</option>
  </select>
</div>

        </div>
  
  <!-- Prikaz kupovina -->
  <div v-if="korisnik.kor_uloga === 'menadzer'" class="purchase-section">
      <div v-if="filteredKupovineMen.length === 0">Nemate kupovina.</div>
      <div v-for="kupovina in sortedKupovineMen" :key="kupovina.id" class="purchase">
        <p>Datum i vreme: {{ new Date(kupovina.kup_datum).toLocaleString() }}</p>
        <p class="ukcena">Ukupna cena: {{ kupovina.kup_uk_cena }} rsd</p>
  
        
        <span v-if="users.length === 0">Nema korisnika</span>
          <div v-if="users.length > 0" class="redovi">
            Kompanija: <strong>{{ getUserInfo(kupovina.kup_kor_id).kor_ime_kompanije }}</strong> 
            Ime i prezime menadžera: <strong>{{ getUserInfo(kupovina.kup_kor_id).kor_ime }} {{ getUserInfo(kupovina.kup_kor_id).kor_prezime }}</strong> 
            Telefon: <strong>{{ getUserInfo(kupovina.kup_kor_id).kor_tel }}</strong> 
            <p></p>
            Adresa za slanje: <strong>{{  getUserInfo(kupovina.kup_kor_id).kor_adresa }}</strong> ,
            <strong>{{  getUserInfo(kupovina.kup_kor_id).kor_pos_br }}</strong>
            ,
            <strong>{{  getUserInfo(kupovina.kup_kor_id).kor_grad }}</strong>,
            <strong>{{  getUserInfo(kupovina.kup_kor_id).kor_drzava }}</strong>
            
            
          </div>
  
          <div class="chocolates-container">
  <div v-for="stavka in kupovina.stavkeKupovine" :key="stavka.id" class="chocolate">
    <img :src="'https://localhost:44333/resources' + getParfemInfo(stavka.sk_par_id).par_slika" class="chocolate-image" alt="Slika parfema">
    <p>Naziv: {{ getParfemInfo(stavka.sk_par_id).par_naziv }}</p>
    <p>Cena: {{ stavka.sk_cena_pj }} rsd</p>
    <p>Količina: {{ stavka.sk_kolicina }}</p>
    <p>Ukupna cena: {{ stavka.sk_cena_pj * stavka.sk_kolicina }} rsd</p>
  </div>
</div>



      </div>
    </div>




    </div>
  </template>
  
  <script setup>
  import { useAuth } from '../auth.js'; 
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  const { state: authState, checkLoginStatus } = useAuth();
  import toastr from "toastr";
  import "toastr/build/toastr.min.css";
  
  checkLoginStatus();  
  
  const korisnik = ref(null);
  const errorMessage = ref('');
  const successMessage = ref('');
  const korisnikIme = ref('');
  const recenzije = ref([]);
  const parfemi = ref([]);
  const kupovine = ref([]);
  const fabrike = ref([]);
  const users = ref([]);
  const showCommentForms = ref({});
  const existingCommentError = ref({});
  const commentText = ref({});
  const rating = ref({});
  const commentError = ref({});
  const today= new Date().toISOString().split('T')[0];
  const searchCriteria = ref({
    priceFrom: null,
    priceTo: null,
    dateFrom: null,
    dateTo: null,
    nazivFabrike: '',
    nazivKompanije:''
  });
  
  const sortCriteria = ref({
    field: 'cena',
    order: 'asc',
  });
  
  
 
  const getSveFabrike = async () => {
      try {
        const response = await axios.get(`https://localhost:44333/api/fabrika`);
        fabrike.value = response.data;
      } catch (error) {
        errorMessage.value = 'An error occurred while fetching fabrike data.';
      }
    };
  
    const getFabrikaInfo = (id) => {
      return fabrike.value.find(fabrika => String(fabrika.id) === String(id)) || {};
    };

    const getSviUseri = async () => {
      try {
        const response = await axios.get(`https://localhost:44333/api/users`);
        users.value = response.data;
      } catch (error) {
        errorMessage.value = 'An error occurred while fetching fabrike data.';
      }
    };
  
    const getUserInfo = (id) => {
      return users.value.find(user => String(user.id) === String(id)) || {};
    };
    
    const getParfemInfo = (id) => {
  return parfemi.value.find(parfem => String(parfem.id) === String(id)) || {};
};

   
const getStavkeKupovine = async (kupovinaId) => {
  try {
    const response = await axios.get(`https://localhost:44333/api/stavka-kupovine/kupovina/${kupovinaId}`);
    return response.data;
  } catch (error) {
    errorMessage.value = 'An error occurred while fetching stavke kupovine data.';
    return [];
  }
};


const getKupovine = async () => {
  try {
    const response = await axios.get(`https://localhost:44333/api/kupovina`);
    const kupovineData = response.data;

    // Fetch stavkeKupovine for each kupovina and attach it to the kupovina
    for (const kupovina of kupovineData) {
      kupovina.stavkeKupovine = await getStavkeKupovine(kupovina.id);
    }

    kupovine.value = kupovineData;
  } catch (error) {
    errorMessage.value = 'An error occurred while fetching purchase data.';
  }
};

const getSveParfemi = async () => {
  try {
    const response = await axios.get(`https://localhost:44333/api/parfem`);
    parfemi.value = response.data;
  } catch (error) {
    errorMessage.value = 'An error occurred while fetching parfemi data.';
  }
};

const getSveRecenzije = async () => {
  try {
    const response = await axios.get(`https://localhost:44333/api/recenzija`);
    recenzije.value = response.data;
  } catch (error) {
    errorMessage.value = 'An error occurred while fetching reviews.';
  }
};


const hasReview = (kupovinaId) => {
  return recenzije.value.some(recenzija => String(recenzija.rec_kup_id) === String(kupovinaId));
};

  const filteredKupovine = computed(() => {
    return kupovine.value.filter(kupovina => {
      const matchesPrice = (!searchCriteria.value.priceFrom || kupovina.kup_uk_cena >= searchCriteria.value.priceFrom) &&
                           (!searchCriteria.value.priceTo || kupovina.kup_uk_cena <= searchCriteria.value.priceTo);
      const matchesDate = (!searchCriteria.value.dateFrom || new Date(kupovina.kup_datum.split(' ')[0]) >= new Date(searchCriteria.value.dateFrom)) &&
                          (!searchCriteria.value.dateTo || new Date(kupovina.kup_datum.split(' ')[0]) <= new Date(searchCriteria.value.dateTo));
      const matchesFabrika = !searchCriteria.value.nazivFabrike || getFabrikaInfo(kupovina.kup_fab_id).fab_naziv.toLowerCase().includes(searchCriteria.value.nazivFabrike.toLowerCase());
  
      return String(kupovina.kup_kor_id) === String(korisnik.value.id) && matchesPrice && matchesDate && matchesFabrika;
    }).sort((a, b) => {
      const fabrikaA = getFabrikaInfo(a.kup_fab_id).fab_naziv.toLowerCase();
      const fabrikaB = getFabrikaInfo(b.kup_fab_id).fab_naziv.toLowerCase();
      if (fabrikaA < fabrikaB) return -1;
      if (fabrikaA > fabrikaB) return 1;
      return 0;
    });
  });

  const filteredKupovineMen = computed(() => {
    return kupovine.value.filter(kupovina => {
      const matchesPrice = (!searchCriteria.value.priceFrom || kupovina.kup_uk_cena >= searchCriteria.value.priceFrom) &&
                           (!searchCriteria.value.priceTo || kupovina.kup_uk_cena <= searchCriteria.value.priceTo);
      const matchesDate = (!searchCriteria.value.dateFrom || new Date(kupovina.kup_datum.split(' ')[0]) >= new Date(searchCriteria.value.dateFrom)) &&
                          (!searchCriteria.value.dateTo || new Date(kupovina.kup_datum.split(' ')[0]) <= new Date(searchCriteria.value.dateTo));
      const matchesKompanija = !searchCriteria.value.nazivKompanije || getUserInfo(kupovina.kup_kor_id).kor_ime_kompanije.toLowerCase().includes(searchCriteria.value.nazivKompanije.toLowerCase());
  
      return String(kupovina.kup_fab_id) === String(korisnik.value.kor_fab_id) && matchesPrice && matchesDate && matchesKompanija;
    }).sort((a, b) => {
      const uA = getUserInfo(a.kup_kor_id).kor_ime_kompanije.toLowerCase();
      const uB = getUserInfo(b.kup_kor_id).kor_ime_kompanije.toLowerCase();
      if (uA < uB) return -1;
      if (uA > uB) return 1;
      return 0;
    });
  });
  
  const sortedKupovine = computed(() => {
    return [...filteredKupovine.value].sort((a, b) => {
      let compareResult = 0;
      if (sortCriteria.value.field === 'cena') {
        compareResult = a.kup_uk_cena - b.kup_uk_cena;
      } else if (sortCriteria.value.field === 'datumVreme') {
        const dateA = new Date(a.kup_datum.split(' ')[0]);
        const dateB = new Date(b.kup_datum.split(' ')[0]);
        compareResult = dateA - dateB;
      } else if (sortCriteria.value.field === 'nazivFabrike') {
        const fabrikaA = getFabrikaInfo(a.kup_fab_id).fab_naziv.toLowerCase();
        const fabrikaB = getFabrikaInfo(b.kup_fab_id).fab_naziv.toLowerCase();
        compareResult = fabrikaA < fabrikaB ? -1 : (fabrikaA > fabrikaB ? 1 : 0);
      }
  
      return sortCriteria.value.order === 'asc' ? compareResult : -compareResult;
    });
  });

  const sortedKupovineMen = computed(() => {
    return [...filteredKupovineMen.value].sort((a, b) => {
      let compareResult = 0;
      if (sortCriteria.value.field === 'cena') {
        compareResult = a.kup_uk_cena - b.kup_uk_cena;
      } else if (sortCriteria.value.field === 'datumVreme') {
        const dateA = new Date(a.kup_datum.split(' ')[0]);
        const dateB = new Date(b.kup_datum.split(' ')[0]);
        compareResult = dateA - dateB;
      } else if (sortCriteria.value.field === 'nazivKompanije') {
        const userA = getUserInfo(a.kup_kor_id).kor_ime_kompanije.toLowerCase();
        const userB = getUserInfo(b.kup_kor_id).kor_ime_kompanije.toLowerCase();
        compareResult = userA < userB ? -1 : (userA > userB ? 1 : 0);
      }
  
      return sortCriteria.value.order === 'asc' ? compareResult : -compareResult;
    });
  });
  

  const showCommentForm = (kupovinaId) => {
    showCommentForms.value[kupovinaId] = !showCommentForms.value[kupovinaId];
  };
  
  const submitComment = async (kupovinaId) => {
    if (!rating.value[kupovinaId] || rating.value[kupovinaId] <= 0) {
      commentError.value[kupovinaId] = 'Morate ostaviti ocenu da biste poslali komentar.';
      return;
    }
    try {
      const commentData = {
        rec_ocena: rating.value[kupovinaId],
        rec_tekst: commentText.value[kupovinaId],
        rec_status: 0,
        rec_kor_id : korisnik.value.id,
        rec_kup_id: kupovinaId
      };
  
      await axios.post(`https://localhost:44333/api/recenzija`, commentData);
      successMessage.value = 'Comment submitted successfully.';
      toastr.success("Komentar je uspešno poslat na odobravanje!");
      commentText.value[kupovinaId] = '';
      commentError.value[kupovinaId]='';
      rating.value[kupovinaId] = null;
      existingCommentError.value[kupovinaId] = '';
      showCommentForms.value[kupovinaId] = false;
      await getKupovine();
      await getSveRecenzije();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        commentError.value[kupovinaId]='';
        successMessage.value = '';
        existingCommentError.value[kupovinaId] = 'Već ste ostavili komentar.';
      } else {
        successMessage.value = '';
        commentError.value[kupovinaId] = 'An error occurred while submitting the comment.';
      }
    }
  };
  
  
  onMounted(async () => {
  const storedKorisnik = JSON.parse(localStorage.getItem('korisnik'));
  if (storedKorisnik) {
    korisnik.value = storedKorisnik;
  } else {
    console.error("Korisnik nije pronađen u localStorage.");
  }

  await getSveFabrike();  
  await getSviUseri();  
  await getSveParfemi();  
  getKupovine();  
  await getSveRecenzije();  
});

  </script>
  
  <style scoped>
  .profile-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f971;
}

h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 26px;
  font-family: 'Arial', sans-serif;
}

.input-row,
.search-filters,
.sort-options {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.input-group {
  flex: 1;
  margin-bottom: 15px;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: bold;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.input-group input:focus,
.input-group select:focus {
  border-color: #007bff;
  outline: none;
}

form {
  padding: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

.btn:hover {
  background-color: #0056b3;
}

.ukcena{
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 26px;

}
.error {
  color: red;
  margin-top: 10px;
}

.success {
  color: green !important;
  margin-top: 10px;
}

.purchase {
  border-bottom: 1px solid #ddd;
  padding-bottom: 15px;
  margin-bottom: 15px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
}

.chocolates-container {
  display: flex;
  overflow-x: auto;
  gap: 15px;
  padding: 10px 0;
}

.chocolate {
  flex: 0 0 auto;
  width: 180px;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: #ddd;
  text-align: center;
}

.chocolate:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.chocolate img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  margin-bottom: 10px;
}

.chocolate p {
  margin: 5px 0;
  color: #333;
}

.redovi {
  margin-top: 10px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #47214a;
  margin-bottom: 10px;
  color: #add3d3;
}

.comment-form textarea {
  width: 90%;
  height: 80px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.comment-form select {
  margin-bottom: 10px;
}

.search-sort {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}
.search-filters {
  display: flex;
  gap: 10px; 
  flex-wrap: wrap; 
  align-items: center; 
}

.search-filters label {
  margin-bottom: 0; 
}

.search-filters input,
.search-filters select {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
}


label {
  color: #333;
}

input, select {
  border-radius: 4px;
  border: 1px solid #ddd;
  padding: 10px;
}

  </style>
  