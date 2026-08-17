export function createEducationViewer({ editor, actions }) {
  function show(model) {
    editor.replaceChildren();
    editor.classList.add("education-preview");

    const header = element("header", "education-header");
    header.append(
      element("p", "education-eyebrow", "Academic Background"),
      element("h1", "", "Formal Education"),
      element("p", "education-intro", "Completed university education presented from structured dates and verified program information."),
      metric(String(model.education.length), model.education.length === 1 ? "completed degree" : "completed degrees")
    );

    const timeline = element("section", "education-timeline");
    timeline.setAttribute("aria-label", "Education timeline");
    model.education.forEach(entry => {
      const article = element("article", "education-entry");
      const marker = element("span", "education-marker");
      marker.setAttribute("aria-hidden", "true");
      const card = element("div", "education-card");
      const heading = element("div", "education-card-heading");
      const title = element("div", "");
      title.append(element("p", "education-status", entry.completed ? "Completed" : "In progress"), element("h2", "", entry.degree), element("p", "education-institution", entry.institution));
      const dates = element("div", "education-dates");
      dates.append(element("span", "", formatPeriod(entry)), element("small", "", calculateDuration(entry.startDate, entry.endDate)));
      heading.append(title, dates);
      const facts = element("dl", "education-facts");
      facts.append(fact("Program status", entry.completed ? "Degree completed" : "Currently enrolled"), fact("Study period", formatPeriod(entry)), fact("Institution", entry.institution));
      card.append(heading, facts);
      article.append(marker, card);
      timeline.appendChild(article);
    });

    const note = element("aside", "education-note");
    note.append(element("h2", "", "How this fits the portfolio"), element("p", "", "Formal education is kept separate from technical certifications and project evidence so each section communicates a distinct, verifiable part of the professional profile."));

    const related = element("nav", "education-related");
    related.setAttribute("aria-label", "Related portfolio navigation");
    related.append(actionButton("View Certifications", actions.openCertifications, true), actionButton("View Skills", actions.openSkills), actionButton("View Projects", actions.openProjects), actionButton("Contact Me", actions.openContact));
    editor.append(header, timeline, note, related);
  }

  function formatPeriod(entry) {
    return `${formatDate(entry.startDate)} — ${entry.endDate ? formatDate(entry.endDate) : "Present"}`;
  }

  function formatDate(value) {
    const [year, month] = value.split("-").map(Number);
    return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, 1)));
  }

  function calculateDuration(startValue, endValue) {
    const [startYear, startMonth] = startValue.split("-").map(Number);
    const [endYear, endMonth] = (endValue ?? new Date().toISOString().slice(0, 7)).split("-").map(Number);
    const months = Math.max(0, (endYear - startYear) * 12 + endMonth - startMonth + 1);
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return [years ? `${years} yr${years === 1 ? "" : "s"}` : "", remainingMonths ? `${remainingMonths} mo` : ""].filter(Boolean).join(" ");
  }

  function fact(termText, descriptionText) {
    const wrapper = element("div", "education-fact");
    wrapper.append(element("dt", "", termText), element("dd", "", descriptionText));
    return wrapper;
  }

  function metric(value, label) {
    const item = element("span", "education-metric");
    item.append(element("strong", "", value), element("span", "", label));
    return item;
  }

  function actionButton(label, action, primary = false) {
    const button = element("button", `education-action${primary ? " education-action--primary" : ""}`, label);
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
