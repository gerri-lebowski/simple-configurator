# Configuratore BRX - Spiegazione del Codice

## Panoramica

Il configuratore BRX è un'applicazione web che permette agli utenti di
configurare visivamente banchi per gelateria. Gli utenti possono trascinare
diversi tipi di banchi in un'area di lavoro (canvas) e vedere in tempo reale le
dimensioni totali e il numero di gusti disponibili.

## Struttura del Progetto

```
src/
├── js/
│   ├── modules/
│   │   ├── draggable.js    # Gestione delle immagini trascinabili
│   │   └── state.js        # Gestione dello stato dell'applicazione
│   └── main.js             # Punto di ingresso dell'applicazione
└── css/
    └── main.css            # Stili dell'applicazione
```

## Componenti Principali

### 1. Classe DraggableImage (`draggable.js`)

Questa classe gestisce le immagini trascinabili nel canvas.

```javascript
class DraggableImage {
  constructor(sourceImg, state) {
    this.state = state;
    this.element = this.createImageElement(sourceImg);
    this.setupInteractions();
    this.setupAnimation();
    this.currentRotation = 0;
  }
  // ...
}
```

#### Funzionalità Principali:

- **Creazione Elementi**: Crea un contenitore per l'immagine con tutti gli
  attributi necessari
- **Gestione Interazioni**: Implementa il trascinamento e il comportamento
  magnetico
- **Rotazione**: Permette di ruotare le immagini di 90 gradi
- **Rimozione**: Gestisce la rimozione delle immagini con animazioni

#### Esempio di Creazione:

```javascript
// Quando un'immagine viene cliccata nella galleria
const newImage = new DraggableImage(sourceImg, state);
```

### 2. Classe State (`state.js`)

Gestisce lo stato dell'applicazione, tenendo traccia delle dimensioni totali e
dei gusti.

```javascript
class State {
  constructor() {
    this.totalWidth = 0;
    this.totalFlavors = 0;
    this.widths = [];
    this.flavors = [];
  }
  // ...
}
```

#### Funzionalità Principali:

- **Tracking Dimensioni**: Tiene traccia delle larghezze individuali e totali
- **Gestione Banchi Curvi**: Raddoppia la larghezza per i banchi curvi
- **Aggiornamento UI**: Mantiene aggiornata l'interfaccia utente

#### Esempio di Aggiornamento:

```javascript
// Quando viene aggiunto un banco curvo di 1610cm
state.update(1610, 0, 12, "add");
// Mostra: "1610 cm + 1610 cm (curvo) = 3220 cm"
```

### 3. Interazioni tra Componenti

#### Flusso di Aggiunta di un Banco:

1. L'utente clicca su un'immagine nella galleria
2. Viene creato un nuovo `DraggableImage`
3. `DraggableImage` notifica `State` dell'aggiunta
4. `State` aggiorna i totali e l'UI

#### Flusso di Rimozione di un Banco:

1. L'utente fa doppio clic su un'immagine
2. `DraggableImage` avvia l'animazione di rimozione
3. `DraggableImage` notifica `State` della rimozione
4. `State` aggiorna i totali e l'UI

## Scelte di Progettazione

### 1. Gestione dello Stato

Ho scelto di separare la gestione dello stato in una classe dedicata per:

- Mantenere il codice organizzato e manutenibile
- Facilitare l'aggiunta di nuove funzionalità
- Evitare duplicazione di codice

### 2. Comportamento Magnetico

L'implementazione del comportamento magnetico usa Interact.js perché:

- È una libreria ben mantenuta e documentata
- Offre buone prestazioni
- Permette una facile personalizzazione del comportamento

### 3. Gestione dei Banchi Curvi

La gestione speciale dei banchi curvi è implementata in due punti:

1. In `DraggableImage`: per la visualizzazione
2. In `State`: per il calcolo dei totali

Questo approccio separa le responsabilità:

- La visualizzazione è gestita dal componente UI
- Il calcolo è gestito dalla logica di business

## Esempi Pratici

### Aggiunta di un Banco Curvo

```javascript
// 1. L'utente clicca su un'immagine curva
const sourceImg = document.querySelector('[data-curve="true"]');

// 2. Viene creato un nuovo DraggableImage
const image = new DraggableImage(sourceImg, state);
// - Crea l'elemento DOM
// - Imposta gli attributi
// - Aggiunge la classe 'curve'

// 3. State aggiorna i totali
// - Aggiunge la larghezza due volte
// - Aggiorna l'UI: "1610 cm + 1610 cm (curvo) = 3220 cm"
```

### Rimozione di un Banco

```javascript
// 1. L'utente fa doppio clic
image.remove();

// 2. Viene avviata l'animazione
gsap.to(image.element, {
  scale: 0,
  opacity: 0,
  onComplete: () => image.element.remove(),
});

// 3. State aggiorna i totali
state.update(width, 0, flavors, "subtract");
```

## Note per lo Sviluppo Futuro

1. **Estensibilità**: La struttura attuale permette di aggiungere facilmente:

   - Nuovi tipi di banchi
   - Nuove funzionalità di interazione
   - Nuovi calcoli per le dimensioni

2. **Miglioramenti Possibili**:

   - Aggiungere undo/redo
   - Implementare il salvataggio delle configurazioni
   - Aggiungere validazioni per combinazioni non valide

3. **Considerazioni sulle Prestazioni**:
   - Il calcolo delle distanze per il comportamento magnetico potrebbe essere
     ottimizzato
   - Le animazioni potrebbero essere rese più fluide
   - La gestione degli eventi potrebbe essere debounced per migliori prestazioni

## Conclusione

Il configuratore BRX è un esempio di come strutturare un'applicazione web
interattiva usando principi di programmazione orientata agli oggetti e
separazione delle responsabilità. La struttura modulare permette una facile
manutenzione e l'aggiunta di nuove funzionalità.
