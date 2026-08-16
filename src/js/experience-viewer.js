export function createExperienceViewer({ editor, actions }) {
  function show(model) {
    editor.replaceChildren();
    editor.classList.add("experience-preview");

    const header = element("header", "experience-header");
    header.append(
      element("p", "experience-eyebrow", "Professional Journey"),
      element("h1", "", "Experience"),
      element("p", "experience-intro", "Engineering experience presented through factual contributions and their transferable relevance to Data Engineering.")
    );

    const timeline = element("div", "experience-timeline");
    model.experience.forEach(entry => timeline.appendChild(createEntry(entry)));

    const related = element("nav", "experience-related");
    related.setAttribute("aria-label", "Related portfolio sections");
    related.append(
      actionButton("View Skills", actions.openSkills),
      actionButton("View Projects", actions.openProjects),
      actionButton("Contact Me", actions.openContact)
    );

    editor.append(header, timeline, related);
  }

  function createEntry(entry) {
    const article = element("article", "experience-entry");
    const marker = element("span", "experience-marker");
    marker.setAttribute("aria-hidden", "true");
    const card = element("div", "experience-card");
    const heading = element("div", "experience-card-heading");
    const roleGroup = element("div", "");
    const meta = element("div", "experience-meta");
    roleGroup.append(element("h2", "", entry.role), element("p", "experience-company", entry.company));
    meta.append(
      element("span", "", `${formatDate(entry.startDate)} — ${entry.current ? "Present" : formatDate(entry.endDate)}`),
      element("span", "", formatDuration(entry.startDate, entry.current ? currentMonth() : entry.endDate)),
      element("span", "", entry.location)
    );
    heading.append(roleGroup, meta);

    const summary = element("p", "experience-summary", entry.summary);
    const contributionSection = element("section", "experience-detail");
    contributionSection.appendChild(element("h3", "", "Key Contributions"));
    const contributions = element("ul", "experience-contributions");
    entry.highlights.forEach(item => contributions.appendChild(element("li", "", item)));
    contributionSection.appendChild(contributions);

    const relevanceSection = element("section", "experience-detail");
    relevanceSection.appendChild(element("h3", "", "Data Engineering Relevance"));
    const tags = element("div", "experience-tags");
    entry.dataEngineeringRelevance.forEach(item => tags.appendChild(element("span", "", item)));
    relevanceSection.appendChild(tags);

    card.append(heading, summary, contributionSection, relevanceSection);
    article.append(marker, card);
    return article;
  }

  function formatDate(value) {
    const [year, month] = value.split("-").map(Number);
    return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, 1)));
  }

  function formatDuration(start, end) {
    const [startYear, startMonth] = start.split("-").map(Number);
    const [endYear, endMonth] = end.split("-").map(Number);
    const months = Math.max(1, (endYear - startYear) * 12 + endMonth - startMonth + 1);
    const years = Math.floor(months / 12);
    const remainder = months % 12;
    return [years ? `${years} yr${years > 1 ? "s" : ""}` : "", remainder ? `${remainder} mo${remainder > 1 ? "s" : ""}` : ""].filter(Boolean).join(" ");
  }

  function currentMonth() {
    const now = new Date();
    return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  }

  function actionButton(label, action) {
    const button = element("button", "experience-action", label);
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
