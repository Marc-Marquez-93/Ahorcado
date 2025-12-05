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
      console.log("🔍 Niveles en localStorage:", rawNiveles);
      if (!rawNiveles) {
        console.warn("⚠️ No hay niveles en localStorage");
        return;
      }

      const niveles = JSON.parse(rawNiveles);
      console.log("📂 Niveles parseados:", niveles);

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

      console.log("📚 Palabras encontradas:", palabras);

      return palabras;
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
