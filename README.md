# Arma 3 Tactical Loadout Generator

A tactical, high-performance web application designed to generate authentic, randomized infantry loadouts for **Arma 3** with real-time SQF serialization, Eden 3D Editor init snippets, and Discord-ready tactical briefing image cards.

Built with pure Vanilla JavaScript, HTML5 Canvas, and modern dark-mode CSS — zero runtime frameworks, zero bloated dependencies.

---

## ⚡ Key Features

* **Authentic Faction Doctrines**: Supports **NATO (BLUFOR)**, **CSAT (OPFOR)**, **AAF (Independent)**, and **FIA (Guerilla)** across standard combat roles (Rifleman, Medic, Marksman, Anti-Tank, Machine Gunner, Sniper).
* **Chaos Mode Randomizer**:
  * **Level 1 (Military Authenticity)**: Strict doctrinal uniforms, faction-issued firearms, and standard attachments.
  * **Level 2 (SpecOps / Contractor)**: Modern cross-faction attachments, customized camouflage, and allied battle weapons.
  * **Level 3 (Cursed / Wildcard)**: Cross-faction wildcards, improvised gear, and rare firearms.
* **Mod Pack Support**: Filter by or mix **Vanilla A3**, **RHS (USAF / AFRF)**, **CUP Weapons**, and **NIArms / HLC**.
* **5 Camouflage & Biome Profiles**: Automatic or forced camouflage kits for **Woodland**, **Arid / Desert**, **Tropic / Jungle**, **Urban / MOUT**, and **Winter / Alpine**.
* **Night Operations & Optics Range Engine**:
  * Force IR laser pointers, NVG devices, and visible tracer ammunition for night drops.
  * Engagement range filters: **CQB** (<100m red dots), **Mid-Range** (ACO/RCO 1x–4x), **Long Range** (>6x DMR/Sniper), and **Thermal** (TWS sights).
* **ACE3 Medical Depth Presets**: Switch between **Vanilla Arma 3**, **ACE3 Standard** (Tourniquets, field dressings, morphine), and **ACE3 Advanced** (Elastic bandages, QuikClot, saline IVs, splints, surgical kits).
* **Caliber & Ammunition Specialty Customizer**:
  * Caliber locking for 5.56x45, 6.5x39, 7.62x39, 7.62x51, 7.62x54R, 9mm, and heavy calibers (.338/.408/.50 BMG).
  * Specialty rounds: Standard Ball, Tracer, Armor-Piercing (EPR/AP), and Subsonic.
* **Multi-Format SQF & Eden Export**:
  * `player setUnitLoadout [...]` (Direct console/client execution).
  * `this setUnitLoadout [...]` (Eden Editor 3D unit init attribute).
  * `_unit setUnitLoadout [...]` (Multiplayer respawn scripts).
  * `call BIS_fnc_saveInventory;` (Arma 3 standard inventory save).
  * Instant `.sqf` file download.
* **Discord & Unit Briefing Card PNG Exporter**:
  * Renders an 800×480 tactical PNG mission manifest using HTML5 Canvas2D.
  * Features equipment listings, logistics breakdown, and an embedded 5-axis combat radar chart.
* **Interactive Armory & Search**:
  * Browse hundreds of vanilla and modded firearms with real photos and stats.
  * Interactive radar chart evaluating Fire Rate, Range, Recoil, Portability, and Modularity.
* **Logistics & Encumbrance Engine**:
  * Real-time weight calculations in kg/lbs, stamina encumbrance rating, and combat sustainability estimation.
* **Loadout Comparison Mode**: Side-by-side recursive diff modal highlighting equipment deltas between rolls.
* **Reverse-Parse Arsenal SQF Importer**: Paste any `setUnitLoadout` or `getUnitLoadout` SQF array from the Virtual Arsenal or server logs to reverse-engineer and inspect the kit.
* **Squad Builder**: Generate multi-unit tactical fireteams and infantry squads with batch SQF export.
* **Synthesized Tactical Audio FX**: Mechanical bolt-rack, radio chirp, and click sounds generated natively via the Web Audio API.
* **Keyboard Hotkeys**: Full keyboard navigation (<kbd>R</kbd> to roll, <kbd>Ctrl+Shift+C</kbd> to copy, <kbd>1-5</kbd> for tabs, <kbd>?</kbd> for help).

---

## 🚀 Quick Start

### Running Locally
No build step or Node.js server required! Simply open `index.html` in your browser:
```bash
# Option A: Directly open the file in your default browser
start index.html

# Option B: Run a simple local HTTP server (optional)
npx serve .
# or
python -m http.server 8080
```

### Running Automated Tests
The repository includes a comprehensive 28-suite automated test harness verifying all randomization logic, SQF formatting, mod safeguards, and headless DOM controllers:
```bash
node test.js
```

---

## 📁 Repository Structure

```text
├── index.html         # Main single-page web application
├── styles.css         # Tactical dark HUD styling, responsive grids, animations
├── app.js             # Core loadout engine, repositories, serializers, and UI controllers
├── test.js            # Automated test suite (28 test suites, 34,000+ assertions)
├── assets/            # High-resolution weapon photographs and UI icons
├── scratch/           # Build & data extraction scripts
├── .gitignore         # Git ignore rules
└── README.md          # Project documentation
```

---

## 🛡️ License

MIT License — Feel free to use, modify, and integrate into your Arma 3 unit operations or scenario development.
