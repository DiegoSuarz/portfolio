import { loadPortfolioFiles } from "./content-loader.js";

document.addEventListener("DOMContentLoaded", async () => {
  let files = {};
  let activeFile = null;

  const editor = document.getElementById("editor");
  const statusLeft = document.querySelector(".status-bar span");
  const terminal = document.getElementById("terminal");

  try {
    files = await loadPortfolioFiles();
    buildExplorer();
    openFile("about.md");
    terminal.textContent = "> portfolio --content\nprofessional content loaded successfully";
  } catch (error) {
    showLoadError(error);
  }

  function buildExplorer() {
    const tree = document.getElementById("file-tree");
    tree.replaceChildren();

    Object.keys(files).forEach(name => {
      const item = document.createElement("li");
      item.textContent = name;
      item.tabIndex = 0;
      item.addEventListener("click", () => openFile(name));
      item.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openFile(name);
        }
      });
      tree.appendChild(item);
    });
  }

  function openFile(name) {
    const file = files[name];

    if (file.type === "download") {
      downloadFile(file.downloadPath);
      return;
    }

    activeFile = name;
    editor.innerHTML = highlight(file.content, file.type);
    document.getElementById("lang").textContent = file.type;

    renderLines(file.content);
    updateTabs(name);
    updateActiveExplorerItem();
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

      const title = document.createElement("span");
      title.textContent = name;
      title.addEventListener("click", () => openFile(name));

      const close = document.createElement("span");
      close.textContent = "×";
      close.className = "close";
      close.addEventListener("click", event => {
        event.stopPropagation();
        tab.remove();

        if (activeFile === name) {
          activeFile = null;
          editor.textContent = "";
          document.getElementById("lines").textContent = "";
          document.getElementById("lang").textContent = "Plain Text";
          updateActiveExplorerItem();
        }
      });

      tab.append(title, close);
      tabs.appendChild(tab);
    }

    document.querySelectorAll(".tab").forEach(item => item.classList.remove("active"));
    tab.classList.add("active");
  }

  function updateActiveExplorerItem() {
    document.querySelectorAll(".sidebar li").forEach(item => {
      item.classList.toggle("active", item.textContent === activeFile);
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
        .replace(/^(#{1,2} .*)$/gm, '<span class="md-title">$1</span>')
        .replace(/^(- .*)$/gm, '<span class="comment">$1</span>');
    }

    return safeContent;
  }

  function showLoadError(error) {
    const message = `Unable to load professional content. ${error.message}`;
    editor.textContent = message;
    terminal.textContent = `> portfolio --content\nerror: ${message}`;
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
