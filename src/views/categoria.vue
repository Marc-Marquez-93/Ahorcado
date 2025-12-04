<script setup>
import { useRouter } from "vue-router";
import categoriaJS from "../composables/categoria.js";

const router = useRouter();

const imagenes = [
  { nombre: "Animales", src: new URL("../assets/imgs/animales.jpg", import.meta.url).href },
  { nombre: "Canciones", src: new URL("../assets/imgs/canciones.jpg", import.meta.url).href },
  { nombre: "Deportes", src: new URL("../assets/imgs/deportes.jpg", import.meta.url).href },
  { nombre: "Física", src: new URL("../assets/imgs/fisica.jpg", import.meta.url).href },
  { nombre: "Frutas", src: new URL("../assets/imgs/frutas.jpg", import.meta.url).href },
  { nombre: "Paises", src: new URL("../assets/imgs/paises.jpg", import.meta.url).href },
];

const handleCardClick = (nombre, id) => {
  categoriaJS.selectCategoria(nombre, id);
  router.push("/nivel");
};
</script>

<template>
  <div id="container">
    <div id="dad">
      <div class="card-grid">
        <div
          class="card"
          v-for="(img, index) in imagenes"
          :key="img.nombre"
          @click="handleCardClick(img.nombre, index + 1)"
        >
          <div class="card-content">
            <img :src="img.src" :alt="img.nombre" />
            <div class="card-title">{{ img.nombre }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="../styles/categoria.css"></style>
