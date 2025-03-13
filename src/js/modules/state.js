// Classe per gestire lo stato dell'applicazione
export default class ConfiguratorState {
  constructor() {
    this.totalWidth = 0;
    this.totalDepth = 0;
    this.totalFlavors = 0;
    console.log("ConfiguratorState initialized");
  }

  update(width, depth, flavors, operation = "add") {
    const modifier = operation === "add" ? 1 : -1;
    this.totalWidth += width * modifier;
    this.totalDepth += depth * modifier;
    this.totalFlavors += flavors * modifier;
    this.updateUI();
  }

  updateUI() {
    ["Width", "Depth", "Flavors"].forEach((prop) => {
      const element = document.getElementById(`total${prop}`);
      if (element) {
        element.textContent = this[`total${prop}`];
      }
    });
  }
}
