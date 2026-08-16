export function createAboutViewer({ editor, actions }) {
  function show(model) {
    const buildAreas = model.profile.buildAreas ?? [];
    const coreStack = model.profile.coreStack ?? [];
    editor.replaceChildren();
    editor.classList.add("about-preview");

    const hero = element("section", "about-hero");
    const eyebrow = element("p", "about-eyebrow", "Hello, I am");
    const name = element("h1", "about-name", model.profile.name);
    const role = element("p", "about-role", model.profile.headline);
    const location = element("p", "about-location", `⌖ ${model.profile.location}`);
    const tagline = element("p", "about-tagline", model.profile.tagline ?? model.profile.headline);
    const summary = element("p", "about-summary", model.profile.summary);
    const actionsBar = element("div", "about-actions");

    actionsBar.append(
      actionButton("View Projects", "primary", actions.openProjects),
      actionButton("Download CV", "secondary", actions.downloadCv),
      actionButton("LinkedIn", "secondary", () => actions.openLinkedin(model.profile.links.linkedin)),
      actionButton("Contact Me", "secondary", actions.openContact)
    );
    hero.append(eyebrow, name, role, location, tagline, summary, actionsBar);

    const buildSection = section("What I Build", "Professional focus supported by current projects and continued technical development.");
    const buildGrid = element("div", "about-build-grid");
    buildAreas.forEach((area, index) => {
      const card = element("article", "about-build-card");
      card.append(
        element("span", "about-card-index", String(index + 1).padStart(2, "0")),
        element("h3", "", area.title),
        element("p", "", area.description)
      );
      buildGrid.appendChild(card);
    });
    buildSection.appendChild(buildGrid);

    const stackSection = section("Core Stack", "A concise view of the tools most relevant to my target Data Engineering role.");
    const stack = element("div", "about-stack");
    coreStack.forEach(item => stack.appendChild(element("span", "about-stack-item", item)));
    stackSection.appendChild(stack);

    const evidenceSection = section("Featured Evidence", "Explore the work and learning records behind this profile.");
    const evidenceGrid = element("div", "about-evidence-grid");
    evidenceGrid.append(
      metric(model.projectCount, "Data Engineering projects", actions.openProjects),
      metric(model.certificationCount, "Curated credentials", actions.openCertifications)
    );
    evidenceSection.appendChild(evidenceGrid);

    editor.append(hero, buildSection, stackSection, evidenceSection);
  }

  function section(title, description) {
    const container = element("section", "about-section");
    container.append(element("h2", "", title), element("p", "about-section-intro", description));
    return container;
  }

  function metric(value, label, action) {
    const button = element("button", "about-metric");
    button.type = "button";
    button.append(element("strong", "", String(value)), element("span", "", label), element("span", "about-metric-arrow", "→"));
    button.addEventListener("click", action);
    return button;
  }

  function actionButton(label, style, action) {
    const button = element("button", `about-action about-action--${style}`, label);
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
