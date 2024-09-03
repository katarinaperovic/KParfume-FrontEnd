<template>
  <div class="register">
    <h1>Registracija</h1>
    
    <form @submit.prevent="registerUser">
      <div class="form-group">
        <label for="kor_email"> Email:</label>
        <input type="text" id="kor_email" v-model="korisnik.kor_email" required>
      </div>
      <div class="form-group">
        <label for="kor_lozinka">Lozinka:</label>
        <input type="password" id="kor_lozinka" v-model="korisnik.kor_lozinka" required>
      </div>
      <div class="form-group">
        <label for="potvrdaLozinke">Potvrda lozinke:</label>
        <input type="password" id="potvrdaLozinke" v-model="potvrdaLozinke" required>
      </div>
      <div class="form-group">
        <label for="kor_ime">Ime:</label>
        <input type="text" id="kor_ime" v-model="korisnik.kor_ime" required pattern="[A-Za-z ]+" title="Molimo unesite samo slova">
      </div>
      <div class="form-group">
        <label for="kor_prezime">Prezime:</label>
        <input type="text" id="kor_prezime" v-model="korisnik.kor_prezime" required pattern="[A-Za-z ]+" title="Molimo unesite samo slova">
      </div>
      <div class="form-group">
        <label for="kor_adresa">Adresa:</label>
        <input type="text" id="kor_adresa" v-model="korisnik.kor_adresa" >
      </div>
      <div class="form-group">
        <label for="kor_grad">Grad:</label>
        <input type="text" id="kor_grad" v-model="korisnik.kor_grad" required pattern="[A-Za-z ]+" title="Molimo unesite samo slova">
      </div>
      <div class="form-group">
        <label for="kor_pos_br">Poštanski broj:</label>
        <input type="number" id="kor_pos_br" v-model="korisnik.kor_pos_br" >
      </div>
      <div class="form-group">
        <label for="kor_drzava">Država:</label>
        <input type="text" id="kor_država" v-model="korisnik.kor_drzava" required pattern="[A-Za-z ]+" title="Molimo unesite samo slova">
      </div>
      <div class="form-group">
        <label for="kor_tel">Telefon:</label>
        <input type="text" id="kor_tel" v-model="korisnik.kor_tel" >
      </div>
      
      <div class="form-group">
        <button type="submit">Registruj se</button>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      korisnik: {
        kor_email: "",
        kor_lozinka: "",
        kor_uloga:3,
        kor_ime: "",
        kor_prezime: "",
        kor_adresa:"",
        kor_grad: "",
        kor_pos_br: 0,
        kor_drzava:"",
        kor_tel:"",
        kor_fab_id:null,
        kor_ime_kompanije:""
        
      },
      potvrdaLozinke: "",
      error: null,
      today: new Date().toISOString().split('T')[0]
    };
  },
  methods: {
    registerUser() {
      if (this.korisnik.kor_lozinka !== this.potvrdaLozinke) {
        this.error = "Lozinka i potvrda lozinke se ne podudaraju";
        return;
      }

      console.log(this.korisnik);

      axios.post('https://localhost:44333/api/users/register', this.korisnik)
        .then(response => {
          alert('Uspešna registracija!');
          this.error = null;
          this.resetForm();
        })
        .catch(error => {
          if (error.response && error.response.status === 409) {
            this.error = "Email već postoji";
          } else {
            console.error(error);
          }
        });
    },
    resetForm() {
      this.korisnik = {
        kor_email: "",
        kor_lozinka: "",
        kor_uloga:3,
        kor_ime: "",
        kor_prezime: "",
        kor_adresa:"",
        kor_grad: "",
        kor_pos_br: 0,
        kor_drzava:"",
        kor_tel:"",
        kor_fab_id:null,
        kor_ime_kompanije:""
      };
      this.potvrdaLozinke = "";
    }
  }
};
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="password"],
input[type="date"],
button {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #4f2a06;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #261504;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>