// Form Handler Module
export class FormHandler {
  constructor() {
    this.modal = document.getElementById("configModal");
    this.form = document.getElementById("configForm");
    this.closeBtn = document.querySelector(".close");
    this.completeConfigBtn = document.getElementById("completeConfigBtn");

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
      timestamp: new Date().toISOString(),
      configuration: {
        totalWidth: document.getElementById("totalWidth").textContent,
        totalDepth: document.getElementById("totalDepth").textContent,
        totalFlavors: document.getElementById("totalFlavors").textContent,
      },
    };

    // Save to localStorage
    this.saveToLocalStorage(formData);

    try {
      // Here you would implement the email sending logic
      // For now, we'll just show a success message
      alert("Configurazione salvata con successo!");
      this.closeModal();
      this.form.reset();
    } catch (error) {
      console.error("Errore durante il salvataggio:", error);
      alert(
        "Si è verificato un errore durante il salvataggio. Riprova più tardi."
      );
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
