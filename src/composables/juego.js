import { ref } from "vue";

const json = ref([]);

(async () => {

    try {
        const data = await import("../data/palabras.json");
        json.value = data.default ?? data;
        console.log("JSON precargado:", json.value);
    }
    catch (error) {
        console.log("se presento un error cargango el JSON")
    }

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