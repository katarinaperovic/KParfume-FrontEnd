import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import LoginView from "../views/LoginView.vue";
import FabrikeView from "../views/FabrikeView.vue";
import UsersView from "../views/UsersView.vue";
import VestiView from "../views/VestiView.vue";
import OceneView from "../views/OceneView.vue";
import KuponiView from "../views/KuponiView.vue";
import NewsDetailView from "../views/NewsDetailView.vue";
import ProfileView from "../views/ProfileView.vue";
import ParfemiView from "../views/ParfemiView.vue";
import FabrikaDetaljiView from "../views/FabrikaDetaljiView.vue";
import FabrikaDetaljiParfemi from "../views/FabrikaDetaljiParfemi.vue";
import KomentariView from "@/views/KomentariView.vue";
import KomentariZahteviView from "@/views/KomentariZahteviView.vue";
import KorpaView from "@/views/KorpaView.vue";
import KupovineView from "@/views/KupovineView.vue";
import PaymentView from "@/views/PaymentView.vue";
import IzvestajView from "@/views/IzvestajView.vue";
import FavoritiView from "@/views/FavoritiView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfileView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/vest/:id",
    name: "NewsDetail",
    component: NewsDetailView,
    props: true,
  },
  {
    path: "/registration",
    name: "registration",
    component: AboutView,
  },
  {
    path: "/fabrike",
    name: "fabrike",
    component: FabrikeView,
    props: (route) => ({
      fabrike: route.meta.fabrike,
    }),
  },
  {
    path: "/parfemi",
    name: "parfemi",
    component: ParfemiView,
    props: (route) => ({
      parfemi: route.meta.parfemi,
    }),
  },
  {
    path: "/users",
    name: "users",
    component: UsersView,
  },
  {
    path: "/vesti",
    name: "vesti",
    component: VestiView,
  },
  {
    path: "/ocene",
    name: "ocene",
    component: OceneView,
  },
  {
    path: "/kuponi",
    name: "kuponi",
    component: KuponiView,
  },
  {
    path: "/fabrike/:id",
    name: "DetaljiFabrike",
    component: FabrikaDetaljiView,
  },
  {
    path: "/fabrike/parfemi/:id",
    name: "DetaljiFabrikeParfemi",
    component: FabrikaDetaljiParfemi,
  },
  {
    path: "/komentari",
    name: "komentari",
    component: KomentariView,
    props: (route) => ({
      komentari: route.meta.komentari,
    }),
  },
  {
    path: "/komentariZahtevi",
    name: "komentariZahtevi",
    component: KomentariZahteviView,
  },
  {
    path: "/korpa",
    name: "korpa",
    component: KorpaView,
  },
  {
    path: "/placanje",
    name: "placanje",
    component: PaymentView,
  },
  {
    path: "/kupovine",
    name: "kupovine",
    component: KupovineView,
  },
  {
    path: "/izvestaj",
    name: "izvestaj",
    component: IzvestajView,
  },
  {
    path: "/favoriti",
    name: "favoriti",
    component: FavoritiView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
