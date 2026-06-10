
## Introducción

**Hand Music Controller** es una aplicación web experimental que transforma los movimientos de las manos en una experiencia musical interactiva. Utilizando la cámara del dispositivo, el sistema detecta gestos, posiciones de los dedos y movimientos en tiempo real para controlar sonidos electrónicos, ritmos y efectos visuales directamente desde el navegador.

El objetivo principal del proyecto es explorar una nueva forma de interacción entre el cuerpo humano, la música y la tecnología web. En lugar de depender de instrumentos físicos o controladores MIDI tradicionales, esta aplicación convierte las manos en una interfaz musical intuitiva, visual y accesible.

El proyecto combina conceptos de **computer vision**, **hand tracking**, **Web Audio**, **música generativa** y **animaciones visuales basadas en nodos**. Esto permite crear una experiencia creativa donde los gestos del usuario pueden modificar parámetros musicales como ritmo, tono, intensidad, efectos o secuencias de sonido.

**Hand Music Controller** está pensado como un proyecto de código abierto para desarrolladores, músicos, diseñadores interactivos y personas interesadas en experimentar con nuevas formas de creación musical mediante tecnologías web modernas.

---

## Introduction

**Hand Music Controller** is an experimental web application that turns hand movements into an interactive musical experience. Using the device camera, the system detects gestures, finger positions, and real-time movements to control electronic sounds, rhythms, and visual effects directly from the browser.

The main goal of the project is to explore a new way of interaction between the human body, music, and web technology. Instead of relying on physical instruments or traditional MIDI controllers, this application turns the hands into an intuitive, visual, and accessible musical interface.

The project combines concepts from **computer vision**, **hand tracking**, **Web Audio**, **generative music**, and **node-based visual animations**. This makes it possible to create a creative experience where the user's gestures can modify musical parameters such as rhythm, pitch, intensity, effects, or sound sequences.

**Hand Music Controller** is designed as an open-source project for developers, musicians, interactive designers, and anyone interested in experimenting with new forms of musical creation using modern web technologies.
```

# Hand Music Controller

React application for creating music with hand gestures using MediaPipe Tasks Vision, Tone.js, React Three Fiber, and Zustand.

Aplicacion React para crear musica con gestos de manos usando MediaPipe Tasks Vision, Tone.js, React Three Fiber y Zustand.

Live demo / Demo en vivo: https://hand-music-controller.vercel.app/

## English

### Overview

Hand Music Controller turns webcam hand tracking into an expressive music instrument.

The left hand controls beats and groove. The right hand controls chords, harmony, and expression. Hand height, openness, tilt, roll, and horizontal position change the music and visuals in real time.

### Live Demo

Try the deployed version here:

https://hand-music-controller.vercel.app/

### Features

- Hand tracking with MediaPipe Tasks Vision.
- Two-hand control.
- Tone.js audio engine.
- Gesture-controlled beats, pads, chords, bass, and arpeggios.
- Selectable music presets.
- Selectable visual presets.
- Reactive 3D visuals with React Three Fiber.
- Global state managed with Zustand.
- Optional custom samples from `src/audio`.
- Live music information panel.

### Tech Stack

- React
- TypeScript
- Vite
- MediaPipe Tasks Vision
- Tone.js
- Three.js
- React Three Fiber
- Drei
- Zustand
- Lucide React
- Tailwind CSS

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open the local URL shown by Vite, usually:

```bash
http://localhost:5173
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Preview Production Build

```bash
npm run preview
```

### How To Use

1. Open the app in the browser.
2. Select a music preset from `Pista / genero`.
3. Select a visual preset from `Visual`.
4. Press `Iniciar rave`.
5. Allow camera access.
6. Move both hands in front of the camera.

### Hand Controls

#### Left Hand

The left hand controls rhythm:

- Thumb: kick
- Index: hi-hat
- Middle: snare
- Ring: clap
- Pinky: percussion / texture

Left-hand height, openness, and horizontal position affect beat density, accents, and rhythmic variation.

#### Right Hand

The right hand controls harmony:

- Index: first chord in the selected preset
- Middle: second chord
- Ring: third chord
- Pinky: fourth chord
- Thumb: color / expression

Right-hand height, openness, tilt, and roll affect voicings, chord extensions, inversions, pads, and arpeggios.

### Music Presets

Music presets are defined in:

```txt
src/domain/musicPresets.ts
```

Each preset can define:

- name
- BPM
- scale
- chord progression
- mood
- texture
- sample search hints

Current presets include:

- `Joji Noir`
- `Rave Bloom`
- `Lo-fi Pulse`

### Visual Presets

Visual presets are defined in:

```txt
src/domain/visualPresets.ts
```

Each visual preset controls:

- canvas background color
- light colors
- neon grid intensity
- laser intensity
- particle density
- pulse scale
- overall visual mood

Current visual presets include:

- `Neon Club`
- `Joji Noir`
- `Infrared`
- `Aurora`

### Custom Samples

You can add custom audio files inside:

```txt
src/audio
```

Supported formats:

```txt
.mp3
.wav
.ogg
```

The app automatically searches for samples by filename based on the selected preset.

Example filenames:

```txt
src/audio/joji-kick.wav
src/audio/joji-hat.wav
src/audio/joji-snare.wav
src/audio/rave-kick.wav
src/audio/rave-clap.wav
src/audio/lofi-perc.wav
```

