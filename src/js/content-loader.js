const CONTENT_PATHS = {
  profile: "data/profile.json",
  experience: "data/experience.json",
  projects: "data/projects.json",
  skills: "data/skills.json",
  education: "data/education.json",
  certifications: "data/certifications.json",
  cv: "data/cv.json"
};

const CONTENT_VERSION = "m5-about-preview-2";

async function fetchJson(path) {
  const response = await fetch(`${path}?v=${CONTENT_VERSION}`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Unable to load ${path} (${response.status})`);
  }

  return response.json();
}

function formatDate(value) {
  const [year, month] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

function formatProfile(profile) {
  const buildAreas = profile.buildAreas ?? [];
  const coreStack = profile.coreStack ?? [];
  const focusAreas = profile.focusAreas ?? [];

  return [
    `# ${profile.name}`,
    "",
    profile.headline,
    profile.location,
    profile.tagline ?? "",
    "",
    profile.summary,
    "",
    "## What I Build",
    ...buildAreas.map(area => `- ${area.title}: ${area.description}`),
    "",
    "## Core Stack",
    coreStack.join(" · "),
    "",
    "## Focus Areas",
    ...focusAreas.map(area => `- ${area}`)
  ].join("\n");
}

function formatExperience(entries) {
  const sections = entries.map(entry => {
    const startDate = formatDate(entry.startDate);
    const endDate = entry.current ? "Present" : formatDate(entry.endDate);
    const period = `${startDate} - ${endDate}`;
    return [
      `## ${entry.role} | ${entry.company}`,
      `${entry.location} | ${period}`,
      "",
      entry.summary,
      "",
      ...entry.highlights.map(highlight => `- ${highlight}`)
    ].join("\n");
  });

  return ["# Professional Experience", "", ...sections].join("\n\n");
}

function formatEducation(entries) {
  const sections = entries.map(entry => [
    `## ${entry.degree}`,
    entry.institution,
    `${formatDate(entry.startDate)} - ${formatDate(entry.endDate)}`,
    entry.completed ? "Completed" : "In progress"
  ].join("\n"));

  return ["# Education", "", ...sections].join("\n\n");
}

function formatContact(profile) {
  return [
    `Email: ${profile.email}`,
    `GitHub: ${profile.links.github}`,
    `LinkedIn: ${profile.links.linkedin}`
  ].join("\n");
}

function formatProjectOverview(projects) {
  return [
    "# Project Showcase",
    "",
    "Selected Data Engineering projects presented from their current, verifiable scope.",
    "",
    ...projects.flatMap(project => [
      `## ${project.name}`,
      `Status: ${formatProjectStatus(project.status)}`,
      project.summary,
      `File: projects/${project.id}.md`,
      ""
    ])
  ].join("\n").trimEnd();
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

  return {
    "about.md": {
      type: "markdown",
      content: formatProfile(content.profile),
      preview: {
        profile: content.profile,
        projectCount: content.projects.projects.length,
        certificationCount: content.certifications.certifications.length
      }
    },
    "experience.md": {
      type: "markdown",
      content: formatExperience(content.experience.experience)
    },
    "projects/overview.md": {
      type: "markdown",
      content: formatProjectOverview(content.projects.projects)
    },
    ...Object.fromEntries(content.projects.projects.map(project => [
      `projects/${project.id}.md`,
      {
        type: "markdown",
        content: formatProjectCaseStudy(project)
      }
    ])),
    "skills.json": {
      type: "json",
      content: JSON.stringify(content.skills, null, 2)
    },
    "education.md": {
      type: "markdown",
      content: formatEducation(content.education.education)
    },
    "certifications.json": {
      type: "json",
      content: JSON.stringify(content.certifications, null, 2)
    },
    "contact.txt": {
      type: "text",
      content: formatContact(content.profile)
    },
    "cv.docx": {
      type: "download",
      downloadPath: content.cv.cv.downloadPath
    }
  };
}
