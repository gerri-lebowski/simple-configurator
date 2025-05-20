export default class ConfiguratorState {
  constructor() {
    this.totalWidth = 0;
    this.totalDepth = 0;
    this.totalFlavors = 0;
    this.baseDepth = 0; // Profondità del primo banco aggiunto
    this.flavorsList = [];
    this.isFirstElement = true; // Flag per tracciare il primo elemento
    this.curvedElements = []; // Array per tenere traccia degli elementi curvi
  }

  update(width, depth, flavors, action = "add", isCurve = false) {
    if (action === "add") {
      // Se è il primo banco, imposta la profondità di base
      if (this.isFirstElement && depth > 0) {
        this.baseDepth = depth;
        this.totalDepth = depth; // Imposta la profondità totale uguale alla profondità di base
        this.isFirstElement = false;
      }

      // Se è un banco curvo, raddoppia la larghezza
      const effectiveWidth = isCurve ? width * 2 : width;
      this.totalWidth += effectiveWidth;
      this.totalFlavors += flavors;
      this.flavorsList.push(flavors);

      // Se è curvo, aggiungilo alla lista degli elementi curvi
      if (isCurve) {
        this.curvedElements.push({ width, effectiveWidth });
      }
    } else if (action === "remove") {
      // Se è un banco curvo, rimuovi il doppio della larghezza
      const effectiveWidth = isCurve ? width * 2 : width;
      this.totalWidth -= effectiveWidth;
      this.totalFlavors -= flavors;

      // Rimuovi il gusto dalla lista
      const index = this.flavorsList.indexOf(flavors);
      if (index > -1) {
        this.flavorsList.splice(index, 1);
      }

      // Se è curvo, rimuovilo dalla lista degli elementi curvi
      if (isCurve) {
        const curveIndex = this.curvedElements.findIndex(
          (el) => el.width === width
        );
        if (curveIndex > -1) {
          this.curvedElements.splice(curveIndex, 1);
        }
      }

      // Se non ci sono più banchi, resetta tutto
      if (this.totalWidth <= 0) {
        this.baseDepth = 0;
        this.totalDepth = 0;
        this.totalWidth = 0;
        this.totalFlavors = 0;
        this.isFirstElement = true;
        this.curvedElements = [];
      }
    }

    // Aggiorna l'interfaccia utente
    this.updateUI();
  }

  reset() {
    this.totalWidth = 0;
    this.totalDepth = 0;
    this.totalFlavors = 0;
    this.baseDepth = 0;
    this.flavorsList = [];
    this.isFirstElement = true;
    this.curvedElements = [];
    this.updateUI();
  }

  // Quando aggiungi un elemento al canvas, controlla se è curvo
  addElement(element) {
    // Ottieni i dati dell'elemento
    const width = parseInt(element.dataset.width) || 0;
    const depth = parseInt(element.dataset.depth) || 0;
    const flavors = parseInt(element.dataset.flavors) || 0;

    // Se è il primo elemento, salva la profondità
    if (this.isFirstElement && depth > 0) {
      this.baseDepth = depth;
      this.totalDepth = depth; // Imposta la profondità totale uguale alla profondità di base
      this.isFirstElement = false;
    }

    // Aggiorna i totali
    this.totalWidth += width;
    this.totalFlavors += flavors;

    // Aggiorna l'interfaccia utente
    this.updateUI();
  }

  // Metodo per ottenere i dati della configurazione
  getConfigData() {
    return {
      totalWidth: this.totalWidth,
      baseDepth: this.baseDepth,
      totalFlavors: this.totalFlavors,
      flavorsList: this.flavorsList,
    };
  }

  updateUI() {
    // Prepara il testo della larghezza totale
    let widthText = `${this.totalWidth} cm`;

    // Se ci sono elementi curvi, aggiungi il dettaglio
    if (this.curvedElements.length > 0) {
      const baseWidth =
        this.totalWidth -
        this.curvedElements.reduce((sum, el) => sum + el.effectiveWidth, 0);
      const curvedWidth = this.curvedElements.reduce(
        (sum, el) => sum + el.width,
        0
      );

      // Costruisci la stringa con i valori separati
      const parts = [];
      if (baseWidth > 0) {
        parts.push(baseWidth);
      }

      // Aggiungi il valore del banco curvo due volte
      this.curvedElements.forEach((el) => {
        parts.push(el.width);
        parts.push(el.width);
      });

      widthText = `${parts.join(" + ")} = ${this.totalWidth} cm`;
    }

    // Aggiorna i display con i valori correnti
    document.getElementById("totalWidth").textContent = widthText;
    document.getElementById("totalDepth").textContent = `${this.totalDepth} cm`;
    document.getElementById(
      "totalFlavors"
    ).textContent = `${this.totalFlavors}`;

    // Aggiorna anche i campi nel modulo di riepilogo, se esistono
    const summaryWidth = document.getElementById("summaryWidth");
    const summaryDepth = document.getElementById("summaryDepth");
    const summaryFlavors = document.getElementById("summaryFlavors");

    if (summaryWidth) summaryWidth.textContent = widthText;
    if (summaryDepth) summaryDepth.textContent = `${this.totalDepth} cm`;
    if (summaryFlavors) summaryFlavors.textContent = `${this.totalFlavors}`;
  }
}
