const nivel = {
  /**
   * Guarda el nivel seleccionado junto con la última categoría
   * en un mismo array dentro de localStorage bajo la clave "niveles"
   * @param {String} nombreNivel - nombre del nivel (ej: "Fácil 😊")
   */
  selectNivel: (nombreNivel) => {
    try {
      const rawCategorias = localStorage.getItem("categorias");
      let categorias = rawCategorias ? JSON.parse(rawCategorias) : [];

      const ultimaCategoria = categorias[categorias.length - 1];

      if (!ultimaCategoria) {
        console.warn("No hay categoría seleccionada previamente");
        return;
      }


      let idNivel = 0;
      if (nombreNivel.includes("Fácil")) idNivel = 1;
      else if (nombreNivel.includes("Normal")) idNivel = 2;
      else if (nombreNivel.includes("Difícil")) idNivel = 3;

      const registroCategoria = { categoria: ultimaCategoria.categoria, id: ultimaCategoria.id };
      const registroNivel = { nivel: nombreNivel, id: idNivel };

      const combinado = [registroCategoria, registroNivel];

      localStorage.setItem("niveles", JSON.stringify(combinado));

      console.log("Array de niveles en localStorage:", combinado);
    } catch (error) {
      console.error("Error en selectNivel:", error);
    }
  },
};

export default nivel;
