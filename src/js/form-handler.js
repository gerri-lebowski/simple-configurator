// Form Handler Module
export class FormHandler {
  constructor() {
    this.modal = document.getElementById("configModal");
    this.form = document.getElementById("configForm");
    this.closeBtn = document.querySelector(".close");
    this.completeConfigBtn = document.getElementById("completeConfigBtn");

    // Inizializza EmailJS
    emailjs.init("2J-leznCbJe6N67EJ");

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Open modal
    this.completeConfigBtn.addEventListener("click", () => this.openModal());

    // Close modal
    this.closeBtn.addEventListener("click", () => this.closeModal());
    window.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // Form submission
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  openModal() {
    this.modal.style.display = "block";
  }

  closeModal() {
    this.modal.style.display = "none";
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Get form data
    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      company: document.getElementById("company").value,
      message: document.getElementById("message").value,
      configuration: {
        totalWidth: document.getElementById("totalWidth").textContent,
        totalFlavors: document.getElementById("totalFlavors").textContent,
      },
    };

    try {
      // Mostra un messaggio di caricamento
      const submitButton = this.form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = "Invio in corso...";
      submitButton.disabled = true;

      // Invia l'email usando EmailJS
      await emailjs.send("service_gkefhak", "template_scrrj8d", {
        to_name: formData.name,
        to_email: formData.email,
        phone: formData.phone,
        company: formData.company,
        message: formData.message,
        configuration: `Larghezza totale: ${formData.configuration.totalWidth}cm\nGusti selezionati: ${formData.configuration.totalFlavors}`,
      });

      // Salva in localStorage
      this.saveToLocalStorage(formData);

      // Mostra messaggio di successo
      alert("Configurazione inviata con successo!");
      this.closeModal();
      this.form.reset();
    } catch (error) {
      console.error("Errore durante l'invio:", error);
      alert("Si è verificato un errore durante l'invio. Riprova più tardi.");
    } finally {
      // Ripristina il pulsante
      const submitButton = this.form.querySelector('button[type="submit"]');
      submitButton.textContent = "Invia Configurazione";
      submitButton.disabled = false;
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
