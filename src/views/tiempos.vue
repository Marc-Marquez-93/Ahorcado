<script setup>
import { ref, onMounted } from "vue";

const tiempos = ref([]);

const cargarTiempos = () => {
  const data = JSON.parse(localStorage.getItem("tiempos")) || [];
  tiempos.value = data;
};

onMounted(() => {
  cargarTiempos();
});

const reiniciarTodo = () => {
  localStorage.removeItem("tiempos");
  localStorage.removeItem("niveles");
  localStorage.removeItem("categorias");

  cargarTiempos(); 
};

const model = ref(null);
const options = [ "Fácil", "Medio", "Difícil"];

</script>



<template>
    <div id="container">
        <div id="dad">
  <h1>Lista de tiempos</h1>
<div class="botones">
    <q-btn color="purple" label="Inicio" to="/" />
    <q-select outlined v-model="model" :options="options" label="nivel" color="white" label-color="white" bg-color="purple"/>
<q-btn color="purple" label="reiniciar" @click="reiniciarTodo" />
  

</div>

  <table>
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Palabra</th>
        <th>Categoría</th>
        <th>Nivel</th>
        <th>Tiempo</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(t, index) in tiempos" :key="index">
        <td>{{ t.nombre }}</td>
        <td>{{ t.palabra }}</td>
        <td>{{ t.categoria }}</td>
        <td>{{ t.nivel }}</td>
        <td>{{ t.tiempo }}s</td>
      </tr>
    </tbody>
  </table>
</div>

    </div>
</template>

<style scoped src="../styles/tiempos.css"></style>