# Portfolio Architecture

## 1. Purpose

This document defines the initial architecture for Diego Suarez's professional Data Engineering portfolio.

The project is intentionally built with HTML, CSS and Vanilla JavaScript and deployed through GitHub Pages. The architecture should remain simple enough for a static website while providing clear separation of responsibilities as the portfolio grows.

## 2. Architectural Principles

The project follows these principles:

- Separation of concerns
- Low coupling between UI, application logic and content
- Content-driven design
- Progressive enhancement
- Maintainability over unnecessary abstraction
- No framework dependency unless a future requirement justifies it
- GitHub Pages compatibility

## 3. Architecture Overview

```text
Browser
  |
  v
index.html
  |
  +--> Presentation Layer
  |      Activity Bar
  |      Explorer
  |      Tabs
  |      Editor
  |      Terminal
  |      Status Bar
  |
  +--> Application Layer
  |      App bootstrap
  |      State
  |      Explorer controller
  |      Editor controller
  |      Tabs controller
  |      Terminal controller
  |      Content renderer
  |
  +--> Data / Content Layer
         Profile
         Skills
         Projects
         Experience
         Certifications
         Education
         CV metadata
         Contact (owned by Profile)
```

## 4. Layers

### 4.1 Presentation Layer

Responsible only for visual structure and user interaction surfaces.

Expected modules/components:

- Activity Bar
- Explorer
- Tabs
- Editor
- Terminal
- Status Bar

The presentation layer should not contain professional portfolio data directly.

Interactive Explorer and tab controls use native buttons so keyboard behavior is available without custom key handling. Active files and tabs expose their state through ARIA attributes, while the editor announces file changes as a polite live region.

Markdown content wraps within the editor viewport for case-study readability. Code-like JSON content retains horizontal scrolling, and decorative cursor animation respects the user's reduced-motion preference.

### 4.2 Application Layer

Responsible for application behavior and coordination between UI components and portfolio content.

Initial responsibilities:

- Bootstrap the application
- Load portfolio content
- Maintain active file/tab state
- Handle Explorer navigation
- Render file content
- Coordinate Editor and Status Bar
- Handle Terminal commands in a later milestone

Application modules should have one primary responsibility whenever practical.

### 4.3 Data / Content Layer

Responsible for portfolio information independently from presentation logic.

Current content domains:

- Profile
- Projects
- Skills
- Experience
- Certifications
- Education
- CV metadata

Public contact information is owned by Profile so email and professional links are not duplicated across content files.

Structured data should use JSON where appropriate. Longer narrative content may use Markdown or plain text when that better represents the VS Code-inspired interface.

### 4.4 Assets and Documentation

Assets contain static visual resources such as images, icons and architecture diagrams.

Documentation records project architecture and significant engineering decisions.

## 5. Current Source Structure

```text
portfolio/
|
|-- assets/
|   |-- cv/
|   `-- icons.svg
|
|-- data/
|   |-- certifications.json
|   |-- cv.json
|   |-- education.json
|   |-- experience.json
|   |-- profile.json
|   |-- projects.json
|   `-- skills.json
|
|-- src/
|   |-- css/
|   |   `-- style.css
|   |
|   `-- js/
|       |-- app.js
|       `-- content-loader.js
|
|-- docs/
|   |-- architecture.md
|   `-- content-model.md
|
|-- CONTRIBUTING.md
|-- index.html
`-- README.md
```

New directories and modules should continue to be introduced only when they have a concrete responsibility; empty structures should not be added to imitate a larger application.

## 6. Module Boundaries

### app.js

Application entry point. Initializes the interface, coordinates application state, and manages Explorer, Editor and Tabs interactions.

The Explorer derives its hierarchy from slash-delimited virtual file paths. Folders are presentation state rather than content domains: they can be expanded or collapsed, while leaf nodes retain the complete virtual path used to open a file.

### content-loader.js

Loads the structured content domains and maps them to the virtual files displayed by the VS Code-inspired interface. It owns content formatting but does not manipulate the DOM.

Project content is exposed as a virtual `projects/` directory with an overview and one source-backed Markdown case study per project. The loader formats each case study from structured JSON and remains responsible for deciding the virtual path; the Explorer only renders that path as a hierarchy.

Markdown links are converted to anchors only after the source content is HTML-escaped and only when the URL uses HTTPS. External project links open in a separate browsing context with opener access disabled.

### Future UI modules

Explorer, Editor, Tabs and Terminal may become separate modules when their behavior grows enough to justify independent ownership. They remain in `app.js` today to avoid premature abstraction.

### Content renderer

Content rendering and syntax presentation currently remain in `app.js`. They should become a separate module only if the rendering logic becomes sufficiently complex.

## 7. State Management

The portfolio does not currently justify an external state-management library.

Initial state should remain lightweight and may include:

```text
activeFile
openTabs
loadedContent
```

State ownership should be explicit and shared global mutable state should be minimized.

## 8. Dependency Strategy

The initial production version should remain dependency-free where practical.

External libraries or frameworks should only be introduced when they solve a concrete requirement that cannot be reasonably handled by the current architecture.

## 9. Deployment Constraint

The architecture must remain compatible with static deployment through GitHub Pages.

This means the application should not require:

- A backend server
- Server-side rendering
- Runtime database connections
- Secrets exposed in client-side code

## 10. Evolution Strategy

The architecture will evolve incrementally.

Before adding a new abstraction, ask:

1. Does it solve a current problem?
2. Does it reduce coupling or complexity?
3. Will another module reuse it?
4. Is the added complexity justified?

If the answer is no, prefer the simpler implementation.
