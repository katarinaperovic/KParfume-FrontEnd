<template>
  <div class="register">
    <h1>Registracija</h1>

    <form @submit.prevent="registerUser">
      <div class="form-group">
        <label for="kor_email">Email:</label>
        <input type="email" id="kor_email" v-model="korisnik.kor_email" required>
      </div>
      <div class="form-group-row">
      <div class="form-group">
        <label for="kor_lozinka">Lozinka:</label>
        <input type="password" id="kor_lozinka" v-model="korisnik.kor_lozinka" required>
      </div>
      <div class="form-group">
        <label for="potvrdaLozinke">Potvrda lozinke:</label>
        <input type="password" id="potvrdaLozinke" v-model="potvrdaLozinke" required>
      </div></div>
      <div class="form-group-row">
      <div class="form-group">
        <label for="kor_ime">Ime:</label>
        <input type="text" id="kor_ime" v-model="korisnik.kor_ime" required pattern="[A-Za-z ]+" title="Molimo unesite samo slova">
      </div>
      <div class="form-group">
        <label for="kor_prezime">Prezime:</label>
        <input type="text" id="kor_prezime" v-model="korisnik.kor_prezime" required >
      </div></div>

      <div >
        <div class="form-group">
          <label for="kor_ime_kompanije">Ime kompanije:</label>
          <input type="text" id="kor_ime_kompanije" v-model="korisnik.kor_ime_kompanije">
        </div>
        <div class="form-group-row">
        <div class="form-group">
          <label for="kor_adresa">Adresa kompanije:</label>
          <input type="text" id="kor_adresa" v-model="korisnik.kor_adresa">
        </div>
        <div class="form-group">
          <label for="kor_grad">Grad:</label>
          <input type="text" id="kor_grad" v-model="korisnik.kor_grad" required pattern="[A-Za-z ]+" title="Molimo unesite samo slova">
        </div></div>
        <div class="form-group-row">
        <div class="form-group">
          <label for="kor_pos_br">Poštanski broj:</label>
          <input type="number" id="kor_pos_br" v-model="korisnik.kor_pos_br">
        </div>
        <div class="form-group">
          <label for="kor_drzava">Država:</label>
          <input type="text" id="kor_drzava" v-model="korisnik.kor_drzava" required pattern="[A-Za-z ]+" title="Molimo unesite samo slova">
        </div></div>
        <div class="form-group">
          <label for="kor_tel">Telefon:</label>
          <input type="text" id="kor_tel" v-model="korisnik.kor_tel">
        </div>
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
import router from '../router';

export default {
  data() {
    return {
      korisnik: {
        kor_email: "",
        kor_lozinka: "",
        kor_uloga: 3,
        kor_ime: "",
        kor_prezime: "",
        kor_adresa: "",
        kor_grad: "",
        kor_pos_br: 0,
        kor_drzava: "",
        kor_tel: "",
        kor_fab_id: null,
        kor_ime_kompanije: ""
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
          router.push('/login');
          this.error = null;
          this.resetForm();
        })
        .catch(error => {
          if (error.response && error.response.status === 400) {
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
        kor_uloga: 3,
        kor_ime: "",
        kor_prezime: "",
        kor_adresa: "",
        kor_grad: "",
        kor_pos_br: 0,
        kor_drzava: "",
        kor_tel: "",
        kor_fab_id: null,
        kor_ime_kompanije: ""
      };
      this.potvrdaLozinke = "";
    }
  }
};
</script>

<style scoped>
.register {
  max-width: 600px;
  margin: 40px auto;
  padding: 40px;
  border-radius: 15px;
  background: linear-gradient(145deg, #662c2f, #ffffff);
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.1), -10px -10px 20px rgba(255, 255, 255, 0.8);
  transition: box-shadow 0.3s ease;
  
}

h1 {
  text-align: center;
  color: #fffefd;
  margin-bottom: 10px;
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}



label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #060606;
  font-size: 14px;
}

input[type="text"],
input[type="password"],
input[type="email"],
input[type="number"] {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: none;
  background-color: #f2f2f2;
  font-size: 16px;
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  background-color: #e9e9e9;
  box-shadow: inset 3px 3px 8px rgba(0, 0, 0, 0.1);
}

button {
  width: 100%;
  padding: 15px;
  font-size: 16px;
  background: linear-gradient(145deg, #4f0606, #4e0b6a);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.2);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

button:hover {
  background: linear-gradient(145deg, #4e0b6a, #4f0606);
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.3), -4px -4px 15px rgba(255, 255, 255, 0.3);
}

.error {
  color: red;
  font-size: 20px;
  margin-top: 10px;
  text-align: center;
}



@media (max-width: 768px) {
  .register {
    padding: 30px;
  }

  h1 {
    font-size: 24px;
  }
 
}
.form-group-row {
  display: flex;
  justify-content: space-between;
  gap: 40px; 
}
.form-group-row .form-group {
  flex: 1;
  
}

.form-group-row .form-group:last-child {
  margin-right: 0;
}

.form-group{
  margin-bottom: 10px;
}

  button {
    font-size: 14px;
    padding: 12px;
  }
</style>
