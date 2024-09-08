<template>
    <div class="cokolade">
      <h2>Parfemi</h2>
      <span class="nemaparfema" v-if="filteredParfemi.length === 0">Nema parfema</span>
      <div class="card-container">
        <div v-for="parfem in filteredParfemi" :key="parfem.id" class="card">
          <div class="image-container">
            <img :src="'https://localhost:44333/resources' + parfem.par_slika" class="cokolada-image" alt="Logo fabrike">
          </div>
          <div class="card-content">
            <strong>{{ parfem.par_naziv }}</strong>
            <div class="cokolada-details">
              <p>Kategorija: {{ parfem.par_kp_id === 1 ? 'ženski' : parfem.par_kp_id === 2 ? 'muški' : parfem.par_kp_id === 3 ? 'unisex' : 'N/A' }}</p>
              <p>Vrsta: {{ parfem.par_vp_id === 1 ? 'cvetni' : parfem.par_vp_id === 2 ? 'orijentalni' : parfem.par_vp_id === 3 ? 'citrusni' : parfem.par_vp_id === 4 ? 'drvenasti' : 'N/A' }}</p>
              <p>Tip: {{ parfem.par_tp_id === 1 ? 'zimski' : parfem.par_tp_id === 2 ? 'prolećni' : parfem.par_tp_id === 3 ? 'letnji' : parfem.par_tp_id === 4 ? 'jesenji' : 'N/A' }}</p>
              <p>Mililitraža: {{ parfem.par_mililitraza }}ml</p>
              <p>Količina: {{ parfem.par_kolicina }}</p>
              <p>Opis: {{ parfem.par_opis }}</p>
              <p>Dostupnost: {{ parfem.par_dostupan ? 'Dostupan' : 'Nedostupan' }}</p>
            </div>
            <div class="button-container">
              <button @click="editParfem(parfem)" v-if="korisnikUloga === 'menadzer' && String(korisnikFabrikaId) === String(fabrikaId)">Izmeni</button>
              <button @click="editKolicina(parfem)" v-if="korisnikUloga === 'radnik' && String(korisnikFabrikaId) === String(fabrikaId)">Izmeni količinu</button>
              <button @click="confirmDelete(parfem)" v-if="korisnikUloga === 'menadzer' && String(korisnikFabrikaId) === String(fabrikaId)">Obriši</button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal for editing Parfem -->
      <div v-if="editingParfem" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <h3>Uređivanje proizvoda</h3>
          <form @submit.prevent="saveParfem" class="formm">
            <label>Ime:</label>
            <input v-model="editedParfem.par_naziv" required>
            <span v-if="errors.cena" class="errors">{{ errors.cena }}</span>
            <label>Mililitraža:</label>
            <input v-model.number="editedParfem.par_mililitraza" required @input="validateMililitraza" title="Molimo unesite broj veći od 0">
            <span v-if="errors.mililitraza" class="errors">{{ errors.mililitraza }}</span>
            <label>Količina:</label>
            <input v-model.number="editedParfem.par_kolicina" required @input="validateKolicina" title="Molimo unesite broj >=0">
            <span v-if="errors.kolicina" class="errors">{{ errors.kolicina }}</span>
            <label>Opis:</label>
            <input v-model="editedParfem.par_opis" required>
            <label>Slika:</label>
           <!-- <input v-model="editedParfem.par_slika" required>-->
           
        <input type="file" @change="onFileSelected" accept="image/*">
        
        <!-- Display the current or selected image file name -->
        <label v-if="selectedFileName || editedParfem.par_slika">
          
        </label>
        <input v-model="editedParfem.par_slika" disabled>
            <div>
              <button type="submit" class="save-button">Sačuvaj</button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- Modal for editing Kolicina -->
      <div v-if="editingKolicina" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <h3>Izmeni količinu</h3>
          <form @submit.prevent="saveKolicina" class="formm">
            <label>Naziv:</label>
            <input v-model="editedKolicina.par_naziv" disabled>
            <label>Mililitraža:</label>
            <input v-model.number="editedKolicina.par_mililitraza" disabled>
            <label>Količina:</label>
            <input v-model.number="editedKolicina.par_kolicina" required @input="validateKolicinaRadnik" title="Molimo unesite broj >=0">
            <span v-if="errors.kolicinaRadnik" class="errors">{{ errors.kolicinaRadnik }}</span>
            <label>Opis:</label>
            <input v-model="editedKolicina.par_opis" disabled>
            <label>Slika:</label>
            <input v-model="editedKolicina.par_slika" disabled>
            <div>
              <button type="submit" class="save-button">Sačuvaj</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  
  <script setup>
