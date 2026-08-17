const PRESENTATION = {
  "adventureworks-edw": {
    scope: [
      ["Dimensional Modeling", "Structured staging and dimensional layers for core business entities."],
      ["ETL Reliability", "Full-load procedures with transaction control and error handling."],
      ["Historical Tracking", "Slowly Changing Dimension Type 2 for historical product data."],
      ["Observability", "Execution auditing and logging for traceable pipeline runs."]
    ],
    architecture: {
      "AdventureWorks OLTP source": "Normalized operational source data.",
      "Staging layer": "Controlled preparation layer between source and warehouse.",
      "Dimensional data warehouse": "Analytics-ready dimensional structures.",
      "ETL audit framework": "Execution history and load traceability."
    }
  },
  "ecommerce-data-engineering-platform": {
    scope: [
      ["Operational Data Model", "Relational structures for the platform's core e-commerce transactions."],
      ["Containerized Environment", "A portable MySQL source environment for consistent local development."],
      ["Repeatable Initialization", "Scripts that initialize the database and provision access consistently."],
      ["Documented Sample Data", "A documented operational dataset that supports the current source module."]
    ],
    architecture: {
      "Containerized MySQL OLTP source": "Relational source for current e-commerce operations.",
      "Repeatable database initialization": "Scripted database setup and access provisioning.",
      "Documented sample data": "Traceable sample records for the operational source."
    }
  }
};

export function createProjectCaseStudyViewer({ editor, actions }) {
  function show(model) {
    const project = model.project;
    const presentation = PRESENTATION[project.id];
    editor.replaceChildren();
    editor.classList.add("case-study-preview");

    const header = element("header", "case-study-header");
    const badges = element("div", "case-study-badges");
    badges.append(element("span", "case-study-status", formatStatus(project.status)));
    project.technologies.forEach(item => badges.appendChild(element("span", "case-study-technology", item)));
    const actionsBar = element("div", "case-study-actions");
    actionsBar.append(
      actionButton("Repository", () => actions.openExternal(project.links.repository), true),
      actionButton("Documentation", () => actions.openExternal(project.links.documentation)),
      actionButton("Back to Project Overview", actions.openOverview)
    );
    header.append(badges, element("h1", "", project.name), element("p", "case-study-summary", project.summary), actionsBar);

    const problem = section("Engineering Problem", project.problem, "case-study-problem");

    const architecture = section("Current Architecture", "Only components already represented in the current project scope are shown.", "case-study-section");
    const flow = element("ol", "case-study-flow");
    project.architecture.current.forEach(component => {
      const item = element("li", "case-study-component");
      item.append(element("strong", "", component), element("span", "", presentation?.architecture[component] ?? "Current architecture component."));
      flow.appendChild(item);
    });
    architecture.appendChild(flow);

    const implemented = section("Implemented Engineering Scope", "Repository-backed capabilities currently represented by the project data.", "case-study-section");
    const scopeGrid = element("div", "case-study-scope-grid");
    project.highlights.forEach((highlight, index) => {
      const [title, description] = presentation?.scope[index] ?? ["Implemented Scope", highlight];
      const card = element("article", "case-study-scope-card");
      card.append(element("span", "case-study-scope-index", String(index + 1).padStart(2, "0")), element("h3", "", title), element("p", "", description), element("small", "", highlight));
      scopeGrid.appendChild(card);
    });
    implemented.appendChild(scopeGrid);

    const planned = section("Planned Evolution", "Planned items are intentionally separated from the implemented project scope.", "case-study-section case-study-planned");
    const plannedList = element("ul", "case-study-planned-list");
    project.architecture.planned.forEach(item => plannedList.appendChild(element("li", "", item)));
    planned.appendChild(plannedList);

    const related = element("nav", "case-study-related");
    related.setAttribute("aria-label", "Related project navigation");
    related.append(actionButton("Back to Project Overview", actions.openOverview), actionButton(project.id === "adventureworks-edw" ? "Next Project" : "Previous Project", () => actions.openNextProject(project.id)), actionButton("View Skills", actions.openSkills), actionButton("Contact Me", actions.openContact));

    editor.append(header, problem, architecture, implemented, planned, related);
  }

  function section(title, description, className) {
    const container = element("section", className);
    container.append(element("h2", "", title), element("p", "case-study-section-intro", description));
    return container;
  }

  function actionButton(label, action, primary = false) {
    const button = element("button", `case-study-action${primary ? " case-study-action--primary" : ""}`, label);
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
