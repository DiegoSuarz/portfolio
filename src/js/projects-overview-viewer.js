export function createProjectsOverviewViewer({ editor, actions }) {
  function show(model) {
    editor.replaceChildren();
    editor.classList.add("projects-preview");

    const header = element("header", "projects-header");
    const metrics = element("div", "projects-metrics");
    metrics.append(metric(model.projectCount, "Data Engineering projects"), metric(model.inProgressCount, "Currently in progress"));
    header.append(
      element("p", "projects-eyebrow", "Selected Technical Work"),
      element("h1", "", "Project Showcase"),
      element("p", "projects-intro", "Data Engineering projects presented from their current, verifiable scope, with planned work clearly separated."),
      metrics
    );

    const grid = element("div", "projects-grid");
    model.projects.forEach(project => grid.appendChild(createProjectCard(project)));

    const comparison = createComparison(model.projects);
    const related = element("nav", "projects-related");
    related.setAttribute("aria-label", "Related portfolio sections");
    related.append(actionButton("View Skills", actions.openSkills), actionButton("View Experience", actions.openExperience), actionButton("Contact Me", actions.openContact));

    editor.append(header, grid, comparison, related);
  }

  function createProjectCard(project) {
    const card = element("article", "project-overview-card");
    const header = element("header", "project-card-header");
    const titleGroup = element("div", "");
    titleGroup.append(element("span", "project-status", formatStatus(project.status)), element("h2", "", project.name));
    const technologyList = element("div", "project-technologies");
    project.technologies.forEach(item => technologyList.appendChild(element("span", "", item)));
    header.append(titleGroup, technologyList);

    const problem = element("section", "project-problem");
    problem.append(element("h3", "", "Engineering Problem"), element("p", "", project.problem));

    const architecture = element("section", "project-scope-grid");
    const current = element("div", "project-current-scope");
    current.appendChild(element("h3", "", "Current Architecture"));
    const flow = element("ol", "project-flow");
    project.architecture.current.forEach(item => flow.appendChild(element("li", "", item)));
    current.appendChild(flow);
    const planned = element("div", "project-planned-scope");
    planned.appendChild(element("h3", "", "Planned Evolution"));
    const plannedList = element("ul", "project-planned-list");
    project.architecture.planned.forEach(item => plannedList.appendChild(element("li", "", item)));
    planned.appendChild(plannedList);
    architecture.append(current, planned);

    const evidence = element("section", "project-evidence");
    evidence.appendChild(element("h3", "", "Implemented Evidence"));
    const evidenceList = element("ul", "");
    project.highlights.forEach(item => evidenceList.appendChild(element("li", "", item)));
    evidence.appendChild(evidenceList);

    const links = element("div", "project-actions");
    links.appendChild(actionButton("Open Case Study", () => actions.openCaseStudy(project.id), true));
    if (project.links.repository) links.appendChild(actionButton("Repository", () => actions.openExternal(project.links.repository)));
    if (project.links.documentation) links.appendChild(actionButton("Documentation", () => actions.openExternal(project.links.documentation)));
    if (project.links.demo) links.appendChild(actionButton("Live Demo", () => actions.openExternal(project.links.demo)));

    card.append(header, element("p", "project-summary", project.summary), problem, architecture, evidence, links);
    return card;
  }

  function createComparison(projects) {
    const section = element("section", "projects-comparison");
    section.append(element("h2", "", "Quick Comparison"), element("p", "projects-comparison-intro", "A concise view of each project's currently implemented focus."));
    const wrapper = element("div", "projects-table-wrap");
    const table = document.createElement("table");
    const head = document.createElement("thead");
    const headRow = document.createElement("tr");
    ["Project", "Current Focus", "Technologies", "Status"].forEach(label => headRow.appendChild(element("th", "", label)));
    head.appendChild(headRow);
    const body = document.createElement("tbody");
    projects.forEach(project => {
      const row = document.createElement("tr");
      row.append(element("td", "", project.shortName), element("td", "", project.architecture.current.join(" → ")), element("td", "", project.technologies.join(", ")), element("td", "", formatStatus(project.status)));
      body.appendChild(row);
    });
    table.append(head, body);
    wrapper.appendChild(table);
    section.appendChild(wrapper);
    return section;
  }

  function metric(value, label) {
    const item = element("div", "projects-metric");
    item.append(element("strong", "", String(value)), element("span", "", label));
    return item;
  }

  function actionButton(label, action, primary = false) {
    const button = element("button", `project-action${primary ? " project-action--primary" : ""}`, label);
    button.type = "button";
    button.addEventListener("click", action);
    return button;
  }

  function formatStatus(status) {
    return status.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  return { show };
}
