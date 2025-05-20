import CONFIG from "./config.js";

// Update totals
export function updateInfo(state) {
  document.getElementById("totalWidth").textContent = state.totalWidth;
  document.getElementById("totalDepth").textContent = state.totalDepth;
  document.getElementById("totalFlavors").textContent = state.totalFlavors;
}

// Helper function to reposition all containers
function repositionAllContainers(canvasId, margin, baseHeight) {
  const canvas = document.getElementById(canvasId);
  const containers = canvas.querySelectorAll(".draggable-container");
  const totalWidth = Array.from(containers).reduce((total, container) => {
    return total + container.offsetWidth + margin;
  }, 0);

  const startX = (canvas.offsetWidth - totalWidth) / 2;
  let currentX = startX;

  containers.forEach((container) => {
    container.style.left = `${currentX}px`;
    container.style.top = `${(canvas.offsetHeight - baseHeight) / 2}px`;
    currentX += container.offsetWidth + margin;
  });
}

// Function to add image to canvas
export function addImageToCanvas(img, state) {
  const canvas = document.getElementById(CONFIG.canvas.id);
  const cfg = CONFIG.image;
  const baseHeight = cfg.height;
  const margin = cfg.margin;

  // Create container
  const container = document.createElement("div");
  container.className = "draggable-container";
  container.style.position = "absolute";

  // Posiziona inizialmente il container al centro
  container.style.left = "50%";
  container.style.top = "50%";
  container.style.transform = "translate(-50%, -50%)";

  // Create image
  const newImg = document.createElement("img");
  newImg.src = img.src;
  newImg.classList.add("draggable");
  newImg.style.height = `${baseHeight}px`;

  // Apply width based on configuration and curve status
  const rawBaseWidth = Number(cfg.width);
  if (!isNaN(rawBaseWidth)) {
    const isCurve = img.dataset.curve === "true";
    const effectiveWidth = isCurve ? rawBaseWidth * 2 : rawBaseWidth;
    newImg.style.width = `${effectiveWidth}px`;
  }

  // Copy all data attributes from source element
  Object.keys(img.dataset).forEach((key) => {
    newImg.dataset[key] = img.dataset[key];
  });

  // Add image to container and container to canvas
  container.appendChild(newImg);
  canvas.appendChild(container);

  // Once image is loaded, reposition all containers
  newImg.onload = () => {
    repositionAllContainers(CONFIG.canvas.id, margin, baseHeight);

    // Update state
    const imgW =
      Number(
        newImg.dataset.curve === "true"
          ? newImg.dataset.width * 2
          : newImg.dataset.width
      ) || 0;
    const imgD = Number(newImg.dataset.depth) || 0;
    const imgFlavors = Number(newImg.dataset.flavors) || 0;
    state.update(imgW, imgD, imgFlavors, "add");

    // Configure double click removal
    newImg.addEventListener("dblclick", () => {
      state.update(imgW, imgD, imgFlavors, "subtract");
      container.remove();
      repositionAllContainers(CONFIG.canvas.id, margin, baseHeight);
    });
  };
}

// Function to remove image from canvas
function removeImageFromCanvas(container, canvasId) {
  container.remove();
  // Reposition remaining containers
  repositionAllContainers(canvasId, CONFIG.image.margin, CONFIG.image.height);
}

