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
  "email": "string",
  "links": {
    "github": "string",
    "linkedin": "string"
  }
}
```

### Responsibilities

The profile model stores identity and professional positioning information that may be reused by About, Contact, terminal commands, metadata, and other UI surfaces.

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
          "name": "string",
          "level": "string|null"
        }
      ]
    }
  ]
}
```

### Skill Categories

Initial categories may include:

- Languages
- Databases
- Data Engineering
- Cloud
- Orchestration
- DevOps / Tooling
- Analytics

The `level` property is optional because the portfolio should avoid arbitrary self-rating unless the label provides useful professional context.

## 5. Projects Model

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

## 6. Future Domains

The following domains are planned but should be introduced only when their corresponding features are implemented:

- `experience.json`
- `certifications.json`
- `education.json`

This avoids speculative schema design and unnecessary files.

## 7. Data Ownership

Each content file owns one professional domain:

```text
profile.json   -> identity and professional summary
skills.json    -> technical capabilities
projects.json  -> project portfolio
```

Application code may read these files but should not redefine their content internally.

## 8. Evolution Rules

When changing a content model:

1. Prefer backward-compatible additions when practical.
2. Document meaningful schema changes.
3. Avoid fields that exist only for visual styling.
4. Add a field only when at least one feature needs it.
5. Keep project content factual and verifiable.

The content layer represents professional information; the presentation layer decides how that information is displayed.
