const CONTENT_PATHS = {
  profile: "data/profile.json",
  experience: "data/experience.json",
  projects: "data/projects.json",
  skills: "data/skills.json",
  education: "data/education.json",
  certifications: "data/certifications.json",
  cv: "data/cv.json"
};

const CONTENT_VERSION = "m5-contact-preview-1";

async function fetchJson(path) {
  const response = await fetch(`${path}?v=${CONTENT_VERSION}`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Unable to load ${path} (${response.status})`);
  }

  return response.json();
}

function formatContact(profile) {
  return [
    `Email: ${profile.email}`,
    `GitHub: ${profile.links.github}`,
    `LinkedIn: ${profile.links.linkedin}`
  ].join("\n");
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

  return {
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
    "contact.txt": {
      type: "text",
      content: formatContact(content.profile),
      preview: { profile: content.profile, cv: content.cv.cv }
    },
    "cv.docx": {
      type: "download",
      downloadPath: content.cv.cv.downloadPath
    }
  };
}