// Funzione di supporto che centra il gruppo di immagini
function repositionAllImages(canvas, baseHeight, margin, state, lastImgData) {
  const allImgs = Array.from(canvas.querySelectorAll("img.draggable"));

  // Calcola le larghezze reali di ciascuna immagine
  const widths = allImgs.map((el) => el.offsetWidth);

  // Larghezza complessiva del gruppo (incl. margini)
  const totalGroupWidth =
    widths.reduce((sum, w) => sum + w, 0) + margin * (widths.length - 1);

  // Punto di partenza orizzontale per centrare il gruppo
  const canvasW = canvas.offsetWidth;
  const canvasH = canvas.offsetHeight;
  let offsetX = (canvasW - totalGroupWidth) / 2;
  const offsetY = (canvasH - baseHeight) / 2;

  // Applica le posizioni
  allImgs.forEach((el, idx) => {
    el.style.left = `${offsetX}px`;
    el.style.top = `${offsetY}px`;
    // Reset eventuale transform di draggabilità
    el.style.transform = "";
    offsetX += widths[idx] + margin;
  });

  // --- Aggiorna lo stato solo per l'ultima immagine aggiunta ---
  const imgW =
    Number(
      lastImgData.dataset.curve === "true"
        ? lastImgData.dataset.width * 2
        : lastImgData.dataset.width
    ) || 0;
  const imgD = Number(lastImgData.dataset.depth) || 0;
  const imgFlavors = Number(lastImgData.dataset.flavors) || 0;
  state.update(imgW, imgD, imgFlavors, "add");

  // Configura la rimozione con doppio clic solo sull'ultimo
  const newEl = allImgs[allImgs.length - 1];
  newEl.addEventListener("dblclick", () => {
    state.update(imgW, imgD, imgFlavors, "subtract");
    newEl.remove();
    // dopo la rimozione, riallinea il gruppo
    repositionAllImages(canvas, baseHeight, margin, state, {});
  });
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

export default class Canvas {
  constructor(container) {
    this.container = container;
    this.elements = [];
    this.state = new ConfiguratorState();
  }

  addElement(element) {
    // Clona l'elemento per evitare problemi di riferimento
    const clonedElement = element.cloneNode(true);

    // Imposta le proprietà di posizionamento
    clonedElement.style.position = "absolute";

    // Calcola la posizione centrale
    const containerWidth = this.container.offsetWidth;
    const containerHeight = this.container.offsetHeight;
    const elementWidth = parseInt(clonedElement.dataset.width) || 0;
    const elementHeight = parseInt(clonedElement.dataset.height) || 0;

    let elementLeft;
    let elementTop = (containerHeight - elementHeight) / 2;

    if (this.elements.length === 0) {
      // Prima immagine: posiziona al centro
      elementLeft = (containerWidth - elementWidth) / 2;
    } else {
      // Immagini successive: alterna tra sinistra e destra
      const lastElement = this.elements[this.elements.length - 1];
      const lastElementLeft = parseInt(lastElement.style.left);
      const lastElementWidth = parseInt(lastElement.style.width);

      if (lastElementLeft < containerWidth / 2) {
        // Se l'ultima immagine era a sinistra, posiziona a destra
        elementLeft = lastElementLeft + lastElementWidth + 20; // 20px di margine
      } else {
        // Se l'ultima immagine era a destra, posiziona a sinistra
        elementLeft = lastElementLeft - elementWidth - 20; // 20px di margine
      }
    }

    clonedElement.style.left = `${elementLeft}px`;
    clonedElement.style.top = `${elementTop}px`;

    // Aggiungi i controlli di rotazione e rimozione
    this.addControls(clonedElement);

    // Aggiungi l'elemento al canvas
    this.container.appendChild(clonedElement);
    this.elements.push(clonedElement);

    // Aggiorna lo stato
    const width = parseInt(clonedElement.dataset.width) || 0;
    const depth = parseInt(clonedElement.dataset.depth) || 0;
    const flavors = parseInt(clonedElement.dataset.flavors) || 0;

    this.state.addElement(clonedElement);

    // Se l'elemento è curvo, raddoppia la larghezza
    if (clonedElement.dataset.curve === "true") {
      clonedElement.style.width = `${width * 2}px`;
    }
  }

  addControls(element) {
    // Crea il container dei controlli
    const controlsContainer = document.createElement("div");
    controlsContainer.className = "element-controls";

    // Crea il pulsante di rotazione
    const rotateButton = document.createElement("button");
    rotateButton.className = "rotate-button";
    rotateButton.innerHTML = "↻";
    rotateButton.onclick = (e) => {
      e.stopPropagation();
      this.rotateElement(element);
    };

    // Crea il pulsante di rimozione
    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.innerHTML = "×";
    removeButton.onclick = (e) => {
      e.stopPropagation();
      this.removeElement(element);
    };

    // Aggiungi i pulsanti al container
    controlsContainer.appendChild(rotateButton);
    controlsContainer.appendChild(removeButton);

    // Aggiungi il container dei controlli all'elemento
    element.appendChild(controlsContainer);
  }

  rotateElement(element) {
    const currentRotation =
      parseInt(
        element.style.transform?.replace("rotate(", "").replace("deg)", "")
      ) || 0;
    element.style.transform = `rotate(${currentRotation + 90}deg)`;
  }

  removeElement(element) {
    // Rimuovi l'elemento dal DOM
    element.remove();

    // Rimuovi l'elemento dalla lista
    const index = this.elements.indexOf(element);
    if (index > -1) {
      this.elements.splice(index, 1);
    }

    // Aggiorna lo stato
    const width = parseInt(element.dataset.width) || 0;
    const depth = parseInt(element.dataset.depth) || 0;
    const flavors = parseInt(element.dataset.flavors) || 0;

    this.state.update(width, depth, flavors, "remove");
  }

  clear() {
    // Rimuovi tutti gli elementi dal canvas
    this.elements.forEach((element) => element.remove());
    this.elements = [];

    // Resetta lo stato
    this.state.reset();
  }
}
