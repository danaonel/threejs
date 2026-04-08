# Three.js House Scene

An interactive 3D house scene built with **Three.js**, **TypeScript**, and **Vite**. Features a fully shaded house model with a switchable textured A-frame roof, dat.GUI controls, orbit camera, and real-time performance stats.

## Preview

> Orbit, pan, and zoom around a 3D house with a day-sky background, dynamic shadows, and selectable roof shingle textures.

[https://danaonel.github.io/threejs/]https://danaonel.github.io/threejs/

## Features

- **3D House Model** — Box walls, A-frame triangular prism roof with overhang, gable end walls, door, and roof ridge accent
- **Textured Roof** — Three swappable shingle textures (Pewter Gray, Vinyl Round, Antique Slate) loaded via `TextureLoader` with caching
- **Realistic Lighting** — Directional sun light with `PCFSoftShadowMap` shadows + ambient fill light
- **Scene Atmosphere** — Sky-blue background (`0x87ceeb`) with distance fog
- **Interactive Controls** — `OrbitControls` with damping for smooth camera navigation
- **dat.GUI Panel** — Switch roof textures, toggle wireframe on roof/walls, adjust wall colour at runtime
- **Performance Stats** — `Stats.js` overlay (FPS / ms / MB)
- **Responsive** — Canvas resizes to fit the browser window

## Tech Stack

| Tool | Version |
|---|---|
| [Three.js](https://threejs.org/) | ^0.183 |
| TypeScript | ~5.9 |
| Vite | ^8.0 |
| dat.GUI | ^0.7.9 |

## Project Structure

```
threejs/
├── index.html          # Entry HTML, sets page title
├── package.json
├── tsconfig.json
├── src/
│   ├── main.ts         # Scene setup, meshes, lighting, GUI, animation loop
│   └── style.css
└── public/
    └── img/            # Roof shingle texture images
```

## Getting Started

### Prerequisites

- Node.js ≥ 18

### Install & Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Controls

| Action | Control |
|---|---|
| Orbit | Left-click + drag |
| Pan | Right-click + drag |
| Zoom | Scroll wheel |
| Roof texture | dat.GUI → Roof → shinglesA / B / C |
| Wireframe | dat.GUI → Roof or Walls → wireframe |
| Wall colour | dat.GUI → Walls → color |
