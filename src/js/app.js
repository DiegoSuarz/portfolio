import { loadPortfolioFiles } from "./content-loader.js?v=15";
import { createCommandDispatcher } from "./commands.js?v=3";
import { createTerminal } from "./terminal.js?v=3";
import { createMenuBar } from "./menu-bar.js?v=2";
import { createPanelTabs } from "./panel-tabs.js";
import { createLayoutResizers } from "./layout-resizer.js";
import { createCommandPalette } from "./command-palette.js?v=2";
import { createJsonViewer } from "./json-viewer.js";
import { createAboutViewer } from "./about-viewer.js?v=3";
import { createExperienceViewer } from "./experience-viewer.js?v=1";
import { createProjectsOverviewViewer } from "./projects-overview-viewer.js?v=1";
import { createProjectCaseStudyViewer } from "./adventureworks-viewer.js?v=2";
import { createSkillsViewer } from "./skills-viewer.js?v=1";
import { createEducationViewer } from "./education-viewer.js?v=1";
import { createCertificationsViewer } from "./certifications-viewer.js?v=1";
import { createContactViewer } from "./contact-viewer.js?v=1";
import { createMarkdownViewer } from "./markdown-viewer.js?v=1";

const ABOUT_FILE = "about.json";
const EXPERIENCE_FILE = "experience.json";
const PROJECTS_OVERVIEW_FILE = "projects/overview.json";
const ADVENTUREWORKS_FILE = "projects/adventureworks-edw.json";
const ECOMMERCE_FILE = "projects/ecommerce-data-engineering-platform.json";
const CASE_STUDY_FILES = new Set([ADVENTUREWORKS_FILE, ECOMMERCE_FILE]);
const SKILLS_FILE = "skills.py";
const EDUCATION_FILE = "education.json";
const CERTIFICATIONS_FILE = "certifications.json";
const CONTACT_FILE = "contact.json";
const README_FILE = "README.md";

