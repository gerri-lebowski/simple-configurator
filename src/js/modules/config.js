// Configurazione e costanti
const CONFIG = {
  image: {
    width: 120,
    height: 120,
    margin: 15,
    initial: {
      width: "auto",
      height: 200,
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