import axios from 'axios';
import { ref, onMounted, computed, defineProps } from 'vue';


const props = defineProps({
  fabrikaId: String
});

const parfemi = ref([]);
const editingParfem = ref(null);
const editedParfem = ref({});

const deletingParfem = ref(null);
const deletedParfem = ref({});

const editingKolicina = ref(null);
const editedKolicina = ref({});

const korisnikFabrikaId = ref(''); 
const korisnikUloga = ref('');
const selectedFileName = ref('');
const errors = ref({
      cena: null,
      mililitraza: null,
      kolicina: null,
      kolicinaRadnik:null
    });

    function closeModal() {
  editingParfem.value = null;
  editingKolicina.value = null;
}
    const validateCena = () => {
  if (editedCokolada.value.cena <= 0) {
    errors.value.cena = 'Cena mora biti veća od 0';
    return false; 
  } else {
    errors.value.cena = null;
    return true; 
  }
};
    const validateMililitraza = () => {
  if (editedParfem.value.par_mililitraza <= 0) {
    errors.value.mililitraza = 'Mililitraža mora biti veća od 0';
    return false; 
  } else {
    errors.value.mililitraza = null;
    return true;
  }
};

const validateKolicina = () => {
  if (editedParfem.value.par_kolicina < 0) {
    errors.value.kolicina = 'Količina mora biti >= 0';
    return false; 
  } else {
    errors.value.kolicina = null;
    return true;
  }
};

const validateKolicinaRadnik = () => {
  if (editedKolicina.value.par_kolicina < 0) {
    errors.value.kolicinaRadnik = 'Količina mora biti >= 0';
    return false; 
  } else {
    errors.value.kolicinaRadnik = null;
    return true;
  }
};


const filteredParfemi = computed(() => {
  return parfemi.value.filter(parfem => 
    String(parfem.par_fab_id) === String(props.fabrikaId) && !parfem.par_obrisan
  );
});


onMounted(() => {
  loadParfemi();
  
  const korisnik = JSON.parse(localStorage.getItem('korisnik'));
    korisnikUloga.value = korisnik ? korisnik.kor_uloga : '';
    korisnikFabrikaId.value = korisnik ? korisnik.kor_fab_id : '';
});

async function loadParfemi() {
  try {
    const response = await axios.get('https://localhost:44333/api/parfem');
    parfemi.value = response.data;
  } catch (error) {
    console.error('Greška prilikom učitavanja parfema:', error);
  }
}

function editParfem(parfem) {
  editingParfem.value = parfem;
  editedParfem.value = {
      par_naziv: parfem.par_naziv,
      par_opis: parfem.par_opis,
      par_slika: parfem.par_slika,
      par_kolicina: parfem.par_kolicina,
      par_mililitraza: parfem.par_mililitraza,
      par_dostupan: parfem.par_dostupan,
      par_obrisan: parfem.par_obrisan,
      par_fab_id: parfem.par_fab_id,
      par_vp_id: parfem.par_vp_id,
      par_tp_id: parfem.par_tp_id,
      par_kp_id: parfem.par_kp_id
  };
}
function editKolicina(parfem) {
  editingKolicina.value = parfem;
  editingParfem.value = null;
  editedKolicina.value = { ...parfem };
}

function pripremaDeleteParfem(parfem) {
  deletingParfem.value = parfem;
  deletedParfem.value = {
    par_naziv: parfem.par_naziv,
      par_opis: parfem.par_opis,
      par_slika: parfem.par_slika,
      par_kolicina: parfem.par_kolicina,
      par_mililitraza: parfem.par_mililitraza,
      par_dostupan: parfem.par_dostupan,
      par_obrisan: true,
      par_fab_id: parfem.par_fab_id,
      par_vp_id: parfem.par_vp_id,
      par_tp_id: parfem.par_tp_id,
      par_kp_id: parfem.par_kp_id
  };
}

function saveParfem() {
  //const cenaValid = validateCena();
  const mililitrazaValid = validateMililitraza();
  const kolicinaValid = validateKolicina();
 
  /*if (!cenaValid || !gramazaValid || !kolicinaValid) {
    return;
  }*/
  if (!mililitrazaValid || !kolicinaValid) {
    return;
  }

  if (editedParfem.value.kolicina > 0) {
    editedParfem.value.par_dostupan = true;
  }
  axios.put(`https://localhost:44333/api/parfem/${editingParfem.value.id}`, editedParfem.value)
    .then(response => {
      loadParfemi();
      editingParfem.value = null;
      editedParfem.value = {};
      errors.value.cena = null;
      errors.value.mililitraza = null;
      errors.value.kolicina = null;
    })
    .catch(error => console.error(error));
}

