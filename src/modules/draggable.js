import CONFIG from "./config.js";

// Classe per gestire le immagini draggabili
export default class DraggableImage {
  constructor(sourceImg, state) {
    this.sourceImg = sourceImg;
    this.state = state;
    this.width = Number(sourceImg.dataset.width) || 0;
    this.depth = Number(sourceImg.dataset.depth) || 0;
    this.flavors = Number(sourceImg.dataset.flavors) || 0;
    this.isCurve = sourceImg.dataset.curve === "true";

    this.element = this.createDraggableElement();
    this.setupInteractions();
  }

  createDraggableElement() {
    // Crea il container draggable
    const container = document.createElement("div");
    container.className = "draggable-container";

    // Imposta position absolute e centratura
    container.style.position = "absolute";
    container.style.left = "50%";
    container.style.top = "50%";
    container.style.transform = "translate(-50%, -50%)";

    // Crea l'immagine draggable
    const img = document.createElement("img");
    img.src = this.sourceImg.src;
    img.className = "draggable";
    img.alt = this.sourceImg.alt;

    // Imposta le dimensioni fisse dal config
    const baseWidth = CONFIG.image.width;
    const baseHeight = CONFIG.image.height;

    // Se è un banco curvo, raddoppia la larghezza
    if (this.isCurve) {
      img.style.width = `${baseWidth * 2}px`;
      img.style.height = `${baseHeight * 2}px`;
      img.classList.add("curve");
    } else {
      img.style.width = `${baseWidth}px`;
      img.style.height = `${baseHeight}px`;
    }

    // Aggiungi l'immagine al container
    container.appendChild(img);

    // Aggiungi il pulsante di rimozione
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-button";
    removeBtn.innerHTML = "×";
    removeBtn.title = "Rimuovi";
    container.appendChild(removeBtn);

    // Gestisci il click sul pulsante di rimozione
    removeBtn.addEventListener("click", () => {
      this.state.update(
        this.width,
        this.depth,
        this.flavors,
        "remove",
        this.isCurve
      );
      container.remove();
    });

    return container;
  }

  setupInteractions() {
    // Imposta le dimensioni massime del container
    const baseWidth = CONFIG.image.width;
    const baseHeight = CONFIG.image.height;

    // Se è un banco curvo, raddoppia la larghezza massima
    if (this.isCurve) {
      this.element.style.maxWidth = `${baseWidth * 2}px`;
      this.element.style.height = `${baseHeight * 2}px`;
      this.element.classList.add("curve");
    } else {
      this.element.style.maxWidth = `${baseWidth}px`;
      this.element.style.maxHeight = `${baseHeight}px`;
    }

    // Inizializza il drag and drop
    this.initDraggable();
    this.addRotateButton();
  }

  initDraggable() {
    interact(this.element).draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "parent",
          endOnly: true,
        }),
      ],
      autoScroll: true,
      listeners: {
        move: this.dragMoveListener.bind(this),
        end: this.dragEndListener.bind(this),
      },
    });
  }

  dragMoveListener(event) {
    const target = event.target;

    // Mantieni la posizione x e y dell'elemento
    const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

    // Ottieni l'angolo di rotazione corrente
    const rotation = parseInt(target.getAttribute("data-rotation") || 0);

    // Aggiorna la posizione dell'elemento con la rotazione
    target.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rotation}deg)`;

    // Aggiorna gli attributi data-x/data-y
    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
  }

  dragEndListener(event) {
    // Qui puoi aggiungere logica aggiuntiva quando il drag termina
    // Per esempio, snapping o collision detection
  }

  addRotateButton() {
    const rotateButton = document.createElement("button");
    rotateButton.className = "rotate-button";
    rotateButton.innerHTML = "↻";
    rotateButton.title = "Ruota elemento";

    rotateButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.rotateElement();
    });

    this.element.appendChild(rotateButton);
  }

  rotateElement() {
    // Ottieni l'angolo di rotazione corrente o imposta a 0 se non esiste
    const currentRotation = parseInt(
      this.element.getAttribute("data-rotation") || 0
    );
    // Aggiungi 90 gradi alla rotazione corrente
    const newRotation = currentRotation + 90;

    // Ottieni la posizione corrente
    const x = parseFloat(this.element.getAttribute("data-x")) || 0;
    const y = parseFloat(this.element.getAttribute("data-y")) || 0;

    // Applica la nuova rotazione mantenendo la posizione e la centratura
    this.element.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${newRotation}deg)`;

    // Salva il nuovo valore di rotazione
    this.element.setAttribute("data-rotation", newRotation);
  }
}
