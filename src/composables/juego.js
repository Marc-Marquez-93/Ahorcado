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
      // Recuperar niveles del localStorage
      const rawNiveles = localStorage.getItem("niveles");
      if (!rawNiveles) {
        console.warn("⚠️ No hay niveles en localStorage");
        return;
      }

      const niveles = JSON.parse(rawNiveles);

      // Extraer categoría y nivel seleccionados
      const categoriaSeleccionada = niveles.find(n => n.categoria)?.categoria;
      const nivelSeleccionado = niveles.find(n => n.nivel)?.nivel;

      if (!categoriaSeleccionada || !nivelSeleccionado) {
        console.warn("⚠️ No se encontró categoría o nivel en localStorage");
        return;
      }

      // Normalizar nombres (ej: "Fácil 😊" → "facil")
      const nivelKey = nivelSeleccionado.toLowerCase().includes("fácil") ? "facil"
                      : nivelSeleccionado.toLowerCase().includes("normal") ? "normal"
                      : nivelSeleccionado.toLowerCase().includes("difícil") ? "dificil"
                      : null;

      if (!nivelKey) {
        console.warn("⚠️ Nivel no reconocido:", nivelSeleccionado);
        return;
      }

      // Buscar dentro del JSON
      const palabras = json.value?.[categoriaSeleccionada]?.[nivelKey]?.palabras;

      if (!palabras) {
        console.warn("⚠️ No se encontraron palabras para", categoriaSeleccionada, nivelKey);
        return;
      }

      // Mostrar en consola
      console.log("📚 Palabras encontradas:", palabras);

      return palabras;
    } catch (error) {
      console.error("❌ Error en useAhorcado:", error);
    }
  },

  useFrutas: async () => {
    // Aquí podrías hacer algo específico para frutas si lo necesitas
  },

  useConfig: async () => {
    // Configuración general
  },
};

export { json };
export default juego;
