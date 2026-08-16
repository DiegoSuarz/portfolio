# Portfolio Content Model

## 1. Purpose

This document defines the content contracts used by the portfolio. The goal is to keep professional information independent from presentation and application logic.

The portfolio should be content-driven: adding or updating a project, skill, or profile detail should normally require changing structured data rather than editing HTML or JavaScript UI code.

## 2. General Rules

- JSON is used for structured portfolio data.
- Field names use `camelCase`.
- Arrays are used for repeatable values such as technologies, highlights, links, and skills.
- URLs should be stored as full HTTPS URLs.
- Optional values should be omitted or set to `null`; empty strings should be avoided.
- Project status values should use a controlled vocabulary.
- Content files should contain data only, not presentation markup.

## 3. Profile Model

File: `data/profile.json`

```json
{
  "name": "string",
  "headline": "string",
  "tagline": "string",
  "location": "string",
  "summary": "string",
  "buildAreas": [
    {
      "title": "string",
      "description": "string"
    }
  ],
  "coreStack": ["string"],
  "focusAreas": ["string"],
  "email": "string",
  "links": {
    "github": "string",
    "linkedin": "string"
  }
}
```

### Responsibilities

The profile model stores identity and professional positioning information that may be reused by About, Contact, terminal commands, metadata, and other UI surfaces.

`focusAreas` contains concise professional domains that reinforce positioning without duplicating the detailed technology inventory owned by `skills.json`.

`tagline` provides a short outcome-oriented introduction for the About preview. `buildAreas` explains a small number of supported Data Engineering focus areas, while `coreStack` exposes only the most relevant tools for quick recruiter scanning. The complete prioritized capability inventory remains owned by `skills.json`.

The profile model is also the single source of truth for public contact information. Contact views should reuse `email` and `links` instead of copying those values into a separate content file. Phone numbers and other personal details should not be published unless they are deliberately added to this contract.

The virtual `contact.json` file contains a deliberately restricted Profile projection (`name`, `headline`, `location`, `email` and professional `links`) plus the public CV metadata. Preview and Code consume this identical structured model. It must not introduce availability claims, telephone numbers or private contact details that are absent from the source models.

## 4. Skills Model

File: `data/skills.json`

```json
{
  "categories": [
    {
      "id": "string",
      "name": "string",
      "items": [
        {
          "name": "string"
        }
      ]
    }
  ]
}
```

### Responsibilities

The skills model stores a curated inventory of technical capabilities that are relevant to the target Junior Data Engineer profile and supported by professional experience or active portfolio projects.

Categories and items are ordered by professional relevance. Core Data Engineering capabilities appear before supporting platforms and tools so the UI can preserve a meaningful priority without presentation-specific fields.

The current category vocabulary is:

- Core Data Engineering
- Databases & SQL
- Orchestration & Cloud
- Engineering Tooling

Skills should be concise, factual, and verifiable. Closely related tools may be grouped when listing them separately would add noise, while distinct concepts such as SQL, ETL/ELT, and dimensional modeling remain explicit because they communicate different capabilities.

Self-assessed proficiency levels are intentionally excluded. A skill should be added only when it is supported by experience, an active project, or another portfolio artifact; brief exposure alone is not enough.

The virtual `skills.json` file enriches this source model with a derived `evidence` collection. Each entry contains a source `type`, display `name`, virtual `file` and the subset of `skills` supported by that artifact. Evidence mappings are assembled by the content layer from existing portfolio projects, experience and credentials; they do not introduce proficiency scores or new technical claims into `data/skills.json`.

## 5. Experience Model

File: `data/experience.json`

```json
{
  "experience": [
    {
      "id": "string",
      "company": "string",
      "role": "string",
      "location": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM|null",
      "current": true,
      "summary": "string",
      "highlights": ["string"],
      "dataEngineeringRelevance": ["string"]
    }
  ]
}
```

### Responsibilities

The experience model stores factual employment history while making transferable skills explicit for Data Engineering positioning.

`highlights` describes actual responsibilities and contributions.

`dataEngineeringRelevance` summarizes transferable capabilities such as programming, validation, documentation, information management, troubleshooting, and process standardization. It should not be used to imply a job title or responsibility that was not actually held.

Dates are stored in machine-friendly form so the presentation layer can format them consistently.

## 6. Projects Model

File: `data/projects.json`

