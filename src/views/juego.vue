<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import juego from "../composables/juego.js";
import { useRouter } from "vue-router";
import { Dialog, Notify, LocalStorage } from "quasar";

const router = useRouter();

const palabraSecreta = ref(null);
const letras = ref([]);
const letrasReveladas = ref([]);
const contador = ref(null);
const pistaIndex = ref(0);

const niveles = [
  { nombreAD: "Fácil 😊", nombre: "Fácil", reglas: "3 minutos ⏱️ · 6 pistas 💡 · 12 intentos ❌" , intentos: 12},
  { nombreAD: "Normal 😎", nombre: "Normal", reglas: "2 minutos ⏱️ · 4 pistas 💡 · 8 intentos ❌", intentos: 8},
  { nombreAD: "Difícil 🔥", nombre: "Difícil", reglas: "1 minuto ⏱️ · 2 pistas 💡 · 5 intentos ❌", intentos: 5},
];

const estados = ["uno", "dos", "tres", "cuatro", "cinco", "seis"]; 
const estadoImg = ref(0);
const pollId = ref(null);
const victoryShown = ref(false);
const defeatShown = ref(false);

const wrongLetters = ref([]);
const wrongSet = computed(() => new Set(wrongLetters.value));

const teclas = [..."ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"];
const letrasSet = computed(() => new Set(letras.value));

const imgAhorcado = computed(() => {
  if (isVictory.value) return new URL(`../assets/imgs/siete.jpg`, import.meta.url).href;
  const nombre = estados[Math.min(estadoImg.value, estados.length - 1)];
  return new URL(`../assets/imgs/${nombre}.jpg`, import.meta.url).href;
});

const letrasOcultas = computed(() => {
  const palabra = palabraSecreta.value?.palabra?.toUpperCase() || "";
  if (!palabra) return [];

  return [...palabra].map((c, i) => {
    if (c === " ") return " ";
    if (letrasReveladas.value.includes(i)) return c;
    return letrasSet.value.has(c) ? c : "_";
  });
});

const maxIntentos = computed(() => {
  const nivel = palabraSecreta.value?.nivel || "";
  const match = niveles.find(n => nivel.includes(n.nombre));
  return match ? match.intentos : 12; 
});

const handleTeclaClick = (l) => {
  if (letrasSet.value.has(l)) return; 
  letras.value.push(l);

  const palabra = (palabraSecreta.value?.palabra || "").toUpperCase();
  if (!palabra.includes(l)) {
  if (!wrongSet.value.has(l)) {
    wrongLetters.value.push(l);

    const restantes = maxIntentos.value - wrongLetters.value.length;

    Notify.create({
      message: `Te quedan ${restantes} intentos`,
      color: "yellow-8",
      textColor: "black",
      position: "top",
      timeout: 1200
    });

    comprobarDerrota();
  }
}
};

const generarReveladas = () => {
  const palabra = palabraSecreta.value?.palabra?.toUpperCase() || "";
  const indices = [];
  for (let i = 0; i < palabra.length; i++) if (palabra[i] !== " ") indices.push(i);

  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  letrasReveladas.value = indices.slice(0, Math.floor(indices.length / 2));
};

const mostrarPista = () => {
  const pistas = palabraSecreta.value?.data?.pistas || [];
  if (pistas.length === 0) {
    Notify.create({ message: "No hay pistas disponibles 😵", color: "red", position: "top", timeout: 1500 });
    return;
  }
  if (pistaIndex.value >= pistas.length) {
    Notify.create({ message: "Ya no tienes más pistas 😵", color: "red", position: "top", timeout: 1500 });
    return;
  }
  Dialog.create({ title: "Pista", message: pistas[pistaIndex.value], ok: "Entendido" });
  pistaIndex.value++;
};

const displayFormato = computed(() => {
  if (!contador.value) return "";
  const f = contador.value.formato;
  return typeof f === "string" ? f : (f?.value ?? "");
});

const relojClass = computed(() => {
  const raw = displayFormato.value;
  if (!raw) return "reloj";
  const parts = raw.split(":").map(p => Number(p) || 0);
  const totalSeg = (parts[0] * 60) + (parts[1] || 0);
  return totalSeg <= 10 ? "relojPeligro" : "reloj";
});

const isVictory = computed(() => {
  const palabra = palabraSecreta.value?.palabra?.toUpperCase() || "";
  if (!palabra) return false;
  for (let i = 0; i < palabra.length; i++) {
    const c = palabra[i];
    if (c === " ") continue;
    if (letrasReveladas.value.includes(i)) continue;
    if (letrasSet.value.has(c)) continue;
    return false;
  }
  return true;
});

watch(isVictory, (v) => {
  if (!v || victoryShown.value) return;
  victoryShown.value = true;
  _stopTimers();
  const msg = palabraSecreta.value?.data?.victoria ?? "¡Ganaste!";
  Dialog.create({ title: "Victoria", message: msg, ok: "Genial" });
});

const comprobarDerrota = () => {
  if (victoryShown.value || defeatShown.value) return;
  if (wrongLetters.value.length >= maxIntentos.value) {
    defeatDialog("intentos");
  }
};

