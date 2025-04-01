import CONFIG from "./config.js";

// Classe per gestire le immagini draggabili
export default class DraggableImage {
  constructor(sourceImg, state) {
    this.state = state;
    this.element = this.createImageElement(sourceImg);
    this.setupInteractions();
    this.setupAnimation();
    this.currentRotation = 0;
    console.log("DraggableImage created", this.element);
  }

  createImageElement(sourceImg) {
    const container = document.createElement("div");
    container.className = "draggable-container";

    const img = document.createElement("img");
    const canvas = document.getElementById(CONFIG.canvas.id);

    if (!canvas) {
      console.error("Canvas element not found");
      return null;
    }

    const imageCount = canvas.querySelectorAll(".draggable-container").length;

    // Setup iniziale dell'immagine
    img.src = sourceImg.src;
    img.className = "draggable";

    // Copia tutti i data attributes
    Object.keys(sourceImg.dataset).forEach((key) => {
      container.dataset[key] = sourceImg.dataset[key];
    });

    // Impostiamo stili iniziali direttamente
    container.style.width = `${CONFIG.image.initial.width}px`;
    container.style.height = `${CONFIG.image.initial.height}px`;
    container.style.left = `${
      imageCount * (CONFIG.image.initial.width + CONFIG.image.initial.margin)
    }px`;
    container.style.top = `${
      (canvas.offsetHeight - CONFIG.image.initial.height) / 2
    }px`;

    // Creiamo il pulsante di rotazione
    const rotateButton = document.createElement("button");
    rotateButton.className = "rotate-button";
    rotateButton.innerHTML = "↻";
    rotateButton.title = "Ruota immagine";
    rotateButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.rotate();
    });

    // Aggiungiamo gli elementi al container
    container.appendChild(img);
    container.appendChild(rotateButton);

    return container;
  }

  setupInteractions() {
    if (!this.element) return;

    interact(this.element)
      .draggable({
        inertia: false,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: "parent",
            endOnly: true,
            x: true,
            y: true,
          }),
        ],
        listeners: {
          move: this.handleDrag.bind(this),
        },
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        preserveAspectRatio: true,
        modifiers: [
          interact.modifiers.restrictSize({
            min: {
              width: CONFIG.image.limits.min,
              height: CONFIG.image.limits.min,
            },
            max: {
              width: CONFIG.image.limits.max,
              height: CONFIG.image.limits.max,
            },
          }),
        ],
        listeners: {
          move: this.handleResize.bind(this),
        },
      });

    this.element.addEventListener("dblclick", () => this.remove());
  }

  setupAnimation() {
    if (!this.element) return;

    gsap.from(this.element, {
      scale: 0.5,
      opacity: 0,
      duration: 0.3,
      ease: "back.out(1.7)",
    });
  }

  handleDrag(event) {
    if (!this.element) return;

    const position = {
      x: parseFloat(this.element.style.left) || 0,
      y: parseFloat(this.element.style.top) || 0,
    };

    let newX = position.x + event.dx;
    let newY = position.y + event.dy;

    this.element.style.left = `${newX}px`;
    this.element.style.top = `${newY}px`;
  }

  handleResize(event) {
    if (!this.element) return;

    const { height } = event.rect;
    const canvas = document.getElementById(CONFIG.canvas.id);
    const canvasRect = canvas.getBoundingClientRect();

    // Mantiene il rapporto d'aspetto originale
    const img = this.element.querySelector("img");
    const originalWidth = img.naturalWidth || img.offsetWidth;
    const originalHeight = img.naturalHeight || img.offsetHeight;
    const aspectRatio = originalWidth / originalHeight;

    // Calcola la nuova larghezza in base alla nuova altezza
    let newHeight = height;
    let newWidth = newHeight * aspectRatio;

    // Evita che l'immagine superi le dimensioni del canvas
    newWidth = Math.min(newWidth, canvasRect.width);
    newHeight = Math.min(newHeight, canvasRect.height);

    this.element.style.height = `${newHeight}px`;
    this.element.style.width = `${newWidth}px`;

    // Controllo per non far uscire l'immagine dal canvas
    let currentLeft = parseFloat(this.element.style.left) || 0;
    let currentTop = parseFloat(this.element.style.top) || 0;

    if (currentLeft + newWidth > canvasRect.width) {
      this.element.style.left = `${canvasRect.width - newWidth}px`;
    }
    if (currentTop + newHeight > canvasRect.height) {
      this.element.style.top = `${canvasRect.height - newHeight}px`;
    }
  }

  rotate() {
    this.currentRotation = (this.currentRotation + 90) % 360;
    const img = this.element.querySelector("img");
    img.style.transform = `rotate(${this.currentRotation}deg)`;
  }

  remove() {
    if (!this.element) return;

    const { width, flavors } = this.element.dataset;
    this.state.update(Number(width), 0, Number(flavors), "subtract");

    gsap.to(this.element, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: "back.in(1.7)",
      onComplete: () => this.element.remove(),
    });
  }
}
