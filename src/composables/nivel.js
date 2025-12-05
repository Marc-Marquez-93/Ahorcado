const nivel = {
  selectNivel: (nombreNivel, jugador) => {
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

      const registroCategoria = {
        categoria: ultimaCategoria.categoria,
        id: ultimaCategoria.id
      };

      const registroNivel = {
        nivel: nombreNivel,
        id: idNivel
      };

      const registroJugador = {
        jugador: jugador
      };

      const combinado = [
        registroCategoria,
        registroNivel,
        registroJugador
      ];

      localStorage.setItem("niveles", JSON.stringify(combinado));

    } catch (error) {
      console.error("Error en selectNivel:", error);
    }
  }
};

export default nivel;
