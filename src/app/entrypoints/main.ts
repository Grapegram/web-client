import { createApp } from 'vue';

import router from '../router';
import { setupStore } from '../store';
import '../styles/main.css';
import App from './App.vue';

const app = createApp(App);

app.use(router);
setupStore(app);
app.mount('#app');
