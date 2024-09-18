<template>
  <div class="fabrike">
    <h2>Fabrike</h2>
    
    <button @click="showNewFactoryDialog = true" class="novaFabrika" v-if="korisnikUloga === 'administrator'">
    Dodaj novu fabriku
  </button>
    <div v-if="showNewFactoryDialog" class="modal-overlay" @click.self="showNewFactoryDialog = false">
      <div class="modal-content">
        <h3>Dodaj novu fabriku</h3>
        <form @submit.prevent="dodajFabriku">
          <div class="form-row1">
            <div class="input-group">
              <label>Naziv:</label>
              <input v-model="novaFabrika.fab_naziv" required>
            </div>
            <div class="input-group">
            <label>Logo:</label>
           
            <input type="file" @change="onFileSelected" accept="image/*" required>
          </div>

         
          </div>
          <div class="form-row1">
            <div class="input-group">
              <label>Radno vreme od:</label>
              <input v-model="novaFabrika.fab_vreme_od" required>
            </div>
            <div class="input-group">
              <label>Radno vreme do:</label>
              <input v-model="novaFabrika.fab_vreme_do" required>
            </div>
          </div>
          <div class="form-row1">
            <div class="input-group">
              <label>Ulica i broj:</label>
              <input v-model="novaFabrika.fab_adresa" >
            </div>
            <div class="input-group">
              <label>Poštanski broj:</label>
              <input v-model="novaFabrika.fab_pos_br" required pattern="[0-9]+" title="Molimo unesite samo brojeve">
            </div>
          </div>
          <div class="form-row1">
            <div class="input-group">
              <label>Država:</label>
              <input v-model="novaFabrika.fab_drzava" required pattern="[A-Za-z ]+" title="Molimo unesite samo slova">
            </div>
            <div class="input-group">
              <label>Grad:</label>
              <input v-model="novaFabrika.fab_grad" required pattern="[A-Za-z ]+" title="Molimo unesite samo slova">
            </div>
          </div>
          <div class="form-row1">
            <div class="input-group">
              <label>Telefon:</label>
              <input v-model="novaFabrika.fab_tel" required pattern="[0-9]+" title="Molimo unesite samo brojeve">
            </div>
          </div>
         
      <div class="register">
      
      <form class="pozadinaMen">
        <div class="form-group">
          <p >Dodaj menadzera:</p>
          <label >Email:</label>
          <input type="text" v-model="user.kor_email" required>
        </div>
        <div class="form-group">
          <label for="lozinka">Lozinka:</label>
          <input type="password" id="lozinka" v-model="user.kor_lozinka" required>
        </div>
        <!-- Additional form fields for manager registration -->
        <div class="form-group">
          <label for="ime">Ime:</label>
          <input type="text" id="ime" v-model="user.kor_ime" required pattern="[A-Za-z ]+" title="Molimo unesite samo slova">
        </div>
        <div class="form-group">
          <label for="prezime">Prezime:</label>
          <input type="text" id="prezime" v-model="user.kor_prezime" required pattern="[A-Za-z ]+" title="Molimo unesite samo slova">
        </div>
        <div class="form-group">
          <label for="ulica">Ulica i broj:</label>
          <input type="text" id="ulica" v-model="user.kor_adresa" >
        </div>
        <div class="form-group">
          <label for="grad">Grad:</label>
          <input type="text" id="grad" v-model="user.kor_grad" required pattern="[A-Za-z ]+" title="Molimo unesite samo slova">
        </div>
        <div class="form-group">
          <label for="posbroj">Poštanski broj:</label>
          <input type="text" id="posbroj" v-model="user.kor_pos_br" required pattern="[0-9]+" title="Molimo unesite samo brojeve">
        </div>
        <div class="form-group">
          <label for="drzava">Država:</label>
          <input type="text" id="drzava" v-model="user.kor_drzava" required pattern="[A-Za-z ]+" title="Molimo unesite samo slova">
        </div>
        <div class="form-group">
          <label for="telefon">Telefon:</label>
          <input type="text" id="telefon" v-model="user.kor_tel" required pattern="[0-9]+" title="Molimo unesite samo brojeve">
        </div>
        <div class="form-group">
          <label></label>
          </div>
      
        <div v-if="error" class="error">{{ error }}</div>
      </form>
    </div>
  
          <div class="form-actions">
            <button type="submit">Dodaj fabriku</button>
            <button type="button" @click="showNewFactoryDialog = false">Otkaži</button>
          </div>
        </form>
      </div>
    </div>

    <div class="filters">
      <div class="filters-top">
        <input v-model="searchQuery" placeholder="Naziv fabrike...">
        <input v-model="searchLocation" placeholder="Pretraži lokaciju...">
        
        <select v-model="sortKey">
          <option value="">Sortiraj po</option>
          <option value="naziv">Naziv fabrike</option>
          <option value="lokacija">Lokacija</option>
        </select>
        <button @click="sortOrderAsc = !sortOrderAsc">
          Sortiraj {{ sortOrderAsc ? 'opadajuće' : 'rastuće' }}
        </button>
      </div>
      <div class="filters-bottom">
        <label v-if="korisnikUloga === 'menadzer'||korisnikUloga === 'radnik'">
          <input type="checkbox" v-model="filterMyOnly" v-if="korisnikUloga === 'menadzer'||korisnikUloga === 'radnik'"> Moja fabrika
        </label>
      </div>
    </div>

    <div v-for="fabrika in filteredAndSortedFabrike" :key="fabrika.id" :class="['fabrika-item', { 'moja-fabrika': String(korisnikFabrikaId) === String(fabrika.id) }]"
    >
      <div :class="['fabrika-item-border', { 'moja-fabrika-border': korisnikFabrikaId === fabrika.id }]">
        <img :src="'https://localhost:44333/resources' + fabrika.fab_logo" class="fabrika-logo" alt="Logo fabrike">
        <div class="fabrika-details">
          
          <h2><strong>{{ fabrika.fab_naziv }}</strong></h2>
          <p> {{ fabrika.fab_adresa }} ,  {{ fabrika.fab_grad }} , {{ fabrika.fab_drzava }}</p>
          

          <p>Ocena: 
          <span v-if="fabrika.fab_ocena !== 0">{{ fabrika.fab_ocena }}</span>
          <span v-else>Nema još ocena</span>
          </p>
          <button @click="prikaziDetalje(fabrika.id)">Prikaži detalje</button>
          <button @click="prikaziDetalje2(fabrika.id)">Parfemi</button>
          <button @click="toggleForm(fabrika.id)" v-if="korisnikUloga === 'menadzer' && String(korisnikFabrikaId)===String(fabrika.id)">Dodaj novi parfem</button>
          <button @click="toggleFormRadnik(fabrika.id)" v-if="korisnikUloga === 'menadzer' && String(korisnikFabrikaId)===String(fabrika.id)">Dodaj novog radnika</button>
          
          <div v-if="prikaziFormu[fabrika.id]" class="novi-parfem-form">
            <h3>Dodaj novi parfem</h3>
            <form @submit.prevent="dodajParfem(fabrika.id)">
              <div class="form-row">
                <div class="form-group">
                  <label>Naziv:</label>
                  <input v-model="noviParfem.par_naziv" required>
                </div>
                
                <div class="form-group">
                  <label>Cena:</label>
                  <input v-model.number="stavkaCenovnika.sc_cena" required @input="validateCena" title="Molimo unesite broj veći od 0">
                  <span v-if="errors.cena" class="errors">{{ errors.cena }}</span>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Vrsta parfema:</label>
                  <select v-model="noviParfem.par_vp_id" required>
                    <option :value="1">cvetni</option>
                    <option :value="2">orijentalni</option>
                    <option :value="3">citrusni</option>
                    <option :value="4">drvenasti</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Tip parfema:</label>
                  <select v-model="noviParfem.par_tp_id" required>
                    <option :value="1">zimski</option>
                    <option :value="2">prolećni</option>
                    <option :value="3">letnji</option>
                    <option :value="4">jesenji</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Kategorija:</label>
                  <select v-model="noviParfem.par_kp_id" required>
                    <option :value="1">ženski</option>
                    <option :value="2">muški</option>
                    <option :value="3">unisex</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Mililitraža:</label>
                  <input v-model.number="noviParfem.par_mililitraza"  required @input="validateMililitraza" title="Molimo unesite broj veći od 0">
                  <span v-if="errors.mililitraza" class="errors">{{ errors.mililitraza }}</span>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Opis:</label>
                  <textarea v-model="noviParfem.par_opis" required></textarea>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Slika:</label>
                  
                  
            <input type="file" @change="onFileSelected1" accept="image/*" required>
                </div>
              </div>
              <button type="submit">Dodaj parfem</button>
            </form>
          </div>

          <div v-if="prikaziFormuRadnik[fabrika.id]" class="novi-parfem-form">
            <h3>Dodaj novog radnika</h3>
            <form @submit.prevent="dodajRadnika(fabrika.id)">
              <div class="form-row">
                <div class="form-group">
                  <label>Email:</label>
                  <input v-model="noviRadnik.kor_email" required>
                </div>
                <div class="form-group">
                  <label>Lozinka:</label>
                  <input type="password" v-model.password="noviRadnik.kor_lozinka" required>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Ime:</label>
                  <input v-model="noviRadnik.kor_ime" required pattern="[A-Za-z ]+" title="Molimo unesite samo slova">
                </div>
                <div class="form-group">
                  <label>Prezime:</label>
                  <input v-model="noviRadnik.kor_prezime" required pattern="[A-Za-z ]+" title="Molimo unesite samo slova">
                </div>
                
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Grad:</label>
                  <input v-model="noviRadnik.kor_grad" required pattern="[A-Za-z ]+" title="Molimo unesite samo slova" >
                </div>
                <div class="form-group">
                  <label>Država:</label>
                  <input v-model="noviRadnik.kor_drzava" required pattern="[A-Za-z ]+" title="Molimo unesite samo slova">
                </div>
                
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Ulica i broj:</label>
                  <input v-model="noviRadnik.kor_adresa" >
                </div>
                <div class="form-group">
                  <label>Poštanski broj:</label>
                  <input v-model="noviRadnik.kor_pos_br" required pattern="[0-9]+" title="Molimo unesite samo brojeve">
                </div>
                
              </div>
              <div class="form-row">
                
                <div class="form-group">
                  <label>Telefon:</label>
                  <input v-model="noviRadnik.kor_tel" required pattern="[0-9]+" title="Molimo unesite samo brojeve">
                </div>
                
              </div>
              <button type="submit">Dodaj radnika</button>
            </form>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, computed,provide,onMounted,router } from 'vue';
