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
    "skills.json",
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
      { type: "Credentials", name: "Professional Certifications", file: "certifications.json", skills: ["SQL", "ETL / ELT", "Data Warehousing", "SQL Server", "T-SQL", "Apache Airflow"] }
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
    "skills.json": {
      type: "json",
      content: JSON.stringify(skillsModel, null, 2),
      preview: skillsModel
    },
    "education.json": {
      type: "json",
      content: JSON.stringify(content.education, null, 2),
      preview: content.education
    },
    "certifications.json": {
      type: "json",
      content: JSON.stringify(content.certifications, null, 2),
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