const defeatDialog = (reason = "") => {
  if (victoryShown.value || defeatShown.value) return;
  defeatShown.value = true;
  _stopTimers();

  const mensaje = palabraSecreta.value?.data?.derrota ?? "No lo lograste 😭";
  const d = Dialog.create({ title: "Derrota", message: mensaje, ok: "Volver a jugar" });

  if (typeof d.onOk === 'function') d.onOk(() => router.push("/"));
  if (typeof d.onDismiss === 'function') d.onDismiss(() => router.push("/"));
  if (d && typeof d.then === 'function') {
    d.then(() => router.push("/"), () => router.push("/"));
  }
};

const _stopTimers = () => {
  if (typeof contador.value?.detener === 'function') contador.value.detener();
  if (pollId.value) { clearInterval(pollId.value); pollId.value = null; }
};

const guardarTiempo = () => {
  const palabra = palabraSecreta.value?.palabra ?? "";
  const categoria = palabraSecreta.value?.categoria ?? "";
  const nivel = palabraSecreta.value?.nivel ?? "";
  const jugador = palabraSecreta.value?.jugador ?? "Anonimo";

  const raw = displayFormato.value;
  const [mm = "0", ss = "0"] = raw.split(":");
  const tiempoRestante = (Number(mm) || 0) * 60 + (Number(ss) || 0);

  const total = nivel.includes("Fácil") ? 180 : nivel.includes("Normal") ? 120 : 60;
  const tiempoUsado = total - tiempoRestante;

  let lista = [];
  try {
    lista = JSON.parse(localStorage.getItem("tiempos") || "[]");
    if (!Array.isArray(lista)) lista = [];
  } catch (e) { lista = []; }

  const entry = {
    nombre: jugador,
    palabra,
    categoria,
    nivel,
    tiempo: tiempoUsado,
    fecha: new Date().toLocaleString()
  };

  lista.push(entry);
  localStorage.setItem("tiempos", JSON.stringify(lista));
  console.log("Tiempo guardado:", lista);

  Notify.create({ message: "Tiempo guardado correctamente 🎉", color: "green", position: "top", timeout: 1200 });
  router.push("/tiempos");
};

onMounted(async () => {
  palabraSecreta.value = await juego.useAhorcado();
  pistaIndex.value = 0;
  generarReveladas();
  if (!palabraSecreta.value?.nivel) return;

  contador.value = await juego.useContador(palabraSecreta.value.nivel);

  const total = palabraSecreta.value.nivel.includes("Fácil") ? 180 : palabraSecreta.value.nivel.includes("Normal") ? 120 : 60;
  const intervalo = total / estados.length;

  const readTime = () => {
    if (!contador.value) return total;
    const tRef = contador.value.tiempo;
    if (tRef && typeof tRef === "object" && "value" in tRef) {
      const n = Number(tRef.value);
      if (Number.isFinite(n)) return n;
    }
    const fmt = displayFormato.value || "";
    const [mm = "0", ss = "0"] = fmt.split(":");
    const parsed = (Number(mm) || 0) * 60 + (Number(ss) || 0);
    return Number.isFinite(parsed) ? parsed : total;
  };

  const actualizar = () => {
    const t = readTime();
    const trans = total - t;
    estadoImg.value = Math.min(Math.floor(trans / intervalo), estados.length - 1);

    if (t <= 0 && !victoryShown.value && !defeatShown.value) {
      defeatDialog("tiempo");
    }
  };

  actualizar();
  pollId.value = setInterval(actualizar, 250);
  if (typeof contador.value?.iniciar === 'function') contador.value.iniciar();
  setTimeout(actualizar, 50);
});

onUnmounted(() => {
  if (pollId.value) { clearInterval(pollId.value); pollId.value = null; }
});
</script>

<template>
  <div id="container">
    <div id="dad">
      <div v-show="!isVictory">
        <q-btn color="primary" label="tiempos" to="/tiempos" />
        <q-btn color="purple" icon="mail" label="pistas" @click="mostrarPista" />
        <h1 v-if="palabraSecreta">Adivina la palabra:</h1>
        <h2 class="reloj" :class="relojClass" v-if="contador">{{ displayFormato }}</h2>
      </div>

      <div id="ahorcado">
        <img class="iii" :src="imgAhorcado" alt="Ahorcado" />
      </div>

      <div class="palabra-container" v-if="palabraSecreta">
        <div class="palabra-horizontal">
          <div v-for="(letra, i) in letrasOcultas" :key="i" class="letra-tecla" :class="{ espacio: letra === ' ' }">
            <span v-if="letra !== ' '">{{ letra }}</span>
          </div>
        </div>
        <div v-if="isVictory" class="victory-btn" style="margin-top:16px;">
          <q-btn color="primary" label="tiempos"  @click="guardarTiempo" />
        </div>
      </div>

      <div id="teclado" v-show="!isVictory">
        <div class="tecla-grid">
          <button v-for="letra in teclas" :key="letra" class="tecla" @click="handleTeclaClick(letra)">
            {{ letra }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>


<style scoped src="../styles/juego.css"></style>
