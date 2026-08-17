export function createJsonViewer({ editor, minimap, onPathChange }) {
  let source = null;
  let wrap = true;
  let minimapVisible = true;

  function show(content, mode = "code") {
    source = JSON.parse(content);
    editor.replaceChildren();
    editor.classList.add("is-json", `json-view--${mode}`);
    editor.classList.remove(`json-view--${mode === "code" ? "preview" : "code"}`);

    if (mode === "preview") renderPreview(source);
    else renderCode(source);

    editor.classList.toggle("json-no-wrap", !wrap);
    minimap.hidden = mode !== "code" || !minimapVisible;
  }

  function renderCode(value) {
    const root = createNode(value, [], null, false);
    editor.appendChild(root);
    renderMinimap();
  }

  function createNode(value, path, key, showKey = true) {
    const node = document.createElement("div");
    node.className = "json-node";
    const depth = path.length;

    if (value !== null && typeof value === "object") {
      const entries = Array.isArray(value) ? value.map((item, index) => [index, item]) : Object.entries(value);
      const opening = Array.isArray(value) ? "[" : "{";
      const closing = Array.isArray(value) ? "]" : "}";
      const header = createLine(path, depth);
      const fold = document.createElement("button");
      const children = document.createElement("div");
      const closeLine = createLine(path, depth);
      const summary = document.createElement("span");

      fold.type = "button";
      fold.className = "json-fold";
      fold.textContent = "⌄";
      fold.setAttribute("aria-label", `Collapse ${formatPath(path)}`);
      children.className = "json-children";
      summary.className = "json-summary";
      summary.textContent = ` ${entries.length} ${Array.isArray(value) ? "items" : "properties"} `;
      summary.hidden = true;

      header.append(fold);
      appendKey(header, showKey ? key : null);
      header.append(token(opening, "json-punctuation"), summary);

      entries.forEach(([childKey, childValue], index) => {
        const child = createNode(childValue, [...path, childKey], childKey, !Array.isArray(value));
        if (index < entries.length - 1) child.dataset.comma = "true";
        children.appendChild(child);
      });
      closeLine.append(token(closing, "json-punctuation"));
      node.append(header, children, closeLine);

      fold.addEventListener("click", event => {
        event.stopPropagation();
        const collapsed = children.hidden;
        children.hidden = !collapsed;
        closeLine.hidden = !collapsed;
        summary.hidden = collapsed;
        node.classList.toggle("is-collapsed", !collapsed);
        fold.textContent = collapsed ? "⌄" : "›";
        fold.setAttribute("aria-label", `${collapsed ? "Collapse" : "Expand"} ${formatPath(path)}`);
        renderMinimap();
      });
      return node;
    }

    const line = createLine(path, depth);
    appendKey(line, showKey ? key : null);
    line.append(renderPrimitive(value));
    node.appendChild(line);
    return node;
  }

  function createLine(path, depth) {
    const line = document.createElement("div");
    line.className = "json-line";
    line.style.setProperty("--json-depth", depth);
    line.tabIndex = 0;
    line.dataset.jsonPath = formatPath(path);
    line.addEventListener("click", () => onPathChange(path));
    line.addEventListener("focus", () => onPathChange(path));
    return line;
  }

  function appendKey(line, key) {
    if (key === null) return;
    line.append(token(`"${key}"`, "json-key"), token(": ", "json-punctuation"));
  }

  function renderPrimitive(value) {
    if (value === null) return token("null", "json-null");
    if (typeof value === "string") return token(JSON.stringify(value), "json-string");
    if (typeof value === "number") return token(String(value), "json-number");
    return token(String(value), "json-boolean");
  }

  function token(text, className) {
    const span = document.createElement("span");
    span.className = className;
    span.textContent = text;
    return span;
  }

  function renderPreview(value) {
    const grid = document.createElement("div");
    grid.className = "json-preview-grid";
    const entries = getPreviewEntries(value);
    entries.forEach(([title, item]) => grid.appendChild(createPreviewCard(title, item)));
    editor.appendChild(grid);
  }

  function getPreviewEntries(value) {
    if (Array.isArray(value)) return value.map((item, index) => [item.name || item.id || `Item ${index + 1}`, item]);
    const arrayEntry = Object.entries(value).find(([, item]) => Array.isArray(item));
    return arrayEntry ? arrayEntry[1].map((item, index) => [item.name || item.id || `Item ${index + 1}`, item]) : Object.entries(value);
  }

  function createPreviewCard(title, value) {
    const card = document.createElement("article");
    const heading = document.createElement("h3");
    card.className = "json-preview-card";
    heading.textContent = title;
    card.appendChild(heading);
    if (value && typeof value === "object") {
      const list = document.createElement("dl");
      Object.entries(value).filter(([key]) => !["name", "id"].includes(key)).forEach(([key, item]) => {
        const term = document.createElement("dt");
        const description = document.createElement("dd");
        term.textContent = humanize(key);
        if (Array.isArray(item)) {
          const tags = document.createElement("div");
          tags.className = "json-preview-tags";
          item.forEach(entry => { const tag = document.createElement("span"); tag.textContent = typeof entry === "object" ? entry.name || JSON.stringify(entry) : entry; tags.appendChild(tag); });
          description.appendChild(tags);
        } else if (typeof item === "string" && item.startsWith("https://")) {
          const link = document.createElement("a"); link.href = item; link.target = "_blank"; link.rel = "noopener noreferrer"; link.textContent = "View credential"; description.appendChild(link);
        } else description.textContent = String(item);
        list.append(term, description);
      });
      card.appendChild(list);
    } else {
      const text = document.createElement("p"); text.textContent = String(value); card.appendChild(text);
    }
    return card;
  }

  function renderMinimap() {
    minimap.replaceChildren();
    editor.querySelectorAll(".json-line").forEach(line => {
      if (line.offsetParent === null) return;
      const mark = document.createElement("span");
      const depth = Number(line.style.getPropertyValue("--json-depth"));
      mark.style.marginLeft = `${Math.min(depth * 3, 24)}px`;
      mark.style.width = `${Math.max(12, Math.min(62, line.textContent.length * 1.2))}px`;
      minimap.appendChild(mark);
    });
  }

  function setWrap(enabled) { wrap = enabled; editor.classList.toggle("json-no-wrap", !wrap); }
  function setMinimap(enabled, mode) { minimapVisible = enabled; minimap.hidden = mode !== "code" || !enabled; }
  function formatPath(path) { return path.length ? path.join(" > ") : "root"; }
  function humanize(value) { return value.replace(/([A-Z])/g, " $1").replace(/^./, character => character.toUpperCase()); }

  return { show, setWrap, setMinimap };
}
