# VS Code–Inspired Data Engineering Portfolio

Professional portfolio for **Diego Suarez**, designed as a Visual Studio Code–inspired interface and focused on showcasing Data Engineering projects, technical capabilities, engineering decisions, and professional growth.

The application is intentionally built with **HTML, CSS, and Vanilla JavaScript** and deployed as a static site through GitHub Pages.

## Live Portfolio

https://diegosuarz.github.io/portfolio/

## Project Status

**Active development — pre-1.0**

The project is being rebuilt incrementally from an earlier prototype using a documented architecture, structured content models, short-lived branches, Pull Requests, and milestone-based releases.

Current milestone: **Recruiter Visual Experience**.

## Goals

- Present Data Engineering projects in a clear and differentiated way.
- Keep professional content independent from UI and application logic.
- Demonstrate maintainable software engineering practices in a small static application.
- Provide a scalable foundation for project case studies, an interactive terminal, architecture diagrams, CV access, and professional contact information.
- Maintain compatibility with GitHub Pages without requiring a backend.

## Tech Stack

- **HTML5** — application structure
- **CSS3** — VS Code-inspired interface and layout
- **JavaScript (Vanilla)** — application behavior and state
- **JSON** — structured portfolio content
- **Git / GitHub** — version control and collaboration workflow
- **GitHub Pages** — static deployment

## Architecture

The portfolio follows a lightweight layered architecture:

```text
Presentation Layer
        |
        v
Application Layer
        |
        v
Data / Content Layer

+ Assets
+ Documentation
```

The architecture intentionally avoids unnecessary abstractions and external frameworks. New modules are introduced only when they have a concrete responsibility.

Detailed architecture documentation is available in [`docs/architecture.md`](docs/architecture.md).

The structured content contract is documented in [`docs/content-model.md`](docs/content-model.md).

## Current Project Structure

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
|-- docs/
|   |-- architecture.md
|   `-- content-model.md
|
|-- src/
|   |-- css/
|   |   `-- style.css
|   `-- js/
|       |-- app.js
|       |-- commands.js
|       |-- content-loader.js
|       |-- menu-bar.js
|       |-- panel-tabs.js
|       `-- terminal.js
|
|-- CONTRIBUTING.md
|-- index.html
`-- README.md
```

The application loads the professional content domains at startup and maps them to virtual files in the Explorer. The public CV is exposed as a downloadable asset instead of duplicating its content in application code.

## Content Model

Professional information is stored independently from application code.

Current domains:

```text
profile.json        -> professional identity and public contact
experience.json     -> professional experience
projects.json       -> Data Engineering project catalog
skills.json         -> prioritized technical capabilities
education.json      -> formal education
certifications.json -> curated professional credentials
cv.json             -> public CV asset metadata
```

## Project Showcase

The Explorer exposes a dedicated `projects/` directory with an overview and one Markdown case study per featured project. Each case study separates current implementation from planned evolution and provides verified public links.

Current featured projects:

- **AdventureWorks Enterprise Data Warehouse**
- **E-Commerce Data Engineering Platform**

Projects under active development are explicitly represented as such rather than presented as completed work. Case-study content is generated from `data/projects.json`, keeping presentation separate from factual project data.

## Interactive Terminal

The terminal provides a keyboard-first way to navigate the same virtual files exposed in the Explorer.

```text
help                 List supported commands
ls [path]            List virtual files
open <path>          Open a virtual file
projects             Open the project showcase
contact              Open professional contact details
cv                   Download the public CV
clear                Clear terminal output
```

Command history is available with Arrow Up and Arrow Down for the current page session. The terminal uses a closed command dispatcher and cannot execute arbitrary JavaScript, operating-system commands or external requests.

Detailed command behavior is documented in [`docs/terminal.md`](docs/terminal.md).

## Development Workflow

`main` represents the stable portfolio version.

Development is performed through short-lived branches such as:

```text
feature/*
fix/*
refactor/*
docs/*
chore/*
```

Changes are integrated through Pull Requests, with **Squash and Merge** as the preferred merge strategy.

Commit messages follow Conventional Commit style where practical.

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the complete workflow and Definition of Done.

## Running Locally

Because the application loads JSON content with `fetch()`, it should be served through a local HTTP server instead of opening `index.html` directly with the `file://` protocol.

One simple option with Python is:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

No package installation or build step is currently required.

## Roadmap

The project follows milestone-based development:

```text
v0.1.0  Portfolio Foundation
v0.2.0  Professional Content
v0.3.0  Project Showcase
v0.4.0  Interactive Terminal
v0.5.0  Recruiter Visual Experience
v0.9.0  Production Readiness
v1.0.0  Production Portfolio
```

Version numbers are roadmap targets and are created as releases only after the corresponding milestone is completed and validated.

The Recruiter Visual Experience milestone improves information hierarchy and readability through short visual iterations. On mobile, the Explorer behaves as an overlay controlled from the Activity Bar so professional content retains the available reading width.

Its VS Code-inspired workspace now includes a searchable Command Palette (`Ctrl+Shift+P`), a centered Command Center, active-file breadcrumbs, descriptive Activity Bar tooltips, a richer status bar and keyboard-accessible panel resizing on desktop. These controls provide real navigation and layout behavior rather than decorative imitation.

The About file opens as a recruiter-oriented professional overview with direct portfolio actions, concise focus areas, a prioritized core stack and evidence counts derived from the project and certification collections. Its `Code` view exposes the exact structured model behind that preview with the same folding, syntax, breadcrumbs and minimap behavior used by Skills.

Experience follows the same `Preview | Code` contract through `experience.json`. Its default timeline orders roles by recency, calculates display periods and durations from structured dates, and separates factual contributions from transferable Data Engineering relevance.

The project catalogue is exposed as `projects/overview.json`. Preview derives project and status counts, emphasizes implemented evidence and current architecture, and keeps planned evolution visually distinct. Code exposes the identical overview model, while project-specific files remain the detailed case studies.

The flagship AdventureWorks case study is exposed as `projects/adventureworks-edw.json`. Its preview organizes the current architecture and documented implementation into dimensional modeling, ETL reliability, historical tracking and observability, while planned work remains explicitly separated. Code exposes the same project object without adding unverified technical claims.

The E-Commerce case study follows the same contract through `projects/ecommerce-data-engineering-platform.json`. Its preview focuses on the implemented MySQL operational source, reproducible Docker environment, repeatable initialization and documented sample data. Future pipeline, warehouse, orchestration, analytics and processing modules remain explicitly labeled as planned evolution.

JSON portfolio files open by default in a responsive `Preview` that presents the factual data as readable cards and tags, including `skills.json`. The technical `Code` view remains available with type-aware syntax colors, indentation guides, foldable objects and arrays, structural breadcrumbs, word wrapping and a minimap.

## Engineering Principles

- Separation of concerns
- Low coupling
- Clear module ownership
- Content-driven design
- Progressive enhancement
- Maintainability over unnecessary abstraction
- Static deployment compatibility
- Factual and verifiable professional content

## Documentation

- [`docs/architecture.md`](docs/architecture.md) — architecture, layers, module boundaries, and evolution strategy
- [`docs/content-model.md`](docs/content-model.md) — structured portfolio data contracts
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — Git/GitHub workflow, commit conventions, PR expectations, and releases

## Contact

- GitHub: https://github.com/DiegoSuarz
- LinkedIn: https://www.linkedin.com/in/diegosuarezinocente/
- Email: diego.suarez.dev@outlook.com
- Portfolio: https://diegosuarz.github.io/portfolio/

## License

This repository currently contains a personal portfolio project. A formal open-source license has not yet been assigned.
