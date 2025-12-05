import { ref } from "vue";

const json = ref([]);

(async () => {
  try {
    const data = await import("../data/palabras.json");
    json.value = data.default ?? data;
    console.log("✅ JSON precargado:", json.value);
  } catch (error) {
    console.error("❌ Error cargando el JSON:", error);
  }
})();

const juego = {
  useAhorcado: async () => {
    try {
      const rawNiveles = localStorage.getItem("niveles");
      if (!rawNiveles) {
        console.warn("⚠️ No hay niveles en localStorage");
        return;
      }

      const niveles = JSON.parse(rawNiveles);

      const categoriaSeleccionada = niveles.find(n => n.categoria)?.categoria.toLowerCase();
      const nivelSeleccionado = niveles.find(n => n.nivel)?.nivel;
      if (!categoriaSeleccionada || !nivelSeleccionado) {
        console.warn("⚠️ No se encontró categoría o nivel en localStorage");
        return;
      }

      const nivelKey = nivelSeleccionado.includes("Fácil") ? "facil"
        : nivelSeleccionado.includes("Normal") ? "normal"
          : nivelSeleccionado.includes("Difícil") ? "dificil"
            : null;

      if (!nivelKey) {
        console.warn("⚠️ Nivel no reconocido:", nivelSeleccionado);
        return;
      }

      const palabras = json.value?.[categoriaSeleccionada]?.[nivelKey]?.palabras;

      if (!palabras) {
        console.warn("⚠️ No se encontraron palabras para", categoriaSeleccionada, nivelKey);
        return;
      }

      const keys = Object.keys(palabras);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];

      const palabraFinal = palabras[randomKey];
      const arrayPalabra = {
        palabra: randomKey,
        data: palabraFinal
      };

      return arrayPalabra;

    } catch (error) {
      console.error("❌ Error en useAhorcado:", error);
    }
  },

  useFrutas: async () => {

  },

  useConfig: async () => {
  },
};

export { json };
export default juego;
