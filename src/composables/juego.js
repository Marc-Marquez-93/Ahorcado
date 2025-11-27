import { ref } from "vue";

const json = ref([]);

(async () => {
  const data = await import("../data/palabras.json");
  json.value = data.default ?? data;
  console.log("JSON precargado:", json.value);
})();

const juego = {
  useAhorcado: async () => {
    
  },

  useFrutas: async () => {

  },

  useConfig: async () => {
   
  },
};

export default juego;