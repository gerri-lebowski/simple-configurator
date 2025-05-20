// Form Handler Module
import EMAIL_CONFIG from "./modules/email-config.js";

export class FormHandler {
  constructor() {
    this.modal = document.getElementById("configModal");
    this.form = document.getElementById("configForm");
    this.closeBtn = document.querySelector(".close");
    this.completeConfigBtn = document.getElementById("completeConfigBtn");
    this.canvas = document.getElementById("canvas");
    this.riservaSelect = document.getElementById("riserva");

    // Elementi del riepilogo
    this.summaryWidth = document.getElementById("summaryWidth");
    this.summaryDepth = document.getElementById("summaryDepth");
    this.summaryFlavors = document.getElementById("summaryFlavors");

    // Loading spinner
    this.spinner = document.createElement("div");
    this.spinner.className = "spinner";
    this.spinner.style.display = "none";
    document.body.appendChild(this.spinner);

    // Inizializza emailjs
    emailjs.init(EMAIL_CONFIG.publicKey);

    this.init();
  }

  init() {
    // Apri il modal quando clicchi sul pulsante
    this.completeConfigBtn.addEventListener("click", () => {
      this.openModal();
    });

    // Chiudi il modal quando clicchi sulla X
    this.closeBtn.addEventListener("click", () => {
      this.closeModal();
    });

    // Chiudi il modal quando clicchi fuori dal contenuto
    window.addEventListener("click", (event) => {
      if (event.target === this.modal) {
        this.closeModal();
      }
    });

    // Gestisci l'invio del form
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Gestisci il cambio di selezione per la riserva
    this.riservaSelect.addEventListener("change", () => {
      this.updateSummary();
    });

    // Carica i dati salvati dal localStorage
    this.loadSavedData();
  }

  openModal() {
    this.modal.style.display = "block";
    this.updateSummary();
  }

  closeModal() {
    this.modal.style.display = "none";
  }

  updateSummary() {
    // Ottieni i valori correnti
    const totalWidth = document.getElementById("totalWidth").textContent;
    const totalDepth = document.getElementById("totalDepth").textContent;
    const totalFlavors = document.getElementById("totalFlavors").textContent;

    // Aggiorna i campi del riepilogo
    this.summaryWidth.textContent = totalWidth;
    this.summaryDepth.textContent = totalDepth;

    // Gestisci la logica della riserva
    const flavorCount = parseInt(totalFlavors, 10) || 0;
    const isRiserva = this.riservaSelect.value === "con_riserva";

    if (isRiserva && flavorCount > 0) {
      this.summaryFlavors.textContent = `${flavorCount} + ${flavorCount} (riserva) = ${
        flavorCount * 2
      }`;
    } else {
      this.summaryFlavors.textContent = totalFlavors;
    }

    // Salva i dati aggiornati nel localStorage
    this.saveData();
  }

  saveData() {
    const data = {
      totalWidth: document.getElementById("totalWidth").textContent,
      totalDepth: document.getElementById("totalDepth").textContent,
      totalFlavors: this.summaryFlavors.textContent,
      riserva: this.riservaSelect.value,
    };
    localStorage.setItem("configuratorData", JSON.stringify(data));
  }

  loadSavedData() {
    const savedData = localStorage.getItem("configuratorData");
    if (savedData) {
      const data = JSON.parse(savedData);
      this.summaryWidth.textContent = data.totalWidth;
      this.summaryDepth.textContent = data.totalDepth;
      this.summaryFlavors.textContent = data.totalFlavors;
      this.riservaSelect.value = data.riserva;
    }
  }

  showSpinner() {
    this.spinner.style.display = "block";
    this.form.querySelector('button[type="submit"]').disabled = true;
  }

  hideSpinner() {
    this.spinner.style.display = "none";
    this.form.querySelector('button[type="submit"]').disabled = false;
  }

  async handleSubmit() {
    try {
      this.showSpinner();

      // Raccogli i dati del form
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());

      // Aggiungi i dati della configurazione
      data.totalWidth = document.getElementById("totalWidth").textContent;
      data.totalDepth = document.getElementById("totalDepth").textContent;
      data.totalFlavors = this.summaryFlavors.textContent;

      // Ottieni l'immagine del canvas (screenshot della configurazione)
      let canvasImage = null;
      try {
        // Usa html2canvas se disponibile
        if (typeof html2canvas !== "undefined") {
          const canvasElement = document.getElementById("canvas");

          // Crea un canvas temporaneo ridimensionato
          const maxWidth = 800; // Aumentato da 600 a 800px
          const screenshot = await html2canvas(canvasElement, {
            scale: 1.5, // Aumenta la risoluzione di rendering
            useCORS: true, // Gestisce immagini cross-origin
            allowTaint: true,
          });

          // Crea un canvas ridimensionato per ridurre la dimensione dell'immagine
          const scaleFactor = maxWidth / screenshot.width;
          const tempCanvas = document.createElement("canvas");
          const ctx = tempCanvas.getContext("2d");

          tempCanvas.width = screenshot.width * scaleFactor;
          tempCanvas.height = screenshot.height * scaleFactor;

          // Migliore qualità di rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          // Disegna l'immagine ridimensionata
          ctx.drawImage(
            screenshot,
            0,
            0,
            screenshot.width,
            screenshot.height,
            0,
            0,
            tempCanvas.width,
            tempCanvas.height
          );

          // Converti in formato JPEG con una qualità più alta
          canvasImage = tempCanvas.toDataURL("image/jpeg", 0.75); // Aumentato da 0.5 a 0.75
        }
      } catch (e) {
        console.warn("Impossibile catturare l'immagine del canvas:", e);
      }

      // Salva i dati nel localStorage
      this.saveData();

      // Prepara il template per emailjs
      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        phone: data.phone,
        company: data.company,
        totalWidth: data.totalWidth,
        totalDepth: data.totalDepth,
        totalFlavors: data.totalFlavors,
        glicole: data.glicole || "Non specificato",
        teca: data.teca || "Non specificato",
        rotazione: data.rotazione || "Non specificato",
        tappi: data.tappi || "Non specificato",
        riserva:
          this.riservaSelect.options[this.riservaSelect.selectedIndex].text,
        message: data.message || "",
      };

      // Aggiungi l'immagine solo se non è troppo grande (45KB circa)
      const imageSize = canvasImage
        ? Math.round((canvasImage.length * 3) / 4)
        : 0;
      if (imageSize > 0 && imageSize < 45000) {
        templateParams.canvas_image = canvasImage;
      } else {
        console.warn(
          "L'immagine del canvas è troppo grande per essere inviata via email:",
          imageSize / 1024,
          "KB"
        );
      }

      // Invia l'email
      await emailjs.send(
        EMAIL_CONFIG.serviceID,
        EMAIL_CONFIG.templateID,
        templateParams
      );

      // Chiudi il modal dopo l'invio
      this.closeModal();

      // Mostra un messaggio di conferma
      this.hideSpinner();
      alert("Configurazione inviata con successo! Ti contatteremo presto.");
    } catch (error) {
      console.error("Errore durante l'invio:", error);
      this.hideSpinner();
      alert("Si è verificato un errore durante l'invio. Riprova più tardi.");
    }
  }
}
