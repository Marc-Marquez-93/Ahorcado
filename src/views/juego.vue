<script setup>
import { ref, computed, onMounted } from "vue";
import juego from "../composables/juego.js";

const palabraSecreta = ref(null);
const letras = ref([]);
const letrasReveladas = ref([]);
const contador = ref(null);

const estadosAhorcado = ["uno", "dos", "tres", "cuatro", "cinco", "seis", "siete"];
const estadoActual = ref(0);

const imgAhorcado = computed(() => {
  const nombre = estadosAhorcado[estadoActual.value];
  return new URL(`../assets/imgs/${nombre}.jpg`, import.meta.url).href;
});

const letrasOcultas = computed(() => {
  if (!palabraSecreta.value?.palabra) return [];
  const palabra = palabraSecreta.value.palabra.toUpperCase().split("");
  return palabra.map((char, i) => {
    if (char === " ") return " ";
    if (letrasReveladas.value.includes(i)) return char;
    if (letras.value.includes(char)) return char;
    return "_";
  });
});

const seleccionadas = computed(() => letras.value);

const teclas = [
  "A","B","C","D","E","F","G","H","I",
  "J","K","L","M","N","Ñ","O","P","Q",
  "R","S","T","U","V","W","X","Y","Z"
];

const handleTeclaClick = (letra) => {
  if (!letras.value.includes(letra)) {
    letras.value.push(letra);
  }
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

const fallar = () => {
  if (estadoActual.value < estadosAhorcado.length - 1) {
    estadoActual.value++;
  }
};

onMounted(async () => {
  palabraSecreta.value = await juego.useAhorcado();
  generarLetrasReveladas();
  if (palabraSecreta.value?.nivel) {
    contador.value = await juego.useContador(palabraSecreta.value.nivel);
    contador.value.iniciar();
  }
});
</script>

<template>
  <div id="container">
    <div id="dad">

      <q-btn color="primary" label="tiempos" to="/tiempos" />

      <h1 v-if="palabraSecreta">Adivina la palabra:</h1>

      <h2>{{ contador?.formato }}</h2>

      <div id="ahorcado">
        <img class="iii" :src="imgAhorcado" />
      </div>

      <div class="palabra-container" v-if="palabraSecreta">
        <div class="palabra-horizontal">
          <div
            v-for="(letra, index) in letrasOcultas"
            :key="index"
            class="letra-tecla"
            :class="{ espacio: letra === ' ' }"
          >
            <span v-if="letra !== ' '">{{ letra }}</span>
          </div>
        </div>
      </div>

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