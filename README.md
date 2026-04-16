# El Pollo Loco

Ein browserbasiertes 2D-Jump-and-Run-Spiel, entwickelt mit Vanilla JavaScript und dem HTML5 Canvas.

## Spielprinzip

Steuere Pepe durch eine mexikanische Wüstenlandschaft. Sammle Münzen und Wurfflaschen, besiege Hühner und kleinen Hühner — und zerstöre den Endboss El Pollo Loco mit gezielten Flaschenwürfen.

## Steuerung

| Taste / Button | Aktion |
|---|---|
| `→` / `←` | Laufen |
| `Leertaste` | Springen |
| `D` | Flasche werfen |

Auf Touchgeräten werden On-Screen-Buttons eingeblendet.

## Projektstruktur

```
EL_pollo_loco/
├── index.html
├── style.css
├── js/
│   ├── game.js               # Einstiegspunkt, Keyboard-Handling, Touch-Controls
│   └── startscreen/          # Startscreen-Logik (State, Menüs, Audio, Flow)
├── models/                   # Spielklassen (Character, Enemies, World, …)
├── levels/                   # Level-Definitionen
├── audio/                    # Soundeffekte und Musik
└── img/                      # Sprites und Hintergrundbilder
```

## Ausführen

Öffne `index.html` direkt im Browser oder starte einen lokalen Dev-Server (z. B. Live Server in VS Code). Keine Build-Schritte, keine Abhängigkeiten.

## Kommentarstil

Kommentare nur dann, wenn sie echten Mehrwert bieten.

Für Funktionskommentare in diesem Projekt:

- Mit einem Verb beginnen und den konkreten Effekt beschreiben.
- Beschreiben, **was** die Funktion tut — nicht nur, dass sie etwas „verwaltet" oder „setzt".
- Hauptbeschreibung auf einen knappen Satz begrenzen.
- `@param` und `@returns` nur ergänzen, wenn sie Eingaben oder Ausgaben wirklich klären.
- Immer mit dem tatsächlichen Verhalten im Code übereinstimmen.

**Gut:**

```js
/**
 * Creates the game world, connects canvas and input, and starts rendering plus gameplay loops.
 */

/**
 * Returns whether the player can start a manual jump right now.
 * @returns {boolean}
 */
```

**Vermeiden:**

```js
/**
 * Constructor - initializes things
 */

/**
 * Handles player logic
 */
```
