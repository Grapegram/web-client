import './app/styles/main.css'

import { createApp } from 'vue'

import { createPinia } from 'pinia'
import App from './app/App.vue'
import router from './app/router'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')
