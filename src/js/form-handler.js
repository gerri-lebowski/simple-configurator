// Form Handler Module
export class FormHandler {
  constructor() {
    this.modal = document.getElementById("configModal");
    this.form = document.getElementById("configForm");
    this.closeBtn = document.querySelector(".close");
    this.completeConfigBtn = document.getElementById("completeConfigBtn");
    this.canvas = document.getElementById("canvas");

    this.init();
  }

  init() {
    // Inizializza EmailJS
    emailjs.init("2J-leznCbJe6N67EJ");

    // Event listeners
    this.completeConfigBtn.addEventListener("click", () => this.openModal());
    this.closeBtn.addEventListener("click", () => this.closeModal());
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  openModal() {
    this.modal.style.display = "block";
  }

  closeModal() {
    this.modal.style.display = "none";
  }

  // Cattura il canvas come immagine
  captureCanvas() {
    // Crea un canvas temporaneo per catturare tutto il contenuto
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    // Imposta le dimensioni del canvas temporaneo (ridotte per ottimizzare)
    const scale = 0.5; // Riduce le dimensioni del 50%
    tempCanvas.width = this.canvas.offsetWidth * scale;
    tempCanvas.height = this.canvas.offsetHeight * scale;

    // Disegna lo sfondo bianco
    tempCtx.fillStyle = "#ffffff";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Cattura tutti gli elementi draggabili
    const draggables = this.canvas.querySelectorAll(".draggable-container");
    draggables.forEach((draggable) => {
      const rect = draggable.getBoundingClientRect();
      const canvasRect = this.canvas.getBoundingClientRect();

      // Calcola la posizione relativa al canvas (scalata)
      const x = (rect.left - canvasRect.left) * scale;
      const y = (rect.top - canvasRect.top) * scale;
      const width = rect.width * scale;
      const height = rect.height * scale;

      // Crea un'immagine dall'elemento draggable
      const img = draggable.querySelector("img");
      if (img) {
        tempCtx.save();
        // Applica la trasformazione (rotazione, scala, ecc.)
        const transform = window.getComputedStyle(draggable).transform;
        const matrix = new DOMMatrix(transform);
        tempCtx.translate(x + width / 2, y + height / 2);
        tempCtx.rotate(matrix.a);
        tempCtx.scale(matrix.a, matrix.d);
        tempCtx.translate(-width / 2, -height / 2);
        tempCtx.drawImage(img, 0, 0, width, height);
        tempCtx.restore();
      }
    });

    // Aggiungi le etichette "Lato Cliente" e "Lato Operatore"
    tempCtx.fillStyle = "#1e293b";
    tempCtx.font = `${14 * scale}px InterVariable, system-ui, sans-serif`;
    tempCtx.textAlign = "center";
    tempCtx.fillText("Lato Cliente", tempCanvas.width / 2, 30 * scale);
    tempCtx.fillText(
      "Lato Operatore",
      tempCanvas.width / 2,
      tempCanvas.height - 10 * scale
    );

    // Converti in JPEG con qualità ridotta per ulteriore compressione
    return tempCanvas.toDataURL("image/jpeg", 0.7);
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Cattura il canvas come immagine
    const canvasImage = this.captureCanvas();

    // Raccogli i dati del form nel formato corretto per EmailJS
    const formData = {
      to_name: this.form.name.value,
      to_email: this.form.email.value,
      phone: this.form.phone.value,
      company: this.form.company.value,
      message: this.form.message.value,
      totalWidth: document.getElementById("totalWidth").textContent,
      totalFlavors: document.getElementById("totalFlavors").textContent,
      canvasImage: canvasImage,
      // Nuovi campi
      glicole: this.form.glicole.value,
      teca: this.form.teca.value,
      rotazione: this.form.rotazione.value,
      tappi: this.form.tappi.value,
      riserva: this.form.riserva.value,
    };

    // Salva il testo originale del pulsante
    const submitBtn = this.form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    try {
      // Mostra stato di caricamento
      submitBtn.textContent = "Invio in corso...";
      submitBtn.disabled = true;

      // Log dei dati prima dell'invio
      console.log("Dati da inviare:", formData);

      // Invia l'email
      const response = await emailjs.send(
        "service_gkefhak",
        "template_scrrj8d",
        formData,
        "2J-leznCbJe6N67EJ"
      );

      console.log("Risposta EmailJS:", response);

      // Salva in localStorage
      this.saveToLocalStorage(formData);

      // Mostra messaggio di successo
      alert("Configurazione inviata con successo!");
      this.closeModal();
      this.form.reset();
    } catch (error) {
      console.error("Errore dettagliato:", {
        message: error.message,
        stack: error.stack,
        text: error.text,
      });
      alert(
        `Si è verificato un errore nell'invio della configurazione.\nErrore: ${
          error.message || "Errore sconosciuto"
        }`
      );
    } finally {
      // Ripristina il pulsante
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  saveToLocalStorage(data) {
    // Get existing configurations or initialize empty array
    let configurations = JSON.parse(
      localStorage.getItem("configurations") || "[]"
    );

    // Add new configuration
    configurations.push(data);

    // Save back to localStorage
    localStorage.setItem("configurations", JSON.stringify(configurations));
  }
}
