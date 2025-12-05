<script setup>
import { ref, onMounted, computed } from "vue";
import juego from "../composables/juego.js";

const letras = ref([]);
const palabraSecreta = ref(null);

const teclas = [
  "A","B","C","D","E","F","G","H","I",
  "J","K","L","M","N","Ñ","O","P","Q",
  "R","S","T","U","V","W","X","Y","Z"
];

const handleTeclaClick = (letra) => {
  letras.value.push(letra);
};

onMounted(async () => {
  palabraSecreta.value = await juego.useAhorcado();
  console.log("Palabra en Vue:", palabraSecreta.value);
});

const seleccionadas = computed(() => letras.value);
</script>


<template>
  <div id="container">
    <div id="dad">
      <h1>Selecciona una letra</h1>

      <q-btn color="primary" label="tiempos" to="/tiempos" /><br>

      <div id="teclado">
        <div class="tecla-grid">
          <button
            v-for="letra in teclas"
            :key="letra"
            class="tecla"
            @click="handleTeclaClick(letra)"
          >
            {{ letra }}
          </button>
        </div>
      </div>

      <h2 v-if="palabraSecreta">Palabra generada: {{ palabraSecreta.palabra }}</h2>
      <h3>Letras seleccionadas: {{ seleccionadas }}</h3>
    </div>
  </div>
</template>

<style scoped src="../styles/juego.css"></style>