document.addEventListener("DOMContentLoaded", async () => {
  let files = {};
  let activeFile = null;
  let desktopExplorerOpen = true;
  let jsonViewMode = "preview";
  let jsonWrap = true;
  let jsonMinimap = true;
  let aboutViewMode = "preview";
  let experienceViewMode = "preview";
  let projectsViewMode = "preview";
  let caseStudyViewMode = "preview";
  let skillsViewMode = "preview";
  let educationViewMode = "preview";
  let certificationsViewMode = "preview";
  let contactViewMode = "preview";
  let readmeViewMode = "code";

  const editor = document.getElementById("editor");
  const explorer = document.getElementById("portfolio-explorer");
  const explorerToggle = document.getElementById("explorer-toggle");
  const mobileViewport = window.matchMedia("(max-width: 600px)");
  const statusLeft = document.getElementById("status-position");
  const jsonToolbar = document.getElementById("json-toolbar");
  const aboutToolbar = document.getElementById("about-toolbar");
  const aboutCodeOptions = document.getElementById("about-code-options");
  const experienceToolbar = document.getElementById("experience-toolbar");
  const experienceCodeOptions = document.getElementById("experience-code-options");
  const projectsToolbar = document.getElementById("projects-toolbar");
  const projectsCodeOptions = document.getElementById("projects-code-options");
  const caseStudyToolbar = document.getElementById("case-study-toolbar");
  const caseStudyCodeOptions = document.getElementById("case-study-code-options");
  const skillsToolbar = document.getElementById("skills-toolbar");
  const educationToolbar = document.getElementById("education-toolbar");
  const educationCodeOptions = document.getElementById("education-code-options");
  const certificationsToolbar = document.getElementById("certifications-toolbar");
  const certificationsCodeOptions = document.getElementById("certifications-code-options");
  const contactToolbar = document.getElementById("contact-toolbar");
  const contactCodeOptions = document.getElementById("contact-code-options");
  const readmeToolbar = document.getElementById("readme-toolbar");
  const jsonViewer = createJsonViewer({
    editor,
    minimap: document.getElementById("json-minimap"),
    onPathChange: updateJsonBreadcrumb
  });
  const aboutViewer = createAboutViewer({
    editor,
    actions: {
      openProjects: () => openFile(PROJECTS_OVERVIEW_FILE),
      downloadCv: () => openFile("cv.docx"),
      openLinkedin: url => window.open(url, "_blank", "noopener,noreferrer"),
      openContact: () => openFile(CONTACT_FILE),
      openCertifications: () => openFile("certifications.json")
    }
  });
  const experienceViewer = createExperienceViewer({
    editor,
    actions: {
      openSkills: () => openFile(SKILLS_FILE),
      openProjects: () => openFile(PROJECTS_OVERVIEW_FILE),
      openContact: () => openFile(CONTACT_FILE)
    }
  });
  const projectsOverviewViewer = createProjectsOverviewViewer({
    editor,
    actions: {
      openCaseStudy: id => {
        const jsonPath = `projects/${id}.json`;
        openFile(files[jsonPath] ? jsonPath : `projects/${id}.md`);
      },
      openExternal: url => window.open(url, "_blank", "noopener,noreferrer"),
      openSkills: () => openFile(SKILLS_FILE),
      openExperience: () => openFile(EXPERIENCE_FILE),
      openContact: () => openFile(CONTACT_FILE)
    }
  });
  const projectCaseStudyViewer = createProjectCaseStudyViewer({
    editor,
    actions: {
      openExternal: url => window.open(url, "_blank", "noopener,noreferrer"),
      openOverview: () => openFile(PROJECTS_OVERVIEW_FILE),
      openNextProject: projectId => openFile(projectId === "adventureworks-edw" ? ECOMMERCE_FILE : ADVENTUREWORKS_FILE),
      openSkills: () => openFile(SKILLS_FILE),
      openContact: () => openFile(CONTACT_FILE)
    }
  });
  const skillsViewer = createSkillsViewer({
    editor,
    actions: {
      openEvidence: openFile,
      openProjects: () => openFile(PROJECTS_OVERVIEW_FILE),
      openExperience: () => openFile(EXPERIENCE_FILE),
      openCertifications: () => openFile("certifications.json"),
      openContact: () => openFile(CONTACT_FILE)
    }
  });
  const educationViewer = createEducationViewer({
    editor,
    actions: {
      openCertifications: () => openFile(CERTIFICATIONS_FILE),
      openSkills: () => openFile(SKILLS_FILE),
      openProjects: () => openFile(PROJECTS_OVERVIEW_FILE),
      openContact: () => openFile(CONTACT_FILE)
    }
  });
  const certificationsViewer = createCertificationsViewer({
    editor,
    actions: {
      openExternal: url => window.open(url, "_blank", "noopener,noreferrer"),
      openSkills: () => openFile(SKILLS_FILE),
      openProjects: () => openFile(PROJECTS_OVERVIEW_FILE),
      openEducation: () => openFile(EDUCATION_FILE),
      openContact: () => openFile(CONTACT_FILE)
    }
  });
  const contactViewer = createContactViewer({
    editor,
    actions: {
      openEmail: email => { window.location.href = `mailto:${email}`; },
      openExternal: url => window.open(url, "_blank", "noopener,noreferrer"),
      downloadCv: () => openFile("cv.docx"),
      openProjects: () => openFile(PROJECTS_OVERVIEW_FILE),
      openExperience: () => openFile(EXPERIENCE_FILE),
      openSkills: () => openFile(SKILLS_FILE)
    }
  });
  const markdownViewer = createMarkdownViewer({ editor });
  let terminalController;
  const executeTerminalCommand = createCommandDispatcher({
    getFiles: () => files,
    openFile,
    clearTerminal: () => terminalController.clear()
  });
  terminalController = createTerminal({
    form: document.getElementById("terminal-form"),
    input: document.getElementById("terminal-input"),
    output: document.getElementById("terminal-output"),
    onCommand: executeTerminalCommand
  });
  const panelTabsController = createPanelTabs({
    container: document.querySelector(".panel-tabs")
  });

  createLayoutResizers({
    sidebar: explorer,
    panel: document.getElementById("bottom-panel"),
    sidebarHandle: document.getElementById("sidebar-resizer"),
    panelHandle: document.getElementById("panel-resizer")
  });

  const paletteCommands = [
    { label: "Files: Open Professional Profile", action: () => openFile(ABOUT_FILE) },
    { label: "Files: Open Project Overview", action: () => openFile(PROJECTS_OVERVIEW_FILE) },
    { label: "Files: Open Experience", action: () => openFile(EXPERIENCE_FILE) },
    { label: "Files: Open Skills", action: () => openFile(SKILLS_FILE) },
    { label: "Files: Open Education", action: () => openFile(EDUCATION_FILE) },
    { label: "Files: Open Contact", action: () => openFile(CONTACT_FILE) },
    { label: "View: Toggle Explorer", action: toggleExplorer },
    { label: "View: Toggle Terminal", action: toggleTerminal },
    { label: "Terminal: New Terminal", action: newTerminal },
    { label: "Terminal: Show Available Commands", action: showTerminalHelp },
    { label: "Help: Open GitHub Profile", action: () => window.open("https://github.com/DiegoSuarz", "_blank", "noopener,noreferrer") }
  ];
  const commandPalette = createCommandPalette({
    dialog: document.getElementById("command-palette"),
    input: document.getElementById("command-palette-input"),
    list: document.getElementById("command-list"),
    commands: paletteCommands
  });
  document.getElementById("command-center").addEventListener("click", commandPalette.open);
  jsonToolbar.querySelectorAll("[data-json-view]").forEach(button => {
    button.addEventListener("click", () => setJsonView(button.dataset.jsonView));
  });
  aboutToolbar.querySelectorAll("[data-about-view]").forEach(button => {
    button.addEventListener("click", () => setAboutView(button.dataset.aboutView));
  });
  experienceToolbar.querySelectorAll("[data-experience-view]").forEach(button => {
    button.addEventListener("click", () => setExperienceView(button.dataset.experienceView));
  });
  projectsToolbar.querySelectorAll("[data-projects-view]").forEach(button => {
    button.addEventListener("click", () => setProjectsView(button.dataset.projectsView));
  });
  caseStudyToolbar.querySelectorAll("[data-case-study-view]").forEach(button => {
    button.addEventListener("click", () => setCaseStudyView(button.dataset.caseStudyView));
  });
  skillsToolbar.querySelectorAll("[data-skills-view]").forEach(button => {
    button.addEventListener("click", () => setSkillsView(button.dataset.skillsView));
  });
  educationToolbar.querySelectorAll("[data-education-view]").forEach(button => {
    button.addEventListener("click", () => setEducationView(button.dataset.educationView));
  });
  certificationsToolbar.querySelectorAll("[data-certifications-view]").forEach(button => {
    button.addEventListener("click", () => setCertificationsView(button.dataset.certificationsView));
  });
  contactToolbar.querySelectorAll("[data-contact-view]").forEach(button => {
    button.addEventListener("click", () => setContactView(button.dataset.contactView));
  });
  readmeToolbar.querySelectorAll("[data-readme-view]").forEach(button => {
    button.addEventListener("click", () => setReadmeView(button.dataset.readmeView));
  });
  [document.getElementById("json-wrap-toggle"), document.getElementById("about-wrap-toggle"), document.getElementById("experience-wrap-toggle"), document.getElementById("projects-wrap-toggle"), document.getElementById("case-study-wrap-toggle"), document.getElementById("education-wrap-toggle"), document.getElementById("certifications-wrap-toggle"), document.getElementById("contact-wrap-toggle")].forEach(button => button.addEventListener("click", () => {
    jsonWrap = !jsonWrap;
    syncStructuredPreferences();
    jsonViewer.setWrap(jsonWrap);
  }));
  [document.getElementById("json-minimap-toggle"), document.getElementById("about-minimap-toggle"), document.getElementById("experience-minimap-toggle"), document.getElementById("projects-minimap-toggle"), document.getElementById("case-study-minimap-toggle"), document.getElementById("education-minimap-toggle"), document.getElementById("certifications-minimap-toggle"), document.getElementById("contact-minimap-toggle")].forEach(button => button.addEventListener("click", () => {
    jsonMinimap = !jsonMinimap;
    syncStructuredPreferences();
    jsonViewer.setMinimap(jsonMinimap, activeStructuredMode());
  }));

  createMenuBar({
    container: document.getElementById("menu-bar"),
    actions: {
      openAbout: () => openFile(ABOUT_FILE),
      openProjects: () => openFile(PROJECTS_OVERVIEW_FILE),
      downloadCv: () => openFile("cv.docx"),
      focusEditor: () => editor.focus(),
      selectEditor: selectEditorContent,
      clearSelection: () => window.getSelection()?.removeAllRanges(),
      toggleExplorer,
      toggleTerminal,
      openCommandPalette: commandPalette.open,
      openExperience: () => openFile(EXPERIENCE_FILE),
      openSkills: () => openFile(SKILLS_FILE),
      openEducation: () => openFile(EDUCATION_FILE),
      openContact: () => openFile(CONTACT_FILE),
      focusTerminal,
      runTerminal: runTerminalCommand,
      newTerminal,
      clearTerminal: () => terminalController.clear(),
      showTerminalHelp,
      openGithub: () => window.open("https://github.com/DiegoSuarz", "_blank", "noopener,noreferrer"),
      openLinkedin: () => window.open("https://www.linkedin.com/in/diegosuarezinocente/", "_blank", "noopener,noreferrer")
    }
  });

  syncExplorerWithViewport();
  explorerToggle.addEventListener("click", toggleExplorer);
  document.getElementById("panel-close").addEventListener("click", hideTerminal);
  mobileViewport.addEventListener("change", syncExplorerWithViewport);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && mobileViewport.matches && explorer.classList.contains("is-open")) {
      closeMobileExplorer(true);
    }
  });

  try {
    files = await loadPortfolioFiles();
    buildExplorer();
    openFile(ABOUT_FILE);
    terminalController.write("Portfolio content loaded successfully.\nType help to list available commands.");
  } catch (error) {
    showLoadError(error);
  }

  function buildExplorer() {
    const tree = document.getElementById("file-tree");
    tree.replaceChildren();

    const root = createExplorerTree(Object.keys(files));
    renderExplorerNodes(root, tree);
  }

  function toggleExplorer() {
    if (mobileViewport.matches) {
      const shouldOpen = !explorer.classList.contains("is-open");
      explorer.classList.toggle("is-open", shouldOpen);
      explorer.inert = !shouldOpen;
      explorerToggle.setAttribute("aria-expanded", String(shouldOpen));

      if (shouldOpen) {
        explorer.querySelector("button")?.focus();
      }

      return;
    }

    desktopExplorerOpen = !desktopExplorerOpen;
    explorer.classList.toggle("is-collapsed", !desktopExplorerOpen);
    explorer.inert = !desktopExplorerOpen;
    explorerToggle.setAttribute("aria-expanded", String(desktopExplorerOpen));
    document.getElementById("sidebar-resizer").hidden = !desktopExplorerOpen;
  }

  function closeMobileExplorer(returnFocus = false) {
    explorer.classList.remove("is-open");
    explorer.inert = true;
    explorerToggle.setAttribute("aria-expanded", "false");

    if (returnFocus) {
      explorerToggle.focus();
    }
  }

  function syncExplorerWithViewport() {
    if (mobileViewport.matches) {
      closeMobileExplorer();
      return;
    }

    explorer.classList.remove("is-open");
    explorer.classList.toggle("is-collapsed", !desktopExplorerOpen);
    explorer.inert = !desktopExplorerOpen;
    explorerToggle.setAttribute("aria-expanded", String(desktopExplorerOpen));
    document.getElementById("sidebar-resizer").hidden = !desktopExplorerOpen;
  }

  function getFileType(path) {
    const extension = path.split(".").pop()?.toLowerCase();
    const types = { md: "markdown", json: "json", py: "python", txt: "text", docx: "word" };
    return types[extension] ?? "file";
  }

  function createFileIcon(path) {
    const icon = document.createElement("span");
    icon.className = "file-icon";
    icon.dataset.fileType = getFileType(path);
    icon.setAttribute("aria-hidden", "true");
    return icon;
  }

  function toggleTerminal() {
    const terminal = document.querySelector(".terminal");
    const shouldShow = terminal.classList.contains("is-hidden");
    terminal.classList.toggle("is-hidden", !shouldShow);
    document.getElementById("panel-resizer").hidden = !shouldShow;

    if (shouldShow) {
      focusTerminal();
    }
  }

  function hideTerminal() {
    document.querySelector(".terminal").classList.add("is-hidden");
    document.getElementById("panel-resizer").hidden = true;
  }

  function newTerminal() {
    terminalController.reset();
    document.getElementById("panel-resizer").hidden = false;
    focusTerminal();
  }

  function showTerminalHelp() {
    const terminal = document.querySelector(".terminal");
    const input = document.getElementById("terminal-input");
    terminal.classList.remove("is-hidden");
    document.getElementById("panel-resizer").hidden = false;
    panelTabsController.activate("terminal");
    input.value = "help";
    document.getElementById("terminal-form").requestSubmit();
    input.focus();
  }

  function focusTerminal() {
    document.querySelector(".terminal").classList.remove("is-hidden");
    document.getElementById("panel-resizer").hidden = false;
    panelTabsController.activate("terminal");
    document.getElementById("terminal-input").focus();
  }

  function runTerminalCommand() {
    focusTerminal();
    document.getElementById("terminal-form").requestSubmit();
  }

  function selectEditorContent() {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(editor);
    selection.removeAllRanges();
    selection.addRange(range);
    editor.focus();
  }

  function createExplorerTree(paths) {
    const root = {};

    paths.forEach(path => {
      const segments = path.split("/");
      let level = root;

      segments.forEach((segment, index) => {
        level[segment] ??= {
          children: {},
          path: index === segments.length - 1 ? path : null
        };
        level = level[segment].children;
      });
    });

    return root;
  }

  function renderExplorerNodes(nodes, container) {
    Object.entries(nodes).forEach(([name, node]) => {
      const item = document.createElement("li");

      if (node.path) {
        const button = document.createElement("button");
        const label = document.createElement("span");
        button.type = "button";
        button.className = "tree-item";
        button.dataset.file = node.path;
        label.className = "tree-item-label";
        label.textContent = name;
        button.setAttribute("aria-label", `Open ${node.path}`);
        button.dataset.tooltip = node.path;
        button.title = node.path;
        button.addEventListener("click", () => openFile(node.path));
        button.append(createFileIcon(node.path), label);
        item.appendChild(button);
      } else {
        const folderButton = document.createElement("button");
        const children = document.createElement("ul");
        const chevron = document.createElement("span");
        const folderIcon = document.createElement("span");
        const folderLabel = document.createElement("span");
        folderButton.type = "button";
        folderButton.className = "tree-folder-label";
        chevron.className = "tree-chevron";
        chevron.textContent = "▾";
        chevron.setAttribute("aria-hidden", "true");
        folderIcon.className = "folder-icon";
        folderIcon.setAttribute("aria-hidden", "true");
        folderLabel.className = "tree-item-label";
        folderLabel.textContent = name;
        folderButton.setAttribute("aria-expanded", "true");
        folderButton.addEventListener("click", () => {
          const expanded = folderButton.getAttribute("aria-expanded") === "true";
          folderButton.setAttribute("aria-expanded", String(!expanded));
          chevron.textContent = expanded ? "▸" : "▾";
          children.hidden = expanded;
        });
        renderExplorerNodes(node.children, children);
        folderButton.append(chevron, folderIcon, folderLabel);
        item.append(folderButton, children);
      }

      container.appendChild(item);
    });
  }

  function openFile(name) {
    const file = files[name];

    if (file.type === "download") {
      downloadFile(file.downloadPath);
      return;
    }

    activeFile = name;
    editor.className = "code";
    editor.replaceChildren();
    jsonToolbar.hidden = file.type !== "json" || name === ABOUT_FILE || name === EXPERIENCE_FILE || name === PROJECTS_OVERVIEW_FILE || name === SKILLS_FILE || name === EDUCATION_FILE || name === CERTIFICATIONS_FILE || name === CONTACT_FILE || CASE_STUDY_FILES.has(name);
    aboutToolbar.hidden = name !== ABOUT_FILE;
    experienceToolbar.hidden = name !== EXPERIENCE_FILE;
    projectsToolbar.hidden = name !== PROJECTS_OVERVIEW_FILE;
    caseStudyToolbar.hidden = !CASE_STUDY_FILES.has(name);
    skillsToolbar.hidden = name !== SKILLS_FILE;
    educationToolbar.hidden = name !== EDUCATION_FILE;
    certificationsToolbar.hidden = name !== CERTIFICATIONS_FILE;
    contactToolbar.hidden = name !== CONTACT_FILE;
    readmeToolbar.hidden = name !== README_FILE;
    document.getElementById("lines").hidden = file.type === "json" || name === ABOUT_FILE;
    document.getElementById("json-minimap").hidden = true;

    if (name === ABOUT_FILE) {
      aboutViewMode = file.preview ? "preview" : "code";
      syncAboutToolbar();
      if (file.preview) {
        aboutViewer.show(file.preview);
      } else {
        jsonViewer.show(file.content, "code");
      }
    } else if (name === EXPERIENCE_FILE) {
      experienceViewMode = file.preview ? "preview" : "code";
      syncExperienceToolbar();
      if (file.preview) experienceViewer.show(file.preview);
      else jsonViewer.show(file.content, "code");
    } else if (name === PROJECTS_OVERVIEW_FILE) {
      projectsViewMode = file.preview ? "preview" : "code";
      syncProjectsToolbar();
      if (file.preview) projectsOverviewViewer.show(file.preview);
      else jsonViewer.show(file.content, "code");
    } else if (CASE_STUDY_FILES.has(name)) {
      caseStudyViewMode = file.preview ? "preview" : "code";
      syncCaseStudyToolbar();
      if (file.preview) projectCaseStudyViewer.show(file.preview);
      else jsonViewer.show(file.content, "code");
    } else if (name === SKILLS_FILE) {
      skillsViewMode = file.preview ? "preview" : "code";
      syncSkillsToolbar();
      if (file.preview) {
        document.getElementById("lines").hidden = true;
        skillsViewer.show(file.preview);
      } else {
        editor.innerHTML = highlight(file.content, "python");
      }
    } else if (name === EDUCATION_FILE) {
      educationViewMode = file.preview ? "preview" : "code";
      syncEducationToolbar();
      if (file.preview) educationViewer.show(file.preview);
      else jsonViewer.show(file.content, "code");
    } else if (name === CERTIFICATIONS_FILE) {
      certificationsViewMode = file.preview ? "preview" : "code";
      syncCertificationsToolbar();
      if (file.preview) certificationsViewer.show(file.preview);
      else jsonViewer.show(file.content, "code");
    } else if (name === CONTACT_FILE) {
      contactViewMode = file.preview ? "preview" : "code";
      syncContactToolbar();
      if (file.preview) contactViewer.show(file.preview);
      else jsonViewer.show(file.content, "code");
    } else if (name === README_FILE) {
      readmeViewMode = file.defaultView ?? "code";
      syncReadmeToolbar();
      editor.innerHTML = highlight(file.content, "markdown");
    } else if (file.type === "json") {
      jsonViewMode = "preview";
      syncJsonToolbar();
      jsonViewer.show(file.content, jsonViewMode);
    } else {
      editor.innerHTML = highlight(file.content, file.type);
      document.getElementById("json-minimap").hidden = true;
    }
    editor.classList.toggle("is-markdown", file.type === "markdown");
    editor.classList.toggle("is-python", file.type === "python");
    document.getElementById("lang").textContent = file.type;

    if (file.type !== "json") renderLines(file.content);
    updateTabs(name);
    updateBreadcrumbs(name);
    updateActiveExplorerItem();

    if (mobileViewport.matches) {
      closeMobileExplorer();
    }
  }

  function setAboutView(mode) {
    if (activeFile !== ABOUT_FILE) return;
    if (mode === "preview" && !files[activeFile].preview) mode = "code";
    aboutViewMode = mode;
    syncAboutToolbar();
    editor.className = "code";
    editor.replaceChildren();
    if (mode === "preview") {
      document.getElementById("lines").hidden = true;
      document.getElementById("json-minimap").hidden = true;
      aboutViewer.show(files[activeFile].preview);
      document.getElementById("lang").textContent = "json";
    } else {
      if (files[activeFile].preview) {
        document.getElementById("lines").hidden = true;
        jsonViewer.show(JSON.stringify(files[activeFile].preview, null, 2), "code");
        document.getElementById("lang").textContent = "json";
      } else {
        document.getElementById("lines").hidden = true;
        jsonViewer.show(files[activeFile].content, "code");
        document.getElementById("lang").textContent = "json";
      }
    }
    updateBreadcrumbs(activeFile);
  }

  function syncAboutToolbar() {
    aboutToolbar.querySelectorAll("[data-about-view]").forEach(button => {
      const active = button.dataset.aboutView === aboutViewMode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    aboutCodeOptions.hidden = aboutViewMode !== "code";
    syncStructuredPreferences();
  }

  function setExperienceView(mode) {
    if (activeFile !== EXPERIENCE_FILE) return;
    if (mode === "preview" && !files[activeFile].preview) mode = "code";
    experienceViewMode = mode;
    syncExperienceToolbar();
    editor.className = "code";
    editor.replaceChildren();
    document.getElementById("lines").hidden = true;
    if (mode === "preview") {
      document.getElementById("json-minimap").hidden = true;
      experienceViewer.show(files[activeFile].preview);
    } else {
      jsonViewer.show(files[activeFile].content, "code");
    }
    document.getElementById("lang").textContent = "json";
    updateBreadcrumbs(activeFile);
  }

  function syncExperienceToolbar() {
    experienceToolbar.querySelectorAll("[data-experience-view]").forEach(button => {
      const active = button.dataset.experienceView === experienceViewMode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    experienceCodeOptions.hidden = experienceViewMode !== "code";
    syncStructuredPreferences();
  }

  function setProjectsView(mode) {
    if (activeFile !== PROJECTS_OVERVIEW_FILE) return;
    if (mode === "preview" && !files[activeFile].preview) mode = "code";
    projectsViewMode = mode;
    syncProjectsToolbar();
    editor.className = "code";
    editor.replaceChildren();
    document.getElementById("lines").hidden = true;
    if (mode === "preview") {
      document.getElementById("json-minimap").hidden = true;
      projectsOverviewViewer.show(files[activeFile].preview);
    } else {
      jsonViewer.show(files[activeFile].content, "code");
    }
    document.getElementById("lang").textContent = "json";
    updateBreadcrumbs(activeFile);
  }

  function syncProjectsToolbar() {
    projectsToolbar.querySelectorAll("[data-projects-view]").forEach(button => {
      const active = button.dataset.projectsView === projectsViewMode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    projectsCodeOptions.hidden = projectsViewMode !== "code";
    syncStructuredPreferences();
  }

  function setCaseStudyView(mode) {
    if (!CASE_STUDY_FILES.has(activeFile)) return;
    if (mode === "preview" && !files[activeFile].preview) mode = "code";
    caseStudyViewMode = mode;
    syncCaseStudyToolbar();
    editor.className = "code";
    editor.replaceChildren();
    document.getElementById("lines").hidden = true;
    if (mode === "preview") {
      document.getElementById("json-minimap").hidden = true;
      projectCaseStudyViewer.show(files[activeFile].preview);
    } else {
      jsonViewer.show(files[activeFile].content, "code");
    }
    document.getElementById("lang").textContent = "json";
    updateBreadcrumbs(activeFile);
  }

  function syncCaseStudyToolbar() {
    caseStudyToolbar.querySelectorAll("[data-case-study-view]").forEach(button => {
      const active = button.dataset.caseStudyView === caseStudyViewMode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    caseStudyCodeOptions.hidden = caseStudyViewMode !== "code";
    syncStructuredPreferences();
  }

  function setSkillsView(mode) {
    if (activeFile !== SKILLS_FILE) return;
    if (mode === "preview" && !files[activeFile].preview) mode = "code";
    skillsViewMode = mode;
    syncSkillsToolbar();
    editor.className = "code";
    editor.replaceChildren();
    if (mode === "preview") {
      document.getElementById("lines").hidden = true;
      document.getElementById("json-minimap").hidden = true;
      skillsViewer.show(files[activeFile].preview);
    } else {
      editor.classList.add("is-python");
      document.getElementById("lines").hidden = false;
      document.getElementById("json-minimap").hidden = true;
      editor.innerHTML = highlight(files[activeFile].content, "python");
      renderLines(files[activeFile].content);
    }
    document.getElementById("lang").textContent = "python";
    updateBreadcrumbs(activeFile);
  }

  function syncSkillsToolbar() {
    skillsToolbar.querySelectorAll("[data-skills-view]").forEach(button => {
      const active = button.dataset.skillsView === skillsViewMode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function setEducationView(mode) {
    if (activeFile !== EDUCATION_FILE) return;
    if (mode === "preview" && !files[activeFile].preview) mode = "code";
    educationViewMode = mode;
    syncEducationToolbar();
    editor.className = "code";
    editor.replaceChildren();
    document.getElementById("lines").hidden = true;
    if (mode === "preview") {
      document.getElementById("json-minimap").hidden = true;
      educationViewer.show(files[activeFile].preview);
    } else {
      jsonViewer.show(files[activeFile].content, "code");
    }
    document.getElementById("lang").textContent = "json";
    updateBreadcrumbs(activeFile);
  }

  function syncEducationToolbar() {
    educationToolbar.querySelectorAll("[data-education-view]").forEach(button => {
      const active = button.dataset.educationView === educationViewMode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    educationCodeOptions.hidden = educationViewMode !== "code";
    syncStructuredPreferences();
  }

  function setCertificationsView(mode) {
    if (activeFile !== CERTIFICATIONS_FILE) return;
    if (mode === "preview" && !files[activeFile].preview) mode = "code";
    certificationsViewMode = mode;
    syncCertificationsToolbar();
    editor.className = "code";
    editor.replaceChildren();
    document.getElementById("lines").hidden = true;
    if (mode === "preview") {
      document.getElementById("json-minimap").hidden = true;
      certificationsViewer.show(files[activeFile].preview);
    } else {
      jsonViewer.show(files[activeFile].content, "code");
    }
    document.getElementById("lang").textContent = "json";
    updateBreadcrumbs(activeFile);
  }

  function syncCertificationsToolbar() {
    certificationsToolbar.querySelectorAll("[data-certifications-view]").forEach(button => {
      const active = button.dataset.certificationsView === certificationsViewMode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    certificationsCodeOptions.hidden = certificationsViewMode !== "code";
    syncStructuredPreferences();
  }

  function setContactView(mode) {
    if (activeFile !== CONTACT_FILE) return;
    if (mode === "preview" && !files[activeFile].preview) mode = "code";
    contactViewMode = mode;
    syncContactToolbar();
    editor.className = "code";
    editor.replaceChildren();
    document.getElementById("lines").hidden = true;
    if (mode === "preview") {
      document.getElementById("json-minimap").hidden = true;
      contactViewer.show(files[activeFile].preview);
    } else {
      jsonViewer.show(files[activeFile].content, "code");
    }
    document.getElementById("lang").textContent = "json";
    updateBreadcrumbs(activeFile);
  }

  function syncContactToolbar() {
    contactToolbar.querySelectorAll("[data-contact-view]").forEach(button => {
      const active = button.dataset.contactView === contactViewMode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    contactCodeOptions.hidden = contactViewMode !== "code";
    syncStructuredPreferences();
  }

  function setReadmeView(mode) {
    if (activeFile !== README_FILE) return;
    readmeViewMode = mode;
    syncReadmeToolbar();
    editor.className = "code is-markdown";
    editor.replaceChildren();
    document.getElementById("json-minimap").hidden = true;
    if (mode === "preview") {
      document.getElementById("lines").hidden = true;
      markdownViewer.show(files[activeFile].content);
    } else {
      document.getElementById("lines").hidden = false;
      editor.innerHTML = highlight(files[activeFile].content, "markdown");
      renderLines(files[activeFile].content);
    }
    document.getElementById("lang").textContent = "markdown";
    updateBreadcrumbs(activeFile);
  }

  function syncReadmeToolbar() {
    readmeToolbar.querySelectorAll("[data-readme-view]").forEach(button => {
      const active = button.dataset.readmeView === readmeViewMode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function activeStructuredMode() {
    if (activeFile === ABOUT_FILE) return aboutViewMode;
    if (activeFile === EXPERIENCE_FILE) return experienceViewMode;
    if (activeFile === PROJECTS_OVERVIEW_FILE) return projectsViewMode;
    if (CASE_STUDY_FILES.has(activeFile)) return caseStudyViewMode;
    if (activeFile === EDUCATION_FILE) return educationViewMode;
    if (activeFile === CERTIFICATIONS_FILE) return certificationsViewMode;
    if (activeFile === CONTACT_FILE) return contactViewMode;
    return jsonViewMode;
  }

  function syncStructuredPreferences() {
    [document.getElementById("json-wrap-toggle"), document.getElementById("about-wrap-toggle"), document.getElementById("experience-wrap-toggle"), document.getElementById("projects-wrap-toggle"), document.getElementById("case-study-wrap-toggle"), document.getElementById("education-wrap-toggle"), document.getElementById("certifications-wrap-toggle"), document.getElementById("contact-wrap-toggle")].forEach(button => {
      button.classList.toggle("active", jsonWrap);
      button.setAttribute("aria-pressed", String(jsonWrap));
    });
    [document.getElementById("json-minimap-toggle"), document.getElementById("about-minimap-toggle"), document.getElementById("experience-minimap-toggle"), document.getElementById("projects-minimap-toggle"), document.getElementById("case-study-minimap-toggle"), document.getElementById("education-minimap-toggle"), document.getElementById("certifications-minimap-toggle"), document.getElementById("contact-minimap-toggle")].forEach(button => {
      button.classList.toggle("active", jsonMinimap);
      button.setAttribute("aria-pressed", String(jsonMinimap));
    });
  }

  function setJsonView(mode) {
    if (!activeFile || files[activeFile]?.type !== "json") return;
    jsonViewMode = mode;
    syncJsonToolbar();
    jsonViewer.show(files[activeFile].content, mode);
    updateBreadcrumbs(activeFile);
  }

  function syncJsonToolbar() {
    jsonToolbar.querySelectorAll("[data-json-view]").forEach(button => {
      const active = button.dataset.jsonView === jsonViewMode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    syncStructuredPreferences();
    jsonViewer.setWrap(jsonWrap);
    jsonViewer.setMinimap(jsonMinimap, jsonViewMode);
  }

  function downloadFile(path) {
    const link = document.createElement("a");
    link.href = path;
    link.download = path.split("/").pop();
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function renderLines(content) {
    const gutter = document.getElementById("lines");
    gutter.textContent = content
      .split("\n")
      .map((_, index) => index + 1)
      .join("\n");
  }

  function updateTabs(name) {
    const tabs = document.getElementById("tabs");
    let tab = document.getElementById(`tab-${name}`);

    if (!tab) {
      tab = document.createElement("div");
      tab.className = "tab";
      tab.id = `tab-${name}`;
      tab.dataset.file = name;
      tab.setAttribute("role", "presentation");

      const title = document.createElement("button");
      const titleLabel = document.createElement("span");
      title.type = "button";
      title.className = "tab-title";
      titleLabel.textContent = name.split("/").pop();
      title.setAttribute("role", "tab");
      title.setAttribute("aria-controls", "editor");
      title.setAttribute("aria-label", `Open ${name}`);
      title.addEventListener("click", () => openFile(name));
      title.append(createFileIcon(name), titleLabel);

      const close = document.createElement("button");
      close.type = "button";
      close.textContent = "×";
      close.className = "close";
      close.setAttribute("aria-label", `Close ${name}`);
      close.addEventListener("click", event => {
        event.stopPropagation();
        const wasActive = activeFile === name;
        tab.remove();

        if (wasActive && tabs.lastElementChild) {
          const fallbackTab = tabs.lastElementChild;
          openFile(fallbackTab.dataset.file);
          fallbackTab.querySelector(".tab-title").focus();
        } else if (wasActive) {
          activeFile = null;
          editor.textContent = "";
          editor.classList.remove("is-markdown");
          document.getElementById("lines").textContent = "";
          document.getElementById("lang").textContent = "Plain Text";
          document.getElementById("breadcrumbs").replaceChildren();
          updateActiveExplorerItem();
          editor.focus();
        } else {
          document.querySelector(".tab.active .tab-title")?.focus();
        }
      });

      tab.append(title, close);
      tabs.appendChild(tab);
    }

    document.querySelectorAll(".tab").forEach(item => item.classList.remove("active"));
    document.querySelectorAll(".tab-title").forEach(item => item.setAttribute("aria-selected", "false"));
    tab.classList.add("active");
    tab.querySelector(".tab-title").setAttribute("aria-selected", "true");
  }

  function updateBreadcrumbs(name) {
    const breadcrumbs = document.getElementById("breadcrumbs");
    breadcrumbs.replaceChildren();
    const segments = name.split("/");
    segments.forEach((segment, index) => {
      if (index) {
        const separator = document.createElement("span");
        separator.className = "breadcrumb-separator";
        separator.textContent = ">";
        separator.setAttribute("aria-hidden", "true");
        breadcrumbs.appendChild(separator);
      }
      const item = document.createElement("button");
      item.type = "button";
      item.className = "breadcrumb-item";
      item.textContent = segment;
      if (index === segments.length - 1) {
        item.prepend(createFileIcon(name));
        item.setAttribute("aria-current", "page");
        item.addEventListener("click", () => editor.focus());
      } else {
        item.addEventListener("click", () => {
          explorer.classList.remove("is-collapsed");
          desktopExplorerOpen = true;
          explorer.inert = false;
          explorerToggle.setAttribute("aria-expanded", "true");
          document.getElementById("sidebar-resizer").hidden = false;
          explorer.querySelector(`[data-file="${CSS.escape(name)}"]`)?.focus();
        });
      }
      breadcrumbs.appendChild(item);
    });
  }

  function updateJsonBreadcrumb(path) {
    const isStructuredView = files[activeFile]?.type === "json";
    if (!activeFile || !isStructuredView) return;
    updateBreadcrumbs(activeFile);
    const breadcrumbs = document.getElementById("breadcrumbs");
    path.forEach(segment => {
      const separator = document.createElement("span");
      separator.className = "breadcrumb-separator";
      separator.textContent = ">";
      separator.setAttribute("aria-hidden", "true");
      const item = document.createElement("span");
      item.className = "breadcrumb-structure";
      item.textContent = segment;
      breadcrumbs.append(separator, item);
    });
  }

  function updateActiveExplorerItem() {
    document.querySelectorAll(".tree-item").forEach(item => {
      const active = item.dataset.file === activeFile;
      item.classList.toggle("active", active);
      if (active) {
        item.setAttribute("aria-current", "page");
      } else {
        item.removeAttribute("aria-current");
      }
    });
  }

  function escapeHtml(content) {
    return content
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function highlight(content, type) {
    const safeContent = escapeHtml(content);

    if (type === "json") {
      return safeContent
        .replace(/(&quot;.*?&quot;)\s*:/g, '<span class="key">$1</span>:')
        .replace(/:\s*(&quot;.*?&quot;)/g, ': <span class="string">$1</span>');
    }

    if (type === "markdown") {
      return safeContent
        .replace(
          /\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g,
          '<a class="editor-link" href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
        )
        .replace(/^(#{1,2} .*)$/gm, '<span class="md-title">$1</span>')
        .replace(/^(- .*)$/gm, '<span class="comment">$1</span>');
    }

    if (type === "python") {
      return content.split("\n").map(line => {
        if (line.trimStart().startsWith("#")) {
          return `<span class="python-comment">${escapeHtml(line)}</span>`;
        }

        const strings = [];
        let safeLine = line.replace(/"(?:\\.|[^"\\])*"/g, value => {
          strings.push(escapeHtml(value));
          return `\u0000${strings.length - 1}\u0000`;
        });
        safeLine = escapeHtml(safeLine);
        safeLine = safeLine
          .replace(/\b(from|import|as|True|False|None)\b/g, '<span class="python-keyword">$1</span>')
          .replace(/^(\s*)([A-Z][A-Z0-9_]*)(\s*=)/, '$1<span class="python-constant">$2</span>$3')
          .replace(/\b(\d+)\b/g, '<span class="python-number">$1</span>');
        return safeLine.replace(/\u0000(\d+)\u0000/g, (_, index) => `<span class="python-string">${strings[Number(index)]}</span>`);
      }).join("\n");
    }

    return safeContent;
  }

  function showLoadError(error) {
    const message = `Unable to load professional content. ${error.message}`;
    editor.textContent = message;
    terminalController.clear();
    terminalController.write(`Error: ${message}`);
    document.getElementById("lang").textContent = "Error";
    renderLines(message);
  }

  editor.addEventListener("click", updateCursor);
  editor.addEventListener("keyup", updateCursor);

  function updateCursor() {
    const selection = window.getSelection();
    const position = selection?.focusOffset ?? 0;
    const before = editor.innerText.slice(0, position);
    const line = before.split("\n").length;
    const column = before.split("\n").pop().length + 1;

    statusLeft.textContent = `Ln ${line}, Col ${column}`;
  }
});
