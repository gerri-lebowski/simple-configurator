let totalWidth = 0;
let totalDepth = 0;
let totalFlavors = 0;

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
 * Funzione per aggiornare i totali
 */
function updateInfo() {
  document.getElementById("totalWidth").textContent = totalWidth;
  document.getElementById("totalDepth").textContent = totalDepth;
  document.getElementById("totalFlavors").textContent = totalFlavors;
}

/**
 * Funzione per aggiungere un'immagine al canvas con posizionamento corretto
 */
function addImageToCanvas(img) {
  const canvas = document.getElementById("canvas");
  const margin = 10;
  const imageWidth = 80;
  const imageHeight = 80;

  // Conta immagini già presenti
  const currentImages = canvas.querySelectorAll("img.draggable");
  const imageCount = currentImages.length;

  // Posizionamento iniziale
  const newImageLeft = imageCount * (imageWidth + margin);
  const newImageTop = (canvas.offsetHeight - imageHeight) / 2;

  // Crea l'elemento immagine
  let newImg = document.createElement("img");
  newImg.src = img.src;
  newImg.classList.add("draggable");
  newImg.style.left = newImageLeft + "px";
  newImg.style.top = newImageTop + "px";

  // Attributi dati
  newImg.dataset.width = img.dataset.width;
  newImg.dataset.depth = img.dataset.depth;
  newImg.dataset.flavors = img.dataset.flavors;

  // Converti i valori in numeri prima di sommarli
  let imgWidth = Number(img.dataset.width) || 0;
  let imgDepth = Number(img.dataset.depth) || 0;
  let imgFlavors = Number(img.dataset.flavors) || 0;

  // Aggiorna totali
  totalWidth += imgWidth;
  totalDepth += imgDepth;
  totalFlavors += imgFlavors;
  updateInfo();

  // Rimozione immagine su doppio clic
  newImg.addEventListener("dblclick", function () {
    totalWidth -= imgWidth;
    totalDepth -= imgDepth;
    totalFlavors -= imgFlavors;
    updateInfo();
    newImg.remove();
  });

  canvas.appendChild(newImg);
  makeDraggable(newImg);
}

/**
 * Aggiungi event listener alle immagini della galleria
 */
document.querySelectorAll("#gallery img").forEach((img) => {
  img.addEventListener("click", function () {
    addImageToCanvas(img);
  });
});
