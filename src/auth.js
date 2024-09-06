import { reactive } from 'vue';

const state = reactive({
  isLoggedIn: false,
  korisnikUloga: '',
});

export function useAuth() {
  return {
    state,
    login(korisnik) {
      state.isLoggedIn = true;
      state.korisnikUloga = korisnik.kor_uloga;
      localStorage.setItem('korisnik', JSON.stringify(korisnik));
    },
    logout() {
      state.isLoggedIn = false;
      state.korisnikUloga = '';
      localStorage.removeItem('korisnik');
    },
    checkLoginStatus() {
      const korisnik = JSON.parse(localStorage.getItem('korisnik'));
      if (korisnik) {
        state.isLoggedIn = true;
        state.korisnikUloga = korisnik.kor_uloga;
        state.korisnik=korisnik;
      } else {
        state.isLoggedIn = false;
        state.korisnikUloga = '';
        state.korisnik='';
      }
    },
  };
}