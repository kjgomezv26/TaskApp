import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { provideStore } from "./store/vueRedux";
import "./style.css";

const app = createApp(App);
provideStore(app, store);
app.use(router).mount("#app");
