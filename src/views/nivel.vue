<script setup>
import nivelJS from "../composables/nivel.js";
import { useRouter } from "vue-router";
import { ref } from 'vue'
import { Notify } from 'quasar';

const router = useRouter();

const ph = ref('');
const dense = ref(false);
const nombreGuardado = ref(false); 

const niveles = [
  { nombreAD: "Fácil 😊", nombre: "Fácil", reglas: "3 minutos ⏱️ · 6 pistas 💡 · 12 intentos ❌" },
  { nombreAD: "Normal 😎", nombre: "Normal", reglas: "2 minutos ⏱️ · 4 pistas 💡 · 8 intentos ❌" },
  { nombreAD: "Difícil 🔥", nombre: "Difícil", reglas: "1 minuto ⏱️ · 2 pistas 💡 · 5 intentos ❌" },
];

const guardarNombre = () => {
  const nombre = ph.value.trim();

  if (!nombre) {
    Notify.create({
      type: 'warning',
      message: 'Escribe tu nombre por favor 🙏'
    });
    return;
  }

  nombreGuardado.value = true;

  Notify.create({
    type: 'positive',
    message: `Nombre guardado: ${nombre}`
  });
};

const handleNivelClick = (nivel) => {
  if (!ph.value.trim()) {
    Notify.create({
      type: 'warning',
      message: 'Escribe tu nombre por favor 🙏'
    });
    return;
  }

  nivelJS.selectNivel(nivel.nombre, ph.value.trim());

  router.push("/juego");
};
</script>

<template>
  <div id="container">
    <div id="dad">

      <h1>Selecciona tu nivel</h1>

      <div class="card-grid">
        <div class="card" 
             v-for="nivel in niveles" 
             :key="nivel.nombre" 
             @click="handleNivelClick(nivel)">
          <div class="card-content">
            <div class="card-title">{{ nivel.nombreAD }}</div>
            <p style="text-align:center; font-size:14px; margin-top:6px;">
              {{ nivel.reglas }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="!nombreGuardado">
        <h1>Escribe tu nombre</h1>

        <div class="nombre">
          <q-input 
            v-model="ph" 
            label="Nombre" 
            placeholder="Escribe tu nombre" 
            hint="¿Cómo te llamás?" 
            :dense="dense" 
            @keyup.enter="guardarNombre"
          />
          <q-btn 
            color="primary" 
            label="Guardar" 
            class="centro"
            @click="guardarNombre"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped src="../styles/nivel.css"></style>
