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
              <input v-model="novaFabrika.fab_logo" required>
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
        <input v-model="searchChocolate" placeholder="Naziv parfema...">
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
        <img :src="fabrika.fab_logo" class="fabrika-logo" alt="Logo fabrike">
        <div class="fabrika-details">
          
          <p> {{ korisnikFabrikaId}}  </p>
          <h2><strong>{{ fabrika.fab_naziv }}</strong></h2>
          <p> {{ fabrika.fab_adresa }}  </p>
          <p>{{ fabrika.fab_grad }} {{ fabrika.fab_pos_br }}</p>
  <!--
          <p>Ocena: 
          <span v-if="fabrika.ocena !== 0">{{ fabrika.ocena }}</span>
          <span v-else>Nema još ocena</span>
          </p>-->
          <button @click="prikaziDetalje(fabrika.id)">Prikaži detalje</button>
          <button @click="toggleForm(fabrika.id)" v-if="korisnikUloga === 'menadzer' && String(korisnikFabrikaId)===String(fabrika.id)">Dodaj novi parfem</button>
          <div v-if="prikaziFormu[fabrika.id]" class="novi-parfem-form">
            <h3>Dodaj novi parfem</h3>
            <form @submit.prevent="dodajParfem(fabrika.id)">
              <div class="form-row">
                <div class="form-group">
                  <label>Naziv:</label>
                  <input v-model="novaCokolada.naziv" required>
                </div>
                <div class="form-group">
                  <label>Cena:</label>
                  <input v-model.number="novaCokolada.cena" required @input="validateCena" title="Molimo unesite broj veći od 0">
                  <span v-if="errors.cena" class="errors">{{ errors.cena }}</span>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Vrsta čokolade:</label>
                  <select v-model="novaCokolada.vrstaCokolade" required>
                    <option value="obicna">Obična</option>
                    <option value="za_kuvanje">Za kuvanje</option>
                    <option value="za_pice">Za piće</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Tip čokolade:</label>
                  <select v-model="novaCokolada.tipCokolade" required>
                    <option value="crna">Crna</option>
                    <option value="mlecna">Mlečna</option>
                    <option value="bela">Bela</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Gramaza:</label>
                  <input v-model.number="novaCokolada.gramaza"  required @input="validateGramaza" title="Molimo unesite broj veći od 0">
                  <span v-if="errors.gramaza" class="errors">{{ errors.gramaza }}</span>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Opis:</label>
                  <textarea v-model="novaCokolada.opis" required></textarea>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Slika:</label>
                  <input v-model="novaCokolada.slika" required>
                </div>
              </div>
              <button type="submit">Dodaj čokoladu</button>
            </form>
          </div>

          <button @click="toggleFormRadnik(fabrika.id)" v-if="korisnikUloga === 'menadzer' && String(korisnikFabrikaId)===String(fabrika.id)">Dodaj novog radnika</button>
          <div v-if="prikaziFormuRadnik[fabrika.id]" class="nova-cokolada-form">
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
import { ref, computed,provide,onMounted } from 'vue';
import { useRouter } from 'vue-router';
import HomeView from './HomeView.vue';

export default {
  name: 'FabrikeView',
  props: {
    fabrike: Array
  },
  setup(props) {
    const router = useRouter();
    const prikaziFormu = ref({});
    const prikaziFormuRadnik = ref({});
    const novaCokolada = ref({
      naziv: '',
      cena: 0,
      vrstaCokolade: 'obicna',
      tipCokolade: 'crna',
      gramaza: 0,
      kolicina: 0,
      opis: '',
      slika: '',
      status: 'Nedostupno',
      obrisano: false
    });
    const searchQuery = ref('');
    const searchChocolate = ref('');
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
      fab_logo:''
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
      gramaza: null
    });
    
    const isFormValid = computed(() => {
      return novaCokolada.value.naziv &&
        novaCokolada.value.cena>0 &&
        novaCokolada.value.vrstaCokolade &&
        novaCokolada.value.tipCokolade &&
        novaCokolada.value.gramaza > 0 &&
        novaCokolada.value.opis &&
        novaCokolada.value.slika &&
        !errors.value.cena &&
        !errors.value.gramaza;
    });
    const validateCena = () => {
      if (novaCokolada.value.cena <= 0) {
        errors.value.cena = 'Cena mora biti veća od 0';
      } else {
        errors.value.cena = null;
      }
    };
    const validateGramaza = () => {
      if (novaCokolada.value.gramaza <= 0) {
        errors.value.gramaza = 'Gramaza mora biti veća od 0';
      } else {
        errors.value.gramaza = null;
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

    function toggleForm(fabrikaId) {
      prikaziFormu.value = { ...prikaziFormu.value, [fabrikaId]: !prikaziFormu.value[fabrikaId] };
    }
    function toggleFormRadnik(fabrikaId) {
      prikaziFormuRadnik.value = { ...prikaziFormuRadnik.value, [fabrikaId]: !prikaziFormuRadnik.value[fabrikaId] };
    }

   
    const dodajCokoladu = (fabrikaId) => {
      validateCena();
      validateGramaza();
      if (isFormValid.value) {
        const novaCokoladaData = {
          ...novaCokolada.value,
          objekatId: fabrikaId,
          kolicina: 0,
          status: 'Nedostupno',
          obrisano: false
        };

        axios.post('http://localhost:8080/WebShopAppREST/rest/cokolade/add', novaCokoladaData)
          .then(response => {
            alert('Čokolada uspešno dodata');
            toggleForm(fabrikaId);
            novaCokolada.value = {
              naziv: '',
              cena: 0,
              vrstaCokolade: 'obicna',
              tipCokolade: 'crna',
              gramaza: 0,
              kolicina: 0,
              opis: '',
              slika: '',
              status: 'Nedostupno',
              obrisano: false
            };
            errors.value.cena = null;
            errors.value.gramaza = null;
          })
          .catch(error => console.error(error));
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
  
  axios.post('https://localhost:44333/api/fabrika', novaFabrika.value)
    .then(response => {
      const fabrikaId = response.data.id; 
      
      
      user.value.kor_fab_id = fabrikaId;
      
      
      axios.post('https://localhost:44333/api/users/register', user.value)
        .then(response => {
          error.value = null;
          alert('Korisnik i fabrika uspešno dodati');
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
      if (searchChocolate.value) {
        result = result.filter(fabrika => 
          fabrika.cokoladeUPonudi.some(cokolada => 
            cokolada.naziv.toLowerCase().includes(searchChocolate.value.toLowerCase()) && !cokolada.obrisano
          )
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
      prikaziFormu, novaCokolada, searchQuery, searchChocolate, searchLocation, 
      sortKey, sortOrderAsc,prikaziDetalje, toggleForm, dodajCokoladu, filteredAndSortedFabrike,showNewFactoryDialog,novaFabrika,dodajFabriku,user,korisnikUloga,korisnikFabrikaId,
      dodajRadnika,noviRadnik,prikaziFormuRadnik,toggleFormRadnik,filterMyOnly,today,errors    }
  }
}
</script>

<style scoped>
.fabrike {
  width: 100%;
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
  max-height: 80vh; /* Limit height to 80% of viewport height */
  overflow-y: auto; /* Enable vertical scroll if content exceeds modal height */
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
  background-color: #fff3e0; 
}

.moja-fabrika {
  border-color: #ff9800; 
  background-color: #fff3e0; 
}
.errors{
  color: red;
}

</style>