If a sample is not found, the app falls back to the Tone.js synth engine.

### Project Structure

```txt
src/
  audio/
  components/
    ControlBank.tsx
    GenreSelector.tsx
    HandTracker.tsx
    MusicInfoPanel.tsx
    RaveNodeScene.tsx
    StatusPill.tsx
    VisualSelector.tsx
  domain/
    musicPresets.ts
    raveControls.ts
    visualPresets.ts
  hooks/
    useRaveEngine.ts
  store/
    useRaveStore.ts
  utils/
    audioSamples.ts
    handTracking.ts
    harmony.ts
  App.tsx
  App.css
```

### Notes

- Camera permission is required.
- Browser audio requires a user gesture, so sound starts from the main button.
- MediaPipe loads the hand landmarker model from the official remote asset.
- Zustand filters small hand-signal changes to reduce unnecessary UI updates while preserving meaningful gesture changes.

## Espanol

### Descripcion

Hand Music Controller convierte la deteccion de manos por camara en un instrumento musical expresivo.

La mano izquierda controla beats y groove. La mano derecha controla acordes, armonia y expresion. La altura, apertura, inclinacion, giro y posicion horizontal de las manos modifican la musica y las visuales en tiempo real.

### Demo en vivo

Prueba la version desplegada aqui:

https://hand-music-controller.vercel.app/

### Funcionalidades

- Deteccion de manos con MediaPipe Tasks Vision.
- Control con dos manos.
- Motor de audio con Tone.js.
- Beats, pads, acordes, bajo y arpegios controlados por gestos.
- Presets musicales seleccionables.
- Presets visuales seleccionables.
- Visuales 3D reactivas con React Three Fiber.
- Estado global gestionado con Zustand.
- Soporte opcional para samples personalizados desde `src/audio`.
- Panel de informacion musical en vivo.

### Stack

- React
- TypeScript
- Vite
- MediaPipe Tasks Vision
- Tone.js
- Three.js
- React Three Fiber
- Drei
- Zustand
- Lucide React
- Tailwind CSS

### Instalacion

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

Abre la URL local que muestra Vite, normalmente:

```bash
http://localhost:5173
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Preview del build

```bash
npm run preview
```

### Como usar

1. Abre la aplicacion en el navegador.
2. Selecciona una pista o genero en `Pista / genero`.
3. Selecciona un preset visual en `Visual`.
4. Presiona `Iniciar rave`.
5. Acepta el permiso de camara.
6. Usa ambas manos frente a la camara.

### Controles por mano

#### Mano izquierda

La mano izquierda controla el ritmo:

- Pulgar: kick
- Indice: hi-hat
- Medio: snare
- Anular: clap
- Menique: percusion / textura

La altura, apertura y posicion horizontal de la mano izquierda afectan densidad, acentos y variacion ritmica.

#### Mano derecha

La mano derecha controla la armonia:

- Indice: primer acorde del preset seleccionado
- Medio: segundo acorde
- Anular: tercer acorde
- Menique: cuarto acorde
- Pulgar: color / expresion

La altura, apertura, inclinacion y giro de la mano derecha afectan voicings, extensiones, inversiones, pads y arpegios.

### Presets musicales

Los presets musicales estan definidos en:

```txt
src/domain/musicPresets.ts
```

Cada preset puede definir:

- nombre
- BPM
- escala
- progresion armonica
- mood
- textura
- pistas para buscar samples

Presets actuales:

- `Joji Noir`
- `Rave Bloom`
- `Lo-fi Pulse`

### Presets visuales

Los presets visuales estan definidos en:

```txt
src/domain/visualPresets.ts
```

Cada preset visual controla:

- color de fondo del canvas
- colores de luces
- intensidad del grid neon
- intensidad de lasers
- densidad de particulas
- escala del pulso
- mood visual general

Presets actuales:

- `Neon Club`
- `Joji Noir`
- `Infrared`
- `Aurora`

### Samples personalizados

Puedes agregar archivos de audio dentro de:

```txt
src/audio
```

Formatos soportados:

```txt
.mp3
.wav
.ogg
```

La aplicacion busca samples automaticamente por nombre segun el preset seleccionado.

Ejemplos:

```txt
src/audio/joji-kick.wav
src/audio/joji-hat.wav
src/audio/joji-snare.wav
src/audio/rave-kick.wav
src/audio/rave-clap.wav
src/audio/lofi-perc.wav
```

Si un sample no existe, la aplicacion usa el motor sintetico de Tone.js como fallback.

### Estructura del proyecto

```txt
src/
  audio/
  components/
    ControlBank.tsx
    GenreSelector.tsx
    HandTracker.tsx
    MusicInfoPanel.tsx
    RaveNodeScene.tsx
    StatusPill.tsx
    VisualSelector.tsx
  domain/
    musicPresets.ts
    raveControls.ts
    visualPresets.ts
  hooks/
    useRaveEngine.ts
  store/
    useRaveStore.ts
  utils/
    audioSamples.ts
    handTracking.ts
    harmony.ts
  App.tsx
  App.css
```

### Notas

- Se requiere permiso de camara.
- El audio del navegador requiere una interaccion del usuario, por eso se activa desde el boton principal.
- MediaPipe carga el modelo de hand landmarker desde el recurso remoto oficial.
- Zustand filtra cambios pequenos en la senal de manos para reducir renders innecesarios sin perder gestos importantes.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```
