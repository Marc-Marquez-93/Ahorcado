import inicio from "../views/inicio.vue"
import categoria from "../views/categoria.vue"
import nivel from "../views/nivel.vue"
import juego from "../views/juego.vue"
import tiempos from "../views/tiempos.vue"
import { createRouter, createWebHashHistory } from "vue-router"

const rutas = [
    { path: "/", component: inicio },
    { path: "/categoria", component: categoria },
    { path: "/nivel", component: nivel },
    { path: "/juego", component: juego },
    { path: "/tiempos", component: tiempos }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: rutas
})

export default router

//         <q-btn color="primary" label="inicio" to="/" /><br>
//         <q-btn color="primary" label="categoria" to="/categoria" /><br>
//         <q-btn color="primary" label="nivel" to="/nivel" /><br>
//         <q-btn color="primary" label="juego" to="/juego" /><br>
//         <q-btn color="primary" label="tiempos" to="/tiempos" /><br></br>