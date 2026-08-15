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
  "location": "string",
  "summary": "string",
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

## 7. Future Domains

The following domains are planned but should be introduced only when their corresponding features are implemented:

- `certifications.json`
- `education.json`

This avoids speculative schema design and unnecessary files.

## 8. Data Ownership

Each content file owns one professional domain:

```text
profile.json     -> identity and professional summary
skills.json      -> technical capabilities
experience.json  -> employment history and transferable skills
projects.json    -> project portfolio
```

Application code may read these files but should not redefine their content internally.

## 9. Evolution Rules

When changing a content model:

1. Prefer backward-compatible additions when practical.
2. Document meaningful schema changes.
3. Avoid fields that exist only for visual styling.
4. Add a field only when at least one feature needs it.
5. Keep project and professional content factual and verifiable.

The content layer represents professional information; the presentation layer decides how that information is displayed.
