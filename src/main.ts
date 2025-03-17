import { createApp } from 'vue'

import { createPinia } from 'pinia'
import App from './app/App.vue'
import router from './app/router'

import './app/styles/main.css'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')
