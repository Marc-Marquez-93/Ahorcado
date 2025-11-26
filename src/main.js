import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./routes/routes.js"
import { Quasar, Dialog, Notify, Screen, LocalStorage, SessionStorage } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

const myApp = createApp(App)

myApp.use(Quasar, {
  plugins: {
    Dialog,
    Notify,
    Screen,
    LocalStorage,
    SessionStorage
  },
})
.use(router)
.mount('#app')