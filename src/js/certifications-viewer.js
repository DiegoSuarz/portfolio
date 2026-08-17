export function createCertificationsViewer({ editor, actions }) {
  function show(model) {
    editor.replaceChildren();
    editor.classList.add("certifications-preview");

    const primary = model.certifications.filter(item => item.priority === "primary");
    const supporting = model.certifications.filter(item => item.priority === "supporting");
    const issuerCount = new Set(model.certifications.map(item => item.issuer)).size;
    const header = element("header", "certifications-header");
    header.append(
      element("p", "certifications-eyebrow", "Verified Learning"),
      element("h1", "", "Professional Credentials"),
      element("p", "certifications-intro", "A curated set of completed credentials that supports the target Data Engineering profile. Priority reflects relevance to the role, not a self-assessed level of expertise."),
      metrics([[model.certifications.length, "completed credentials"], [issuerCount, "recognized issuers"]])
    );

    const primarySection = section("Primary Data Engineering Credentials", "The most directly relevant credentials for data pipelines, relational databases and analytical data platforms.");
    primarySection.appendChild(cards(primary, 0, true));
    const supportingSection = section("Supporting Technical Breadth", "Complementary learning in modern data architecture and distributed processing.");
    supportingSection.appendChild(cards(supporting, primary.length, false));

    const note = element("aside", "certifications-note");
    note.append(element("h2", "", "Credential transparency"), element("p", "", "Every item links to its public completion record. Course and professional-certificate credentials are presented by their published names and are not described as vendor certification exams."));

    const related = element("nav", "certifications-related");
    related.setAttribute("aria-label", "Related portfolio navigation");
    related.append(actionButton("View Skills", actions.openSkills, true), actionButton("View Projects", actions.openProjects), actionButton("View Education", actions.openEducation), actionButton("Contact Me", actions.openContact));
    editor.append(header, primarySection, supportingSection, note, related);
  }

  function cards(items, offset, featured) {
    const grid = element("div", `certifications-grid${featured ? " certifications-grid--primary" : ""}`);
    items.forEach((credential, index) => {
      const card = element("article", "certification-card");
      const top = element("div", "certification-card-top");
      top.append(element("span", "certification-rank", String(offset + index + 1).padStart(2, "0")), element("span", `certification-priority certification-priority--${credential.priority}`, credential.priority === "primary" ? "Primary" : "Supporting"));
      card.append(top, element("p", "certification-issuer", credential.issuer), element("h3", "", credential.name), tags(credential.focusAreas), actionButton("Verify credential ↗", () => actions.openExternal(credential.credentialUrl), featured));
      grid.appendChild(card);
    });
    return grid;
  }

  function section(title, intro) {
    const container = element("section", "certifications-section");
    container.append(element("h2", "", title), element("p", "certifications-section-intro", intro));
    return container;
  }

  function tags(items) {
    const list = element("div", "certification-tags");
    items.forEach(item => list.appendChild(element("span", "", item)));
    return list;
  }

  function metrics(items) {
    const group = element("div", "certifications-metrics");
    items.forEach(([value, label]) => {
      const item = element("span", "certifications-metric");
      item.append(element("strong", "", String(value)), element("span", "", label));
      group.appendChild(item);
    });
    return group;
  }

  function actionButton(label, action, primary = false) {
    const button = element("button", `certification-action${primary ? " certification-action--primary" : ""}`, label);
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
