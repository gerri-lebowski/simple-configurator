/**
 * Funzione per abilitare il drag & drop sull'elemento
 */
function makeDraggable(el) {
  let offsetX = 0,
    offsetY = 0,
    startX = 0,
    startY = 0;
  el.addEventListener("mousedown", startDrag);

  function startDrag(e) {
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    document.addEventListener("mousemove", duringDrag);
    document.addEventListener("mouseup", stopDrag);
  }

  function duringDrag(e) {
    e.preventDefault();
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    startX = e.clientX;
    startY = e.clientY;
    let newLeft = el.offsetLeft + offsetX;
    let newTop = el.offsetTop + offsetY;

    // Limita lo spostamento all'interno del canvas
    const canvas = document.getElementById("canvas");
    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;
    const elWidth = el.offsetWidth;
    const elHeight = el.offsetHeight;
    if (newLeft < 0) newLeft = 0;
    if (newTop < 0) newTop = 0;
    if (newLeft + elWidth > canvasWidth) newLeft = canvasWidth - elWidth;
    if (newTop + elHeight > canvasHeight) newTop = canvasHeight - elHeight;

    el.style.left = newLeft + "px";
    el.style.top = newTop + "px";
  }

  function stopDrag() {
    document.removeEventListener("mousemove", duringDrag);
    document.removeEventListener("mouseup", stopDrag);
  }
}

/**
 * Funzione per aggiungere un'immagine al canvas con posizionamento calcolato
 */
function addImageToCanvas(src) {
  const canvas = document.getElementById("canvas");
  const margin = 10;
  const imageWidth = 80; // larghezza fissa
  const imageHeight = 80; // altezza fissa
  // Conta quante immagini sono già presenti nel canvas
  const currentImages = canvas.querySelectorAll("img.draggable");
  const imageCount = currentImages.length;

  // Calcola la larghezza totale del gruppo se aggiungiamo una nuova immagine
  const newGroupWidth = (imageCount + 1) * imageWidth + imageCount * margin;
  // Calcola la posizione di partenza per centrare il gruppo
  const canvasWidth = canvas.offsetWidth;
  const canvasHeight = canvas.offsetHeight;
  const groupStartLeft = (canvasWidth - newGroupWidth) / 2;

  // Posiziona la nuova immagine accanto alle già presenti
  const newImageLeft = groupStartLeft + imageCount * (imageWidth + margin);
  const newImageTop = (canvasHeight - imageHeight) / 2;

  // Crea l'elemento immagine
  let newImg = document.createElement("img");
  newImg.src = src;
  newImg.alt = "Elemento configurato";
  newImg.classList.add("draggable");
  newImg.style.left = newImageLeft + "px";
  newImg.style.top = newImageTop + "px";

  // Rimuovi l'immagine con doppio click
  newImg.addEventListener("dblclick", function () {
    newImg.remove();
  });

  canvas.appendChild(newImg);
  makeDraggable(newImg);
}

/**
 * Aggiungi un event listener alle immagini della galleria
 */
document.querySelectorAll("#gallery img").forEach(function (img) {
  img.addEventListener("click", function () {
    addImageToCanvas(img.src);
  });
});
