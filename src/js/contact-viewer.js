export function createContactViewer({ editor, actions }) {
  function show(model) {
    const { profile, cv } = model;
    editor.replaceChildren();
    editor.classList.add("contact-preview");

    const header = element("header", "contact-header");
    header.append(
      element("p", "contact-eyebrow", "Professional Contact"),
      element("h1", "", "Let's connect"),
      element("p", "contact-intro", `Explore ${profile.name}'s Data Engineering work, professional background and public profiles, or start a conversation by email.`)
    );

    const primary = element("section", "contact-primary");
    const identity = element("div", "contact-identity");
    identity.append(element("span", "contact-avatar", initials(profile.name)), element("h2", "", profile.name), element("p", "contact-role", profile.headline), element("p", "contact-location", `⌖ ${profile.location}`));
    const callout = element("div", "contact-callout");
    callout.append(element("p", "contact-label", "Preferred contact"), element("a", "contact-email", profile.email));
    const emailLink = callout.querySelector("a");
    emailLink.href = `mailto:${profile.email}`;
    callout.append(element("p", "contact-hint", "Use email for professional opportunities, project conversations and collaboration."), actionButton("Send Email", () => actions.openEmail(profile.email), true));
    primary.append(identity, callout);

    const linksSection = element("section", "contact-section");
    linksSection.append(element("h2", "", "Professional profiles"), element("p", "contact-section-intro", "Review public work and professional history through verified profile links."));
    const links = element("div", "contact-link-grid");
    links.append(
      linkCard("GitHub", "Projects, repositories and technical documentation.", profile.links.github, () => actions.openExternal(profile.links.github)),
      linkCard("LinkedIn", "Professional background, learning and career profile.", profile.links.linkedin, () => actions.openExternal(profile.links.linkedin)),
      linkCard("Curriculum Vitae", `${cv.title} · ${cv.format.toUpperCase()} · Updated ${formatMonth(cv.updatedDate)}`, cv.downloadPath, actions.downloadCv)
    );
    linksSection.appendChild(links);

    const safety = element("aside", "contact-safety");
    safety.append(element("h2", "", "Public contact policy"), element("p", "", "Only intentionally public professional contact details are displayed. Personal phone numbers and private information are not included."));

    const related = element("nav", "contact-related");
    related.setAttribute("aria-label", "Related portfolio navigation");
    related.append(actionButton("View Projects", actions.openProjects), actionButton("View Experience", actions.openExperience), actionButton("View Skills", actions.openSkills));
    editor.append(header, primary, linksSection, safety, related);
  }

  function linkCard(title, description, url, action) {
    const card = element("article", "contact-link-card");
    card.append(element("p", "contact-link-kicker", "Open resource"), element("h3", "", title), element("p", "contact-link-description", description), element("small", "contact-link-url", displayUrl(url)), actionButton(`Open ${title} ↗`, action));
    return card;
  }

  function formatMonth(value) {
    const [year, month] = value.split("-").map(Number);
    return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, 1)));
  }

  function displayUrl(value) {
    if (!value.startsWith("https://")) return value.split("/").pop();
    return value.replace(/^https:\/\//, "").replace(/\/$/, "");
  }

  function initials(name) {
    return name.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();
  }

  function actionButton(label, action, primary = false) {
    const button = element("button", `contact-action${primary ? " contact-action--primary" : ""}`, label);
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
