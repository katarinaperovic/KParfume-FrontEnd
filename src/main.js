import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import toastr from "toastr";
import "toastr/build/toastr.min.css";




const fontAwesomeLink = document.createElement('link');
fontAwesomeLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css";
fontAwesomeLink.rel = "stylesheet";
document.head.appendChild(fontAwesomeLink);



toastr.options = {
  positionClass: "toast-bottom-left",
  // You can add other global options here
};

createApp(App).use(router).mount("#app");
