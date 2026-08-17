const CATEGORY_CONTEXT = {
  "core-data-engineering": ["Primary capabilities", "Foundational capabilities for building reliable, analytics-ready data workflows."],
  databases: ["Applied platforms", "Relational database technologies represented in current portfolio work."],
  "orchestration-cloud": ["Continued development", "Workflow and cloud capabilities supported by structured learning and active development."],
  tooling: ["Engineering workflow", "Tools used to make development reproducible, documented and version controlled."]
};

export function createSkillsViewer({ editor, actions }) {
  function show(model) {
    editor.replaceChildren();
    editor.classList.add("skills-preview");

    const skillCount = model.categories.reduce((total, category) => total + category.items.length, 0);
    const header = element("header", "skills-header");
    header.append(
      element("p", "skills-eyebrow", "Technical Capabilities"),
      element("h1", "", "Skills with supporting evidence"),
      element("p", "skills-intro", "A prioritized view of the capabilities most relevant to a Junior Data Engineer role. The catalogue avoids self-assessed proficiency scores and connects skills to portfolio, experience or credential evidence."),
      metric(`${skillCount}`, "curated skills"),
      metric(`${model.categories.length}`, "priority groups")
    );

    const categories = element("section", "skills-categories");
    categories.setAttribute("aria-label", "Prioritized skill groups");
    model.categories.forEach((category, index) => {
      const [label, description] = CATEGORY_CONTEXT[category.id] ?? ["Supporting capabilities", "Relevant capabilities supported by portfolio evidence."];
      const card = element("article", "skills-category");
      const heading = element("div", "skills-category-heading");
      heading.append(element("span", "skills-index", String(index + 1).padStart(2, "0")), element("p", "skills-priority", label), element("h2", "", category.name), element("p", "skills-description", description));
      const list = element("ul", "skills-list");
      category.items.forEach(item => {
        const entry = element("li", "skills-item");
        entry.append(element("span", "skills-check", "✓"), element("span", "", item.name));
        list.appendChild(entry);
      });
      card.append(heading, list);
      categories.appendChild(card);
    });

    const evidence = element("section", "skills-evidence");
    evidence.append(element("h2", "", "Where the evidence appears"), element("p", "skills-section-intro", "These links show where groups of capabilities are demonstrated or supported."));
    const evidenceGrid = element("div", "skills-evidence-grid");
    model.evidence.forEach(source => {
      const card = element("article", "skills-evidence-card");
      card.append(element("p", "skills-evidence-type", source.type), element("h3", "", source.name), tags(source.skills), actionButton("Open evidence", () => actions.openEvidence(source.file)));
      evidenceGrid.appendChild(card);
    });
    evidence.appendChild(evidenceGrid);

    const related = element("nav", "skills-related");
    related.setAttribute("aria-label", "Related portfolio navigation");
    related.append(actionButton("View Projects", actions.openProjects, true), actionButton("View Experience", actions.openExperience), actionButton("View Certifications", actions.openCertifications), actionButton("Contact Me", actions.openContact));
    editor.append(header, categories, evidence, related);
  }

  function metric(value, label) {
    const item = element("span", "skills-metric");
    item.append(element("strong", "", value), element("span", "", label));
    return item;
  }

  function tags(items) {
    const list = element("div", "skills-evidence-tags");
    items.forEach(item => list.appendChild(element("span", "", item)));
    return list;
  }

  function actionButton(label, action, primary = false) {
    const button = element("button", `skills-action${primary ? " skills-action--primary" : ""}`, label);
    button.type = "button";
    button.addEventListener("click", action);
    return button;
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  return { show };
}
