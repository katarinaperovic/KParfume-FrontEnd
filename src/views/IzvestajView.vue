<template>
  <div class="izvestaj-view">
    <h1>Izvestaj View</h1>
    <table class="modern-table">
      <thead>
        <tr>
          <th>Izvestaj</th>
          <th>Datum</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="izvestaj in izvestaji" :key="izvestaj.id">
          <td>Izvestaj {{ izvestaj.id }}</td>
          <td>{{ new Date(izvestaj.izv_datum).toLocaleDateString() }}</td>
          <td>
            <a
              class="open-btn"
              :href="'https://localhost:44333/resources' + izvestaj.izv_putanja"
              target="_blank"
            >
              Open
            </a>
          </td>
        </tr>
        <tr v-if="izvestaji.length === 0">
          <td colspan="3">No Izvestaji found.</td>
        </tr>
      </tbody>
    </table>

    <!-- Button to generate a new Izvestaj -->
    <button @click="generateNewIzvestaj" class="generate-btn">
      Generisi Novi Izvestaj
    </button>
  </div>
</template>

<script>
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export default {
  name: "IzvestajView",
  data() {
    return {
      izvestaji: [],
    };
  },
  methods: {
    async fetchIzvestaji() {
      try {
        const korisnik = localStorage.getItem("korisnik");
        if (!korisnik) {
          toastr.error("User is not logged in");
          return;
        }
        const korisnikId = JSON.parse(korisnik).id;
        const response = await axios.get(
          `https://localhost:44333/api/izvestaj/manager/${korisnikId}`
        );
        this.izvestaji = response.data; // Assuming API returns a list of Izvestaji
      } catch (error) {
        console.error("Error fetching Izvestaji:", error);
      }
    },
    openIzvestaj(id) {
      alert(`Opening Izvestaj with ID: ${id}`);
      // Normally you'd open the report or navigate to the file
    },
    async generateNewIzvestaj() {
      const korisnik = localStorage.getItem("korisnik");
      if (!korisnik) {
        toastr.error("User is not logged in");
        return;
      }
      const korisnikId = JSON.parse(korisnik).id;
      const fabrikaId = JSON.parse(korisnik).kor_fab_id;
      const izvestajData = {
        izv_datum: new Date().toISOString().split("T")[0],
        izv_kor_id: korisnikId,
        izv_putanja: "/path/to/new/izvestaj.pdf",
      };
      const response = await axios
        .post(`https://localhost:44333/api/izvestaj/${fabrikaId}`, izvestajData)
        .then((response) => {
          toastr.success("Izvestaj uspesno generisan!");
          this.fetchIzvestaji();
        });
    },
  },
  mounted() {
    this.fetchIzvestaji();
  },
};
</script>

<style scoped>
.izvestaj-view {
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modern-table {
  width: 50%;
  border-collapse: collapse;
  margin-bottom: 20px;
  font-family: Arial, sans-serif;
}

.modern-table th,
.modern-table td {
  border: 1px solid #ddd;
  padding: 12px 15px;
  text-align: center; /* Center the text in table cells */
}

.modern-table th {
  background-color: #75094c;
  color: white;
  text-transform: uppercase;
  font-weight: bold;
}

.modern-table tr {
  background-color: #f9f9f9;
}

.modern-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.modern-table tr:hover {
  background-color: #e9e9e9;
}

.open-btn {
  background-color: #520332;
  border: none;
  color: white;
  padding: 10px 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.open-btn:hover {
  background-color: #2c011b;
}

.generate-btn {
  padding: 12px 20px;
  background-color: #520332;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.generate-btn:hover {
  background-color: #2c011b;
}
</style>
