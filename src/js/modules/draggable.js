import CONFIG from "./config.js";

// Classe per gestire le immagini draggabili
export default class DraggableImage {
  
  constructor(sourceImg, state) {
    this.state = state;
    this.element = this.createImageElement(sourceImg);
    this.setupInteractions();
    this.setupAnimation();
    console.log("DraggableImage created", this.element);
  }

  createImageElement(sourceImg) {
    const img = document.createElement("img");
    const canvas = document.getElementById(CONFIG.canvas.id);

    if (!canvas) {
      console.error("Canvas element not found");
      return null;
    }

    const imageCount = canvas.querySelectorAll("img.draggable").length;

    // Setup iniziale dell'immagine
    img.src = sourceImg.src;
    img.className = "draggable";
    
    // Copia tutti i data attributes
    Object.keys(sourceImg.dataset).forEach((key) => {
      img.dataset[key] = sourceImg.dataset[key];
    });

    // Impostiamo stili iniziali direttamente
    img.style.position = "absolute";
    img.style.width = `${CONFIG.image.initial.width}px`;
    img.style.height = `${CONFIG.image.initial.height}px`;
    img.style.left = `${
      imageCount * (CONFIG.image.initial.width + CONFIG.image.initial.margin)
    }px`;
    img.style.top = `${
      (canvas.offsetHeight - CONFIG.image.initial.height) / 2
    }px`;

    return img;
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

    const canvas = document.getElementById(CONFIG.canvas.id);
    const canvasRect = canvas.getBoundingClientRect();
    const elementRect = this.element.getBoundingClientRect();

    newX = Math.max(0, Math.min(newX, canvasRect.width - elementRect.width));
    newY = Math.max(0, Math.min(newY, canvasRect.height - elementRect.height));

    this.element.style.left = `${newX}px`;
    this.element.style.top = `${newY}px`;
  }

  handleResize(event) {
    if (!this.element) return;

    const { height } = event.rect;
    const canvas = document.getElementById(CONFIG.canvas.id);
    const canvasRect = canvas.getBoundingClientRect();

    // Mantiene il rapporto d'aspetto originale
    const originalWidth = this.element.naturalWidth || this.element.offsetWidth;
    const originalHeight =
      this.element.naturalHeight || this.element.offsetHeight;
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

  remove() {
    if (!this.element) return;

    const { width, depth, flavors } = this.element.dataset;
    this.state.update(
      Number(width),
      Number(depth),
      Number(flavors),
      "subtract"
    );

    gsap.to(this.element, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: "back.in(1.7)",
      onComplete: () => this.element.remove(),
    });
  }
}
