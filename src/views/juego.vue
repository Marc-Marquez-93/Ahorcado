<script setup>
import { computed, ref, onMounted } from "vue";
import juego from "../composables/juego.js"; // importa tu js

const letras = ref([]);
const seleccionadas = ref([]);

const teclas = [
  "A","B","C","D","E","F","G","H","I",
  "J","K","L","M","N","Ñ","O","P","Q",
  "R","S","T","U","V","W","X","Y","Z"
];

const handleTeclaClick = (letra) => {
  letras.value.push(letra);
};

// probar la función al montar el componente
onMounted(async () => {
  await juego.useAhorcado(); // esto mostrará en consola las palabras del JSON
});

computed(() => {
  seleccionadas.value = letras.value;
});
</script>


<template>
  <div id="container">
    <div id="dad">
      <h1>Selecciona una letra</h1>

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
    </div>
  </div>
</template>

<style scoped src="../styles/juego.css"></style>
