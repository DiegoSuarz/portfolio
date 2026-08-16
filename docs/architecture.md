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

Explorer items and open tabs derive decorative icons from each virtual file extension. Markdown, JSON, text and Word assets retain distinct visual treatments, while accessible names continue to expose only the file or folder name.

Scrollable interface surfaces share a thin dark scrollbar treatment so tabs, Explorer, editor and terminal remain visually consistent across supported browsers.

The Explorer button in the Activity Bar toggles the panel at every viewport size. At mobile widths, the Explorer is hidden by default and becomes an overlay instead of reducing the editor width. Opening a file closes the mobile overlay, while Escape closes it and returns focus to its trigger. A closed Explorer is removed from keyboard navigation so it cannot trap focus outside the visible interface.

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
|       |-- about-viewer.js
|       |-- adventureworks-viewer.js
|       |-- command-palette.js
|       |-- commands.js
|       |-- certifications-viewer.js
|       |-- contact-viewer.js
|       |-- content-loader.js
|       |-- education-viewer.js
|       |-- experience-viewer.js
|       |-- json-viewer.js
|       |-- layout-resizer.js
|       |-- markdown-viewer.js
|       |-- menu-bar.js
|       |-- panel-tabs.js
|       |-- projects-overview-viewer.js
|       |-- skills-viewer.js
|       `-- terminal.js
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

### about-viewer.js

Owns the recruiter-oriented About preview. It receives profile content and derived portfolio counts from the application layer, creates all content through text-safe DOM APIs and exposes only predefined navigation actions. Project and credential metrics are calculated from their source collections rather than maintained as duplicated profile claims. The paired Code view delegates that same model to `json-viewer.js`, allowing the preview content and derived counts to be inspected without maintaining a second representation.

### adventureworks-viewer.js

Owns the shared project case-study preview for AdventureWorks and E-Commerce. It presents only the current architecture, technologies, highlights and links already present in each project model. Project-specific presentation labels organize documented highlights without adding capabilities beyond their source statements. Planned evolution is visually and semantically separated from implemented scope, and each paired Code view delegates the identical project object to `json-viewer.js`.

### experience-viewer.js

Owns the recruiter-oriented experience timeline. It receives experience entries already ordered by the content layer, derives human-readable periods and durations from structured dates, and keeps factual contributions visually separate from `dataEngineeringRelevance`. Related-navigation controls receive predefined callbacks from `app.js`; the paired `experience.ipynb` Code view delegates the generated, valid notebook JSON to `json-viewer.js`. Its Python cell is intentionally unexecuted and contains no fabricated outputs.

### education-viewer.js

Owns the formal education preview. It derives the display period and duration from structured dates, makes completion status explicit, and keeps academic education distinct from technical credentials and project evidence. Related-navigation controls receive predefined callbacks from `app.js`, while the paired `education.yaml` Code view is generated from the identical model and displayed with YAML syntax highlighting.

### certifications-viewer.js

Owns the recruiter-oriented credentials preview. It separates primary Data Engineering credentials from supporting technical breadth using the source `priority`, presents issuer and focus areas, and opens only the public verification URL supplied by the model. The transparency note avoids equating course credentials with vendor certification exams. The paired `certifications.sql` Code view is generated from the identical collection and displayed by the editor with SQL syntax highlighting; it is not executed or stored in a database.

### contact-viewer.js

Owns the professional contact preview. It consumes a restricted public Profile projection plus reviewed CV metadata, then exposes predefined email, external-profile, CV-download and internal-navigation actions. It does not accept arbitrary HTML or publish private fields. The paired `contact.sh` Code view is generated from the identical model and displayed with shell syntax highlighting; the script remains a non-executed presentation artifact.

### markdown-viewer.js

Owns safe Markdown preview rendering for the virtual `README.md`. It creates headings, paragraphs, lists, fenced code, inline code, emphasis and HTTPS links through DOM APIs rather than injecting source HTML. Code remains the default README mode and uses the same generated Markdown string, so both representations stay synchronized.

### projects-overview-viewer.js

Owns the recruiter-oriented project catalogue. It renders derived portfolio counts, featured project cards, current architecture flows, planned evolution, implemented evidence, safe external navigation and a responsive comparison table. Current and planned scope remain visually distinct, and individual case-study navigation is delegated to predefined application callbacks. Its paired Code view delegates the identical overview model to `json-viewer.js`.

### skills-viewer.js

Owns the recruiter-oriented skills preview. It preserves source ordering as professional priority, avoids subjective proficiency meters, and groups capabilities into primary, applied, continued-development and workflow contexts. Evidence cards link each supported subset to an existing project, experience or credential file. The paired `skills.py` Code view is generated from the same categories and evidence, then displayed by the editor with Python syntax highlighting. Its imports and render call are presentation metaphors, not runtime Python integration.

### content-loader.js

Loads the structured content domains and maps them to the virtual files displayed by the VS Code-inspired interface. It owns content formatting but does not manipulate the DOM.

Project content is exposed as a virtual `projects/` directory with an overview and source-backed JSON case studies. The loader builds every preview model from `data/projects.json` and remains responsible for deciding the virtual path; the Explorer only renders that path as a hierarchy.

Markdown links are converted to anchors only after the source content is HTML-escaped and only when the URL uses HTTPS. External project links open in a separate browsing context with opener access disabled.

### terminal.js

Owns terminal input submission, text-only output, in-memory command history and history navigation. It receives a command callback from the application layer and does not know how portfolio commands are executed.

### menu-bar.js

Owns the VS Code-inspired application menus, dropdown state, outside-click dismissal and keyboard navigation. Menu items receive narrow callbacks from the application entry point so the component does not own portfolio content or application state.

### panel-tabs.js

Owns the Problems, Output, Debug Console and Terminal tab state in the bottom panel, including arrow-key navigation and ARIA selection state. The application can activate Terminal through its narrow public interface when a menu action needs terminal input.

### command-palette.js

Owns Command Palette filtering, active-option navigation, keyboard shortcuts, dismissal and command execution. The module receives a closed command catalogue from `app.js`; it does not load portfolio content or infer actions from user-entered text.

### layout-resizer.js

Owns the desktop Explorer and bottom-panel separator interactions. Pointer dragging, arrow-key increments, bounded dimensions and double-click reset update CSS custom properties without persisting device-specific layout state. Resize handles are removed from the mobile layout, where the Explorer continues to behave as an overlay.

### json-viewer.js

Owns the structured presentation of JSON virtual files. It parses the already-loaded JSON text and produces either an accessible code tree or a recruiter-friendly preview from the same source. The code view owns type-aware tokens, fold state, structural path reporting and minimap marks; display preferences such as wrapping and minimap visibility remain local to the current page session.

Every JSON virtual file opens in Preview by default, prioritizing recruiter readability. Switching to Code is an explicit per-file interaction; opening another JSON file returns to the Preview default.

The viewer never mutates or rewrites the source data. External HTTPS values in Preview are rendered as links with opener access disabled, while every other value is inserted through text nodes.

### commands.js

Owns the terminal command grammar and dispatches only the documented command set. It receives narrow callbacks for file access, navigation and terminal clearing; it cannot execute arbitrary JavaScript or operating-system commands.

### Future UI modules

Explorer, Editor, Tabs and breadcrumbs may become separate modules when their behavior grows enough to justify independent ownership. They remain in `app.js` today to avoid premature abstraction. Terminal, command-palette and resizing interactions moved to dedicated modules when their independent state and keyboard behavior justified clear ownership.

The Interactive Terminal contract is documented in [`terminal.md`](terminal.md). Its command dispatcher is a closed application interface over existing portfolio actions, not a browser shell or an arbitrary code-execution surface.

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
