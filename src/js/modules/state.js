// Classe per gestire lo stato dell'applicazione
export default class ConfiguratorState {
  constructor() {
    this.totalWidth = 0;
    this.totalDepth = 0;
    this.flavorsList = []; // Array per tenere traccia dei singoli valori
    this.totalFlavors = 0; // Manteniamo anche il totale
    console.log("ConfiguratorState initialized");
  }

  update(width, depth, flavors, operation = "add") {
    const modifier = operation === "add" ? 1 : -1;
    this.totalWidth += width * modifier;
    this.totalDepth += depth * modifier;

    // Gestione dei flavors
    if (operation === "add") {
      this.flavorsList.push(flavors);
    } else {
      // Rimuovi il valore dalla lista
      const index = this.flavorsList.indexOf(flavors);
      if (index > -1) {
        this.flavorsList.splice(index, 1);
      }
    }

    // Aggiorna il totale dei flavors
    this.totalFlavors = this.flavorsList.reduce((sum, value) => sum + value, 0);

    this.updateUI();
  }

  updateUI() {
    // Aggiorna width e depth normalmente
    document.getElementById("totalWidth").textContent = this.totalWidth;
    document.getElementById("totalDepth").textContent = this.totalDepth;

    // Formatta i flavors come lista concatenata + totale
    const flavorsElement = document.getElementById("totalFlavors");
    if (flavorsElement) {
      if (this.flavorsList.length > 0) {
        const concatenated = this.flavorsList.join(" + ");
        const total = this.totalFlavors;
        flavorsElement.textContent = `${concatenated} = ${total}`;
      } else {
        flavorsElement.textContent = "0";
      }
    }
  }
}