import { useRouter } from 'vue-router';
import HomeView from './HomeView.vue';

export default {
  name: 'FabrikeView',
  props: {
    fabrike: Array
  },
  setup(props,{ emit }) {
    const router = useRouter();
    const prikaziFormu = ref({});
    const prikaziFormuRadnik = ref({});
    const noviParfem = ref({
      par_naziv: '',
      par_opis: '',
      par_slika: '',
      par_kolicina: 0,
      par_mililitraza: 0,
      par_dostupan: false,
      par_obrisan: false,
      par_fab_id: null,
      par_vp_id: 1,
      par_tp_id: 1,
      par_kp_id: 1
    });
    
    const searchQuery = ref('');
    const searchLocation = ref('');
    const sortKey = ref('');
    const sortOrderAsc = ref(true);
    const filterMyOnly = ref(false);
    const showNewFactoryDialog = ref(false);
    const today= new Date().toISOString().split('T')[0];
    const korisnikFabrikaId = ref(''); 
    const korisnikUloga = ref('');
    const novaFabrika = ref({
      fab_naziv: '',
      fab_adresa: '',
      fab_grad:'',
      fab_pos_br:0,
      fab_drzava:'',
      fab_vreme_od:'',
      fab_vreme_do:'',
      fab_tel:'',
      fab_logo:'',
      fab_ocena: 0
    });
    const stavkaCenovnika = ref({
      sc_cena: 0,
      sc_par_id: 0,
      sc_cen_id:0
    });
    const noviRadnik = ref({
      kor_email: "",
      kor_lozinka: "",
      kor_uloga:2,
      kor_ime:"",
      kor_prezime: "",
      kor_adresa:"",
      kor_grad:"",
      kor_pos_br:0,
      kor_drzava:"",
      kor_tel:"",
      kor_fab_id:null,
      kor_ime_kompanije:null
    });
    const user = ref({
      kor_email: "",
      kor_lozinka: "",
      kor_uloga:1,
      kor_ime:"",
      kor_prezime: "",
      kor_adresa:"",
      kor_grad:"",
      kor_pos_br:0,
      kor_drzava:"",
      kor_tel:"",
      kor_fab_id:null,
      kor_ime_kompanije:null
      
    });
    const error = ref(null);
    const errors = ref({
      cena: null,
      mililitraza: null
    });
    
    const isFormValid = computed(() => {
      return noviParfem.value.par_naziv &&
      stavkaCenovnika.value.sc_cena>0 &&
      noviParfem.value.par_tp_id &&
      noviParfem.value.par_vp_id &&
      noviParfem.value.par_kp_id &&
      noviParfem.value.par_mililitraza > 0 &&
      noviParfem.value.par_opis &&
      noviParfem.value.par_slika &&
        !errors.value.cena &&
        !errors.value.mililitraza;
    });
    const validateCena = () => {
      if (stavkaCenovnika.value.sc_cena <= 0) {
        errors.value.cena = 'Cena mora biti veća od 0';
      } else {
        errors.value.cena = null;
      }
    };
    const validateMililitraza = () => {
      if (noviParfem.value.par_mililitraza <= 0) {
        errors.value.mililitraza = 'Mililitraža mora biti veća od 0';
      } else {
        errors.value.mililitraza = null;
      }
    };
   
   
    onMounted(() => {
      
      const korisnik = JSON.parse(localStorage.getItem('korisnik'));
      korisnikUloga.value = korisnik ? korisnik.kor_uloga : '';
      korisnikFabrikaId.value = korisnik ? korisnik.kor_fab_id : '';
      console.log(korisnikFabrikaId);
    });

    function prikaziDetalje(id) {
      router.push(`/fabrike/${id}`);
    }

    function prikaziDetalje2(id) {
      router.push(`/fabrike/parfemi/${id}`);
    }

    function toggleForm(fabrikaId) {
      prikaziFormu.value = { ...prikaziFormu.value, [fabrikaId]: !prikaziFormu.value[fabrikaId] };
    }
    function toggleFormRadnik(fabrikaId) {
      prikaziFormuRadnik.value = { ...prikaziFormuRadnik.value, [fabrikaId]: !prikaziFormuRadnik.value[fabrikaId] };
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

     
     
      novaFabrika.value.fab_logo = response.data.filePath || response.data.path || response.data.url; 
      console.log(novaFabrika.value.fab_logo);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
};

const onFileSelected1 = async (event) => {
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

     
     
      noviParfem.value.par_slika = response.data.filePath || response.data.path || response.data.url; 
     
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
};

   
const dodajParfem = async (fabrikaId) => {
  validateCena();
  validateMililitraza();
  
  if (isFormValid.value) {
    
    const noviParfemData = {
      ...noviParfem.value,
      par_fab_id: fabrikaId,
      par_kolicina: 0,
      par_dostupan: false,
      par_obrisan: false
    };

    try {
      // Cenovnik 
      const cenovnikResponse = await axios.get(`https://localhost:44333/api/cenovnik/fabrikaId/${fabrikaId}`);
      const cenovnikId = cenovnikResponse.data.id;
      stavkaCenovnika.value.sc_cen_id = cenovnikId;
      console.log("Id cenovnika je", cenovnikId);

      // parfem
      const parfemResponse = await axios.post('https://localhost:44333/api/parfem', noviParfemData);
      const parId = parfemResponse.data.id;
      stavkaCenovnika.value.sc_par_id = parId;
      console.log("Id parfema je", parId);

      // StavkaCenovnika 
      console.log("Stavka cenovnika je", stavkaCenovnika.value);
      await axios.post('https://localhost:44333/api/stavka-cenovnika', stavkaCenovnika.value);

      // Reset form after successful addition
      toggleForm(fabrikaId);
      noviParfem.value = {
        par_naziv: '',
        par_opis: '',
        par_slika: '',
        par_kolicina: 0,
        par_mililitraza: 0,
        par_dostupan: false,
        par_obrisan: false,
        par_fab_id: null,
        par_vp_id: 1,
        par_tp_id: 1,
        par_kp_id: 1
      };
      stavkaCenovnika.value = {
        sc_cena: 0,
        sc_par_id: 0,
        sc_cen_id: 0
      };
      errors.value.cena = null;
      errors.value.mililitraza = null;

      
    } catch (error) {
      console.error('Greška:', error);
      alert('Došlo je do greške prilikom dodavanja parfema ili stavke cenovnika.');
    }
  }
};


    function dodajRadnika(fabrikaId) {
      const noviRadnikData = {
        ...noviRadnik.value,
        kor_fab_id: fabrikaId
      };

      axios.post('https://localhost:44333/api/users/register', noviRadnikData)
        .then(response => {
          alert('Radnik uspešno dodat');
          toggleFormRadnik(fabrikaId);
        })
        .catch(error => console.error(error));
    }

    function dodajFabriku() {
      console.log(novaFabrika.value);
  axios.post('https://localhost:44333/api/fabrika', novaFabrika.value)
    .then(response => {
      const fabrikaId = response.data.id; 
      emit('fabrikaAdded', response.data);
      
      user.value.kor_fab_id = fabrikaId;
      
      
      axios.post('https://localhost:44333/api/users/register', user.value)
        .then(response => {
          error.value = null;
          showNewFactoryDialog.value = false;
           
        })
        .catch(error => {
          if (error.response && error.response.status === 409) {
            error.value = "Email već postoji";
          } else {
            console.error('Greška prilikom kreiranja menadžera:', error);
          }
        });
    })
    .catch(error => {
      console.error('Greška prilikom dodavanja fabrike:', error);
    });
}


    const filteredAndSortedFabrike = computed(() => {
      let result = props.fabrike;

      //result = result.filter(fabrika => !fabrika.obrisano);
      // Pretraga
      if (searchQuery.value) {
        result = result.filter(fabrika => 
          fabrika.fab_naziv.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }
      
      if (searchLocation.value) {
        result = result.filter(fabrika => 
          fabrika.fab_grad.toLowerCase().includes(searchLocation.value.toLowerCase())
        );
      }

      // Filtriranje
   
      if (filterMyOnly.value) {
        console.log(korisnikFabrikaId.value);
        result = result.filter(fabrika => String(fabrika.id)===String(korisnikFabrikaId.value));
      }

      // Sortiranje
      if (sortKey.value) {
        result = result.slice().sort((a, b) => {
          let modifier = sortOrderAsc.value ? 1 : -1;
          if (sortKey.value === 'naziv') {
            return a.fab_naziv.localeCompare(b.fab_naziv) * modifier;
          } else if (sortKey.value === 'lokacija') {
            return a.fab_grad.localeCompare(b.fab_grad) * modifier;
          }
        });
      } else {
        
      }

      return result;
    });
   
    return {
      prikaziFormu, noviParfem, searchQuery, stavkaCenovnika, searchLocation, 
      sortKey, sortOrderAsc,prikaziDetalje, toggleForm, dodajParfem, filteredAndSortedFabrike,showNewFactoryDialog,novaFabrika,dodajFabriku,user,korisnikUloga,korisnikFabrikaId,
      dodajRadnika,noviRadnik,prikaziFormuRadnik,toggleFormRadnik,filterMyOnly,today,errors,onFileSelected ,onFileSelected1 ,prikaziDetalje2  }
  }
}
</script>

<style scoped>
.fabrike {
  width: 100%;
  color: #fffdfd;
}



.filters {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
}

.filters-top {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filters-bottom {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.filters input, .filters select, .filters button {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.fabrika-item {
  width: 100%;
  margin-bottom: 20px;
}

.fabrika-item-border {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 2px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}

.fabrika-logo {
  border-radius: 10px;
  width: 100px;
  height: 100px;
  margin-right: 10px;
}

.fabrika-details {
  flex: 1;
  margin-right: 110px;
}



.novi-parfem-form {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: rgba(128, 100, 62, 0.5); 
}

.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-right: 10px;
}

.form-group:last-child {
  margin-right: 0;
}

.form-group label {
  margin-bottom: 5px;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: calc(100% - 16px); 
  background-color: #fff;
}

.fabrika-item button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #4f2a06;
  color: white;
  cursor: pointer;
  margin-left: 5px;
  margin-right: 5px;
}

.fabrika-item button:hover {
  background-color: #020101;
}

.novi-parfem-form button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #4f2a06;
  color: white;
  cursor: pointer;
}

.novi-parfem-form button:hover {
  background-color: #020101;
}

.pozadinaMen{
background-color: #dcaf83;
border-radius: 10px;

}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(111, 78, 27, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  max-width: 600px;
  width: 100%;
  max-height: 80vh; 
  overflow-y: auto; 
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-row1 {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.input-group {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-right: 10px;
}

.input-group:last-child {
  margin-right: 0;
}

.input-group label {
  margin-bottom: 5px;
}

.input-group input,
.input-group select,
.input-group textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: calc(100% - 16px); 
}


.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.form-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #4f2a06;
  color: white;
  cursor: pointer;
}

.form-actions button:hover {
  background-color: #020101;
}
.novaFabrika{
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #ca7219;
  color: white;
  cursor: pointer;
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 10px;
}

.moja-fabrika-border {
  border-color: #ff9800; 
  background-color: #605c11; 
}

.moja-fabrika {
  border-color: #ff9800; 
  background-color: #8d6b16; 
}
.errors{
  color: red;
}

</style>
