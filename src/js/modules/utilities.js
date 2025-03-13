import CONFIG from "./config.js";

/**
 * Funzione per verificare se due elementi si sovrappongono
 */
export function checkOverlap(rect1, rect2) {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

/**
 * Funzione migliorata per trovare il punto di snapping più vicino
 */
export function findSnapPoint(draggedEl, otherElements) {
  const draggedRect = draggedEl.getBoundingClientRect();
  const canvas = document.getElementById("canvas");
  const canvasRect = canvas.getBoundingClientRect();

  let bestSnap = null;
  let minDistance = CONFIG.snap.threshold;

  otherElements.forEach((element) => {
    const elementRect = element.getBoundingClientRect();

    // Calcola le distanze relative al canvas
    const draggedLeft = draggedEl.offsetLeft;
    const draggedRight = draggedLeft + draggedEl.offsetWidth;
    const elementLeft = element.offsetLeft;
    const elementRight = elementLeft + element.offsetWidth;

    // Snapping orizzontale
    // Snap al lato destro
    const rightDistance = Math.abs(draggedLeft - elementRight);
    if (rightDistance < minDistance) {
      bestSnap = {
        x: elementRight,
        y: draggedEl.offsetTop,
        distance: rightDistance,
      };
      minDistance = rightDistance;
    }

    // Snap al lato sinistro
    const leftDistance = Math.abs(draggedRight - elementLeft);
    if (leftDistance < minDistance) {
      bestSnap = {
        x: elementLeft - draggedEl.offsetWidth,
        y: draggedEl.offsetTop,
        distance: leftDistance,
      };
      minDistance = leftDistance;
    }
  });

  return bestSnap;
}

/**
 * Funzione per mostrare un messaggio di errore sul canvas
 */
export function showCanvasMessage(message, type = "error") {
  const canvas = document.getElementById("canvas");
  const existingMessage = canvas.querySelector(".canvas-message");

  if (existingMessage) {
    existingMessage.remove();
  }

  const messageEl = document.createElement("div");
  messageEl.className = `canvas-message ${type}`;
  messageEl.textContent = message;
  messageEl.style.position = "absolute";
  messageEl.style.top = "10px";
  messageEl.style.left = "50%";
  messageEl.style.transform = "translateX(-50%)";
  messageEl.style.padding = "10px 20px";
  messageEl.style.backgroundColor =
    type === "error" ? "rgba(255, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.8)";
  messageEl.style.color = "white";
  messageEl.style.borderRadius = "5px";
  messageEl.style.zIndex = "1000";

  canvas.appendChild(messageEl);

  // Rimuovi il messaggio dopo 3 secondi
  setTimeout(() => messageEl.remove(), 3000);
}