```json
{
  "projects": [
    {
      "id": "string",
      "name": "string",
      "shortName": "string",
      "status": "in-progress|completed|archived",
      "featured": true,
      "summary": "string",
      "problem": "string|null",
      "architecture": {
        "current": ["string"],
        "planned": ["string"]
      },
      "technologies": ["string"],
      "highlights": ["string"],
      "links": {
        "repository": "string|null",
        "documentation": "string|null",
        "demo": "string|null"
      }
    }
  ]
}
```

### Project Status Vocabulary

- `in-progress` — active development
- `completed` — stable portfolio-ready project
- `archived` — retained for historical value but no longer actively developed

### Featured Projects

`featured: true` identifies projects that should receive stronger visibility in the portfolio. The UI decides how featured content is presented; the data model only expresses the intent.

### Responsibilities

The projects model presents technical work as professional case studies rather than as a flat technology list.

`summary` states what the project is and its current scope. For work in progress, it must make that status clear instead of implying completion.

`problem` explains the engineering need addressed by the project. It describes the technical or business context without inventing measured impact.

`architecture.current` describes components that are implemented and verifiable in the public repository. `architecture.planned` describes the documented target direction. Keeping them separate prevents the showcase from presenting roadmap items as delivered capabilities.

`highlights` communicates the most relevant implementation areas. Entries for an in-progress project should use language that reflects ongoing work and must not present planned features as completed outcomes.

`technologies` lists tools that belong to the documented project scope. Technologies considered only for future use should not be included.

Project links remain `null` until the corresponding repository, documentation or demo is publicly accessible. Completed projects should include verifiable results when available; metrics must not be estimated or fabricated.

## 7. Education Model

File: `data/education.json`

```json
{
  "education": [
    {
      "id": "string",
      "institution": "string",
      "degree": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM|null",
      "completed": true
    }
  ]
}
```

The education model stores formal academic education. Dates use the same machine-friendly format as professional experience, and `completed` must reflect the actual program status.

The application exposes this model as the virtual `education.json` file. Preview derives only display values such as the formatted period and duration; Code retains the exact structured education object. Certifications and project evidence remain separate domains and must not be presented as part of the degree.

## 8. Certifications Model

File: `data/certifications.json`

```json
{
  "certifications": [
    {
      "id": "string",
      "name": "string",
      "issuer": "string",
      "priority": "primary|supporting",
      "credentialUrl": "string",
      "focusAreas": ["string"]
    }
  ]
}
```

The certifications model stores a curated selection of completed credentials that reinforce the target Data Engineering profile.

`credentialUrl` must point to a public or shareable credential. `focusAreas` summarizes the credential scope using concise, verifiable concepts rather than promotional descriptions or self-assessed proficiency.

`priority` communicates relevance to the target role rather than credential difficulty or skill level. `primary` is reserved for credentials directly focused on Data Engineering, relational databases, pipelines or data warehousing; `supporting` covers complementary architecture and distributed-processing breadth. Source order remains the display order within each priority group.

Exam preparation programs must not be presented as official vendor certifications. Overlapping introductory credentials may be omitted when a broader professional certificate already provides stronger evidence of the same capabilities.

## 9. CV Model

File: `data/cv.json`

```json
{
  "cv": {
    "title": "string",
    "language": "string",
    "format": "docx|pdf",
    "downloadPath": "string",
    "updatedDate": "YYYY-MM"
  }
}
```

The CV model describes the public résumé asset without duplicating its professional content. `downloadPath` is a repository-relative path owned by the static application, while `updatedDate` helps the UI communicate document freshness.

Only a reviewed and intentionally public copy should be referenced. The public asset may omit private contact details that remain present in a personal source document. Course completion and exam preparation must not be labeled as official vendor certification unless the corresponding certification was actually obtained.

## 10. Future Domains

Additional domains should be introduced only when their corresponding features are implemented.

This avoids speculative schema design and unnecessary files.

## 11. Data Ownership

Each content file owns one professional domain:

```text
profile.json     -> identity and professional summary
skills.json      -> technical capabilities
experience.json  -> employment history and transferable skills
projects.json    -> project portfolio
education.json   -> formal academic education
certifications.json -> curated professional credentials
cv.json          -> public résumé asset metadata
```

Application code may read these files but should not redefine their content internally.

## 12. Evolution Rules

When changing a content model:

1. Prefer backward-compatible additions when practical.
2. Document meaningful schema changes.
3. Avoid fields that exist only for visual styling.
4. Add a field only when at least one feature needs it.
5. Keep project and professional content factual and verifiable.

The content layer represents professional information; the presentation layer decides how that information is displayed.
