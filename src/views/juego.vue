<script setup>
import { ref, onMounted, computed } from "vue";
import juego from "../composables/juego.js";

const letras = ref([]);

const palabraSecreta = ref(null);

const letrasReveladas = ref([]);

const teclas = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I",
  "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q",
  "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
];

const handleTeclaClick = (letra) => {
  letras.value.push(letra);
};

const generarLetrasReveladas = () => {
  const palabra = palabraSecreta.value.palabra.toUpperCase();
  const indices = [];

  for (let i = 0; i < palabra.length; i++) {
    if (palabra[i] !== " ") indices.push(i);
  }

  const maxReveal = Math.floor(indices.length / 2);

  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  letrasReveladas.value = indices.slice(0, maxReveal);
};

onMounted(async () => {
  palabraSecreta.value = await juego.useAhorcado();
  console.log("Palabra en Vue:", palabraSecreta.value);

  if (palabraSecreta.value?.palabra) {
    generarLetrasReveladas();
  }
});

const letrasOcultas = computed(() => {
  if (!palabraSecreta.value?.palabra) return [];

  const palabra = palabraSecreta.value.palabra.toUpperCase().split("");

  return palabra.map((char, index) => {
    if (char === " ") return " ";
    return letrasReveladas.value.includes(index) ? char : "_";
  });
});

const seleccionadas = computed(() => letras.value);
</script>



<template>
  <div id="container">
    <div id="dad">
      <h1>Selecciona una letra</h1>
      <div id="teclado">
        <div class="tecla-grid">
          <button v-for="letra in teclas" :key="letra" class="tecla" @click="handleTeclaClick(letra)">
            {{ letra }}
          </button>
        </div>
      </div>

      <q-btn color="primary" label="tiempos" to="/tiempos" /><br>

      <h1 v-if="palabraSecreta">Adivina la palabra:</h1>

      <div class="palabra-container" v-if="palabraSecreta">
        <div class="palabra-horizontal">
          <div v-for="(letra, index) in letrasOcultas" :key="index" class="letra-tecla"
            :class="{ espacio: letra === ' ' }">
            <span v-if="letra !== ' '">{{ letra }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped src="../styles/juego.css"></style>
