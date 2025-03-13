import CONFIG from "./modules/config.js";
import DraggableImage from "./modules/draggable.js";
import ConfiguratorState from "./modules/state.js";
import { updateInfo, addImageToCanvas, resetConfigurator } from "./modules/canvas.js";

// Init function
function init() {
  console.log("Initializing configurator...");

  // Creo una nuova configurazione di stato (totalWidth, totalDepth, etc)
  const state = new ConfiguratorState();
  const gallery = document.getElementById("gallery");

  // Prendo tutte le immagini nella galleria
  const images = gallery.querySelectorAll("img");
  console.log(`Found ${images.length} images in gallery`);

  // Per ogni immagine, creo un elemento draggable
  images.forEach((img) => {
    img.addEventListener("click", () => {
      
      // DraggableImage è responsabile della creazione e raccolta di tutti gli attributi 
      const draggableImg = new DraggableImage(img, state);

      if (draggableImg.element) {
        const canvas = document.getElementById(CONFIG.canvas.id);
        if (canvas) {
          canvas.appendChild(draggableImg.element);
          state.update(
            Number(img.dataset.width),
            Number(img.dataset.depth),
            Number(img.dataset.flavors)
          );

        } else {
          console.error("Canvas element not found when trying to append image");
        }
      }
    });

    // Todo: Setup hover animation
    
  });
}

// Uploading DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Remove all images with 'Esc'
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    const canvas = document.getElementById("canvas");
    while (canvas.firstChild) {
      canvas.firstChild.remove();
    }
    currentCategory = null;
    totalWidth = 0;
    baseDepth = 0;
    flavorsList = [];
    updateInfo();
  }
});
