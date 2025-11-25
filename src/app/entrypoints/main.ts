import { createApp } from 'vue';

import router from '../router';
import { setupStore } from '../store';
import '../styles/main.css';
import App from './App.vue';

const app = createApp(App);

console.log(import.meta.env.VITE_API_URL);

app.use(router);
setupStore(app);
app.mount('#app');
