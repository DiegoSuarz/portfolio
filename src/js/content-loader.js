const CONTENT_PATHS = {
  profile: "data/profile.json",
  experience: "data/experience.json",
  projects: "data/projects.json",
  skills: "data/skills.json",
  education: "data/education.json",
  certifications: "data/certifications.json",
  cv: "data/cv.json"
};

const CONTENT_VERSION = "m5-readme-preview-1";

function formatPythonList(items, indent = "        ") {
  if (!items.length) return "[]";
  return `[\n${items.map(item => `${indent}${JSON.stringify(item)},`).join("\n")}\n${indent.slice(0, -4)}]`;
}

function formatSkillsPython(model) {
  const evidenceClass = {
    Project: "ProjectEvidence",
    Experience: "ExperienceEvidence",
    Credentials: "CredentialEvidence"
  };
  const categories = model.categories.map(category => [
    `    ${JSON.stringify(category.id)}: [`,
    ...category.items.map(skill => `        ${JSON.stringify(skill.name)},`),
    "    ],"
  ].join("\n"));
  const evidence = model.evidence.map(item => [
    `    ${evidenceClass[item.type]}(`,
    `        name=${JSON.stringify(item.name)},`,
    `        file=${JSON.stringify(item.file)},`,
    `        skills=${formatPythonList(item.skills, "            ")},`,
    "    ),"
  ].join("\n"));

  return [
    "from portfolio_ui import render_skill_groups",
    "from portfolio_evidence import ProjectEvidence, ExperienceEvidence, CredentialEvidence",
    "",
    "",
    "SKILLS = {",
    ...categories,
    "}",
    "",
    "EVIDENCE = [",
    ...evidence,
    "]",
    "",
    "render_skill_groups(SKILLS, evidence=EVIDENCE)"
  ].join("\n");
}

