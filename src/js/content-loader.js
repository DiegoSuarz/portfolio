const CONTENT_PATHS = {
  profile: "data/profile.json",
  experience: "data/experience.json",
  projects: "data/projects.json",
  skills: "data/skills.json",
  education: "data/education.json",
  certifications: "data/certifications.json",
  cv: "data/cv.json"
};

async function fetchJson(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Unable to load ${path} (${response.status})`);
  }

  return response.json();
}

function formatProfile(profile) {
  return [
    `# ${profile.name}`,
    "",
    profile.headline,
    "",
    profile.summary,
    "",
    "## Focus Areas",
    ...profile.focusAreas.map(area => `- ${area}`)
  ].join("\n");
}

function formatExperience(entries) {
  const sections = entries.map(entry => {
    const period = `${entry.startDate} - ${entry.current ? "Present" : entry.endDate}`;
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
    `${entry.startDate} - ${entry.endDate}`,
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

export async function loadPortfolioFiles() {
  const keys = Object.keys(CONTENT_PATHS);
  const values = await Promise.all(keys.map(key => fetchJson(CONTENT_PATHS[key])));
  const content = Object.fromEntries(keys.map((key, index) => [key, values[index]]));

  return {
    "about.md": {
      type: "markdown",
      content: formatProfile(content.profile)
    },
    "experience.md": {
      type: "markdown",
      content: formatExperience(content.experience.experience)
    },
    "projects.json": {
      type: "json",
      content: JSON.stringify(content.projects, null, 2)
    },
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