function saveKolicina() {
  const kolicinaRadnikValid = validateKolicinaRadnik();
 
  if (!kolicinaRadnikValid) {
    return;
  }
  if (editedKolicina.value.par_kolicina > 0) {
    editedKolicina.value.par_dostupan = true;
  }

  console.log(editedKolicina.value.par_kolicina);
  axios.put(`https://localhost:44333/api/parfem/kolicina/${editingKolicina.value.id}`, editedKolicina.value.par_kolicina,
  {
      headers: {
        'Content-Type': 'application/json'  // Ensure the correct content type is set
      }
    }
  )
    .then(response => {
      loadParfemi();
      editingKolicina.value = null;
      editedKolicina.value = {};
      errors.value.kolicina = null;
    })
    .catch(error => console.error(error));
}

function confirmDelete(parfem) {
  if (confirm("Da li ste sigurni da želite da obrišete ovaj proizvod?")) {
    pripremaDeleteParfem(parfem);
    deleteParfem(parfem);
}}

function deleteParfem(parfem) {
    axios.put(`https://localhost:44333/api/parfem/delete/${parfem.id}`)
      .then(response => {
        axios.get('https://localhost:44333/api/parfem')
          .then(response => {
            parfemi.value = response.data;
          })
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  }



  const onFileSelected = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      
      const response = await axios.post('https://localhost:44333/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

     
     
      editedParfem.value.par_slika = response.data.filePath || response.data.path || response.data.url; 
     
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
};
</script>

  
<style scoped>
.cokolade {
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.cokolade h2{
    color:#ddd1f1
}

h2 {
  text-align: center;
  color: #4f2a06;
  font-size: 2.5rem;
  margin-bottom: 30px;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
}

.card {
  width: 320px; 
  background-color: #fefefe;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-10px); 
}

.image-container {
  background-color: #f9f9f9;
  padding: 15px;
  border-bottom: 1px solid #ddd;
}

.cokolada-image {
  width: 100%;
  height: 220px; /* Adjusted for better visuals */
  object-fit: cover;
  border-radius: 10px;
}

.card-content {
  padding: 20px;
  flex-grow: 1; /* Make the content fill available space */
  color: #333;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-content strong {
  font-size: 1.4rem;
  color: #4f2a06;
  margin-bottom: 15px;
}

.cokolada-details p {
  font-size: 1rem;
  color: #555;
  margin: 8px 0;
  display: flex;
  align-items: center;
}

.cokolada-details p::before {
  content: '•'; /* Use a dot for better separation */
  color: #4f2a06;
  margin-right: 8px;
}
.nemaparfema{
    color: #ddd;
    align-content: center;
}

.cokolada-details {
  text-align: left;
  margin-bottom: 15px;
}

.button-container {
  display: flex;
  justify-content: space-between;
  padding: 0 15px 15px 15px;
}

.card button {
  flex: 1;
  padding: 10px;
  margin: 0 5px;
  background-color: #40050a;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.card button:hover {
  background-color: #1d0a0a;
}

.modal-content input{
  padding: 15px;
  background-color: #c7aef4;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}


.errors{
  color: red;
  grid-column: span 2;
  margin-left: 215px;
  
} 

/* For mobile responsiveness */
@media (max-width: 768px) {
  .card {
    width: 100%;
  }
}
/* Modal Styles */
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  
  background-color: rgba(142, 122, 126, 0.534); 

  
}

.modal-content {
 
  background-color: rgb(44, 36, 67); 
  border: 1px solid #ccc;
  border-radius: 15px;
  padding: 20px;
  
  width: 800px;
  max-width: 90%;
  
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-content h3{
    color: #c7aef4;
    font-size: 35px;
}


.close {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 2rem;
  cursor: pointer;
  color: #aaa;
  transition: color 0.3s ease;
}

.close:hover {
  color: #000;
}

.save-button {
  margin-top: 10px;
  padding: 10px;
  width: 100%;
  background-color:#40050a;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-button:hover {
  background-color: #291012;
}
.formm {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  row-gap: 30px;
  width: 70%;
  color: #f3deee;
  font-size: 20px;
  
}
.fo{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  row-gap: 30px;
  width: 70%;
  color: #f3deee;
  font-size: 20px;
  
}
.formm input:disabled {
  background-color: #4f4f4f;
  color: #edeaea;
}

</style>