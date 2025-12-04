const categoria = {
  /**
   * Método para manejar selección de categoría
   * @param {String} nombre - nombre de la categoría (ej: "Animales")
   * @param {Number} id - id incremental de la selección
   */
  selectCategoria: (nombre, id) => {
    try {
      let data;
      try {
        const raw = localStorage.getItem("categorias");
        data = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(data)) data = [];
      } catch (e) {
        console.warn("Error parseando localStorage, se reinicia:", e);
        data = [];
      }

      const registro = { categoria: nombre, id };
      data.push(registro);
      localStorage.setItem("categorias", JSON.stringify(data));

      console.log("Array de categorias en localStorage:", data);
    } catch (error) {
      console.error("Error en selectCategoria:", error);
    }
  },
};

export default categoria;
