import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import WebApp from '@twa-dev/sdk'
import router from './router'


createApp(App).use(router).mount('#app')
WebApp.ready()
