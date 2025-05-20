// Configurazione e costanti
const CONFIG = {
  image: {
    width: 'auto', // Larghezza fissa per le immagini nel canvas
    height: 60, // Altezza fissa per le immagini nel canvas
    margin: 15, // Margine tra le immagini
    initial: {
      width: 100,
      height: 60,
    },
    limits: {
      min: 100,
      max: 400,
    },
  },
  canvas: {
    id: "canvas",
  },
  snap: {
    threshold: 30,
    enabled: true,
  },
  categories: {
    "2-file": "2 file",
    "3-file": "3 file",
  },
};

export default CONFIG;
