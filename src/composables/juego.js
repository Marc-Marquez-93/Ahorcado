import { ref, computed } from "vue";

const json = ref([]);

(async () => {
  try {
    const data = await import("../data/palabras.json");
    json.value = data.default ?? data;
  } catch (error) {
    console.error("Error cargando JSON:", error);
  }
})();

const juego = {
  useAhorcado: async () => {
    try {
      const rawNiveles = localStorage.getItem("niveles");
      if (!rawNiveles) return;

      const niveles = JSON.parse(rawNiveles);

      const categoria = niveles.find(n => n.categoria)?.categoria?.toLowerCase();
      const nivel = niveles.find(n => n.nivel)?.nivel;
      if (!categoria || !nivel) return;

      const nivelKey =
        nivel.includes("Fácil") ? "facil" :
        nivel.includes("Normal") ? "normal" :
        nivel.includes("Difícil") ? "dificil" :
        null;

      if (!nivelKey) return;

      const palabras = json.value?.[categoria]?.[nivelKey]?.palabras;
      if (!palabras) return;

      const keys = Object.keys(palabras);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      const palabra = palabras[randomKey];

      return {
        palabra: randomKey,
        data: palabra,
        nivel,
        categoria
      };
    } catch (error) {
      console.error("Error en useAhorcado:", error);
    }
  },

  useContador: async (nivel) => {
    const tiempo = ref(0);
    let interval = null;

    await Promise.resolve();

    tiempo.value =
      nivel.includes("Fácil") ? 180 :
      nivel.includes("Normal") ? 120 :
      nivel.includes("Difícil") ? 60 :
      60;

    const iniciar = () => {
      if (interval) return;
      interval = setInterval(() => {
        if (tiempo.value > 0) tiempo.value--;
        else {
          clearInterval(interval);
          interval = null;
        }
      }, 1000);
    };

    const detener = () => {
      clearInterval(interval);
      interval = null;
    };

    const formato = computed(() => {
      const m = String(Math.floor(tiempo.value / 60)).padStart(2, "0");
      const s = String(tiempo.value % 60).padStart(2, "0");
      return `${m}:${s}`;
    });

    return { tiempo, formato, iniciar, detener };
  },

  useConfig: async () => { }
};

export { json };
export default juego;