function sqlString(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function formatCertificationsSql(model) {
  const certifications = model.certifications.map(certification =>
    `    (${[
      certification.id,
      certification.name,
      certification.issuer,
      certification.priority,
      certification.credentialUrl
    ].map(sqlString).join(", ")})`
  );
  const focusAreas = model.certifications.flatMap(certification =>
    certification.focusAreas.map((focusArea, index) =>
      `    (${sqlString(certification.id)}, ${index + 1}, ${sqlString(focusArea)})`
    )
  );

  return [
    "CREATE TABLE certifications (",
    "    certification_id VARCHAR(120) PRIMARY KEY,",
    "    certification_name VARCHAR(200) NOT NULL,",
    "    issuer VARCHAR(100) NOT NULL,",
    "    relevance_priority VARCHAR(20) NOT NULL,",
    "    credential_url VARCHAR(500) NOT NULL",
    ");",
    "",
    "CREATE TABLE certification_focus_areas (",
    "    certification_id VARCHAR(120) NOT NULL,",
    "    display_order INTEGER NOT NULL,",
    "    focus_area VARCHAR(160) NOT NULL,",
    "    PRIMARY KEY (certification_id, display_order),",
    "    FOREIGN KEY (certification_id) REFERENCES certifications(certification_id)",
    ");",
    "",
    "INSERT INTO certifications (",
    "    certification_id, certification_name, issuer, relevance_priority, credential_url",
    ") VALUES",
    `${certifications.join(",\n")};`,
    "",
    "INSERT INTO certification_focus_areas (",
    "    certification_id, display_order, focus_area",
    ") VALUES",
    `${focusAreas.join(",\n")};`
  ].join("\n");
}

async function fetchJson(path) {
  const response = await fetch(`${path}?v=${CONTENT_VERSION}`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Unable to load ${path} (${response.status})`);
  }

  return response.json();
}

function formatProjectStatus(status) {
  return status
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatProjectLinks(links) {
  const labels = {
    repository: "Repository",
    documentation: "Documentation",
    demo: "Live demo"
  };

  return Object.entries(links)
    .filter(([, url]) => url)
    .map(([kind, url]) => `- [${labels[kind]}](${url})`);
}

function formatProjectCaseStudy(project) {
  return [
    `# ${project.name}`,
    "",
    `Status: ${formatProjectStatus(project.status)}`,
    "",
    "## Overview",
    project.summary,
    "",
    "## Engineering Problem",
    project.problem,
    "",
    "## Current Architecture",
    ...project.architecture.current.map(component => `- ${component}`),
    "",
    "## Planned Evolution",
    ...project.architecture.planned.map(component => `- ${component}`),
    "",
    "## Implemented Scope",
    ...project.highlights.map(highlight => `- ${highlight}`),
    "",
    "## Technologies in Current Scope",
    ...project.technologies.map(technology => `- ${technology}`),
    "",
    "## Explore",
    ...formatProjectLinks(project.links)
  ].join("\n");
}

function formatRepositoryReadme(content) {
  const projectNames = content.projects.projects.map(project => `- ${project.name}`).join("\n");
  return [
    `# ${content.profile.name} — Data Engineering Portfolio`,
    "",
    `Portfolio profesional de **${content.profile.headline}** diseñado como un workspace inspirado en Visual Studio Code.`,
    "",
    "## Acerca del repositorio",
    "",
    "Este repositorio presenta experiencia, proyectos, habilidades, educación y credenciales mediante contenido estructurado y una interfaz estática desplegable en GitHub Pages.",
    "",
    "## Contenido principal",
    "",
    "- Perfil y experiencia profesional",
    "- Casos de estudio de Data Engineering",
    "- Skills priorizadas con evidencia",
    "- Educación y credenciales verificables",
    "- Contacto profesional y CV público",
    "",
    "## Proyectos destacados",
    "",
    projectNames,
    "",
    "## Explorar",
    "",
    "Usa el Explorer, el buscador o la terminal interactiva. Por ejemplo:",
    "",
    "```text",
    "projects/overview.json",
    "skills.py",
    "contact.json",
    "```",
    "",
    `Repositorio mantenido por [DiegoSuarz](${content.profile.links.github}).`
  ].join("\n");
}

export async function loadPortfolioFiles() {
  const keys = Object.keys(CONTENT_PATHS);
  const values = await Promise.all(keys.map(key => fetchJson(CONTENT_PATHS[key])));
  const content = Object.fromEntries(keys.map((key, index) => [key, values[index]]));
  const aboutModel = {
    profile: content.profile,
    projectCount: content.projects.projects.length,
    certificationCount: content.certifications.certifications.length
  };
  const experienceModel = {
    experience: [...content.experience.experience].sort((first, second) => second.startDate.localeCompare(first.startDate))
  };
  const projectOverviewModel = {
    projectCount: content.projects.projects.length,
    inProgressCount: content.projects.projects.filter(project => project.status === "in-progress").length,
    projects: [...content.projects.projects].sort((first, second) => Number(second.featured) - Number(first.featured))
  };
  const adventureWorksModel = {
    project: content.projects.projects.find(project => project.id === "adventureworks-edw")
  };
  const ecommerceModel = {
    project: content.projects.projects.find(project => project.id === "ecommerce-data-engineering-platform")
  };
  const skillsModel = {
    categories: content.skills.categories,
    evidence: [
      { type: "Project", name: "AdventureWorks Enterprise Data Warehouse", file: "projects/adventureworks-edw.json", skills: ["SQL", "ETL / ELT", "Data Warehousing", "Dimensional Modeling", "SQL Server", "T-SQL"] },
      { type: "Project", name: "E-Commerce Data Engineering Platform", file: "projects/ecommerce-data-engineering-platform.json", skills: ["MySQL", "Docker"] },
      { type: "Experience", name: "Universidad Tecnológica del Perú", file: "experience.json", skills: ["Python"] },
      { type: "Credentials", name: "Professional Certifications", file: "certifications.sql", skills: ["SQL", "ETL / ELT", "Data Warehousing", "SQL Server", "T-SQL", "Apache Airflow"] }
    ]
  };
  const contactModel = {
    profile: {
      name: content.profile.name,
      headline: content.profile.headline,
      location: content.profile.location,
      email: content.profile.email,
      links: content.profile.links
    },
    cv: content.cv.cv
  };
  const repositoryReadme = formatRepositoryReadme(content);

  return {
    "README.md": {
      type: "markdown",
      content: repositoryReadme,
      defaultView: "code"
    },
    "about.json": {
      type: "json",
      content: JSON.stringify(aboutModel, null, 2),
      preview: aboutModel
    },
    "experience.json": {
      type: "json",
      content: JSON.stringify(experienceModel, null, 2),
      preview: experienceModel
    },
    "projects/overview.json": {
      type: "json",
      content: JSON.stringify(projectOverviewModel, null, 2),
      preview: projectOverviewModel
    },
    "projects/adventureworks-edw.json": {
      type: "json",
      content: JSON.stringify(adventureWorksModel, null, 2),
      preview: adventureWorksModel
    },
    "projects/ecommerce-data-engineering-platform.json": {
      type: "json",
      content: JSON.stringify(ecommerceModel, null, 2),
      preview: ecommerceModel
    },
    ...Object.fromEntries(content.projects.projects.filter(project => !["adventureworks-edw", "ecommerce-data-engineering-platform"].includes(project.id)).map(project => [
      `projects/${project.id}.md`,
      {
        type: "markdown",
        content: formatProjectCaseStudy(project)
      }
    ])),
    "skills.py": {
      type: "python",
      content: formatSkillsPython(skillsModel),
      preview: skillsModel
    },
    "education.json": {
      type: "json",
      content: JSON.stringify(content.education, null, 2),
      preview: content.education
    },
    "certifications.sql": {
      type: "sql",
      content: formatCertificationsSql(content.certifications),
      preview: content.certifications
    },
    "contact.json": {
      type: "json",
      content: JSON.stringify(contactModel, null, 2),
      preview: contactModel
    },
    "cv.docx": {
      type: "download",
      downloadPath: content.cv.cv.downloadPath
    }
  };
}
