import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

toastr.options = {
  positionClass: "toast-bottom-left",
  // You can add other global options here
};

createApp(App).use(router).mount("#app");
