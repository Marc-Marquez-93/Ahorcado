<script setup>
import nivelJS from "../composables/nivel.js";
import { useRouter } from "vue-router";

const router = useRouter();

const niveles = [
  { nombre: "Fácil 😊", reglas: "3 minutos ⏱️ · 6 pistas 💡" },
  { nombre: "Normal 😎", reglas: "2 minutos ⏱️ · 4 pistas 💡" },
  { nombre: "Difícil 🔥", reglas: "1 minuto ⏱️ · 2 pistas 💡" },
];

const handleNivelClick = (nivel) => {
  nivelJS.selectNivel(nivel.nombre, 1); 

  router.push("/juego");
};
</script>

<template>
  <div id="container">
    <div id="dad">
      <h1>Selecciona tu nivel</h1>
      <div class="card-grid">
        <div
          class="card"
          v-for="nivel in niveles"
          :key="nivel.nombre"
          @click="handleNivelClick(nivel)"
        >
          <div class="card-content">
            <div class="card-title">{{ nivel.nombre }}</div>
            <p style="text-align:center; font-size:14px; margin-top:6px;">
              {{ nivel.reglas }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="../styles/nivel.css"></style>
