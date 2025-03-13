import CONFIG from "./config.js";

// Update totals
export function updateInfo(state) {
  document.getElementById("totalWidth").textContent = state.totalWidth;
  document.getElementById("totalDepth").textContent = state.totalDepth;
  document.getElementById("totalFlavors").textContent = state.totalFlavors;
}

// Add image to canvas
export function addImageToCanvas(img, state) {
  const canvas = document.getElementById("canvas");
  const imageWidth = CONFIG.image.width;
  const imageHeight = CONFIG.image.height;
  const margin = CONFIG.image.margin;

  // Number images
  const currentImages = canvas.querySelectorAll("img.draggable");
  const imageCount = currentImages.length;

  // Initial position
  const newImageLeft = imageCount * (imageWidth + margin);
  const newImageTop = (canvas.offsetHeight - imageHeight) / 2;

  // Create image element
  let newImg = document.createElement("img");
  newImg.src = img.src;
  newImg.classList.add("draggable");

  // Set dimension and position
  newImg.style.width = `${imageWidth}px`;
  newImg.style.height = `${imageHeight}px`;
  newImg.style.position = "absolute";
  newImg.style.left = `${newImageLeft}px`;
  newImg.style.top = `${newImageTop}px`;

  // Copy data attributes
  newImg.dataset.width = img.dataset.width;
  newImg.dataset.depth = img.dataset.depth;
  newImg.dataset.flavors = img.dataset.flavors;

  // Convert values in numbers
  let imgWidth = Number(img.dataset.width) || 0;
  let imgDepth = Number(img.dataset.depth) || 0;
  let imgFlavors = Number(img.dataset.flavors) || 0;

  // Update the states trough the ConfiguratorState (add)
  state.update(imgWidth, imgDepth, imgFlavors, "add");

  // Aggiorna l'interfaccia se non usi state.updateUI() interno
  // updateInfo(state); // oppure, usa state.updateUI()

  // Remove with double click
  newImg.addEventListener("dblclick", function () {
    state.update(imgWidth, imgDepth, imgFlavors, "subtract");
    // Aggiorna l'interfaccia
    // updateInfo(state);
    newImg.remove();
  });

  canvas.appendChild(newImg);
}


// Reset function
export function resetConfigurator(state) {
  const canvas = document.getElementById("canvas");
  while (canvas.firstChild) {
    canvas.firstChild.remove();
  }
  state.totalWidth = 0;
  state.totalDepth = 0;
  state.totalFlavors = 0;
  state.updateUI();
}

