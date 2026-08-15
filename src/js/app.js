import { loadPortfolioFiles } from "./content-loader.js";
import { createCommandDispatcher } from "./commands.js";
import { createTerminal } from "./terminal.js";

document.addEventListener("DOMContentLoaded", async () => {
  let files = {};
  let activeFile = null;

  const editor = document.getElementById("editor");
  const explorer = document.getElementById("portfolio-explorer");
  const explorerToggle = document.getElementById("explorer-toggle");
  const mobileViewport = window.matchMedia("(max-width: 600px)");
  const statusLeft = document.querySelector(".status-bar span");
  let terminalController;
  const executeTerminalCommand = createCommandDispatcher({
    getFiles: () => files,
    openFile,
    clearTerminal: () => terminalController.clear()
  });
  terminalController = createTerminal({
    form: document.getElementById("terminal-form"),
    input: document.getElementById("terminal-input"),
    output: document.getElementById("terminal-output"),
    onCommand: executeTerminalCommand
  });

  syncExplorerWithViewport();
  explorerToggle.addEventListener("click", toggleExplorer);
  mobileViewport.addEventListener("change", syncExplorerWithViewport);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && mobileViewport.matches && explorer.classList.contains("is-open")) {
      closeMobileExplorer(true);
    }
  });

  try {
    files = await loadPortfolioFiles();
    buildExplorer();
    openFile("about.md");
    terminalController.write("Portfolio content loaded successfully.\nType help to list available commands.");
  } catch (error) {
    showLoadError(error);
  }

  function buildExplorer() {
    const tree = document.getElementById("file-tree");
    tree.replaceChildren();

    const root = createExplorerTree(Object.keys(files));
    renderExplorerNodes(root, tree);
  }

  function toggleExplorer() {
    if (!mobileViewport.matches) {
      return;
    }

    const shouldOpen = !explorer.classList.contains("is-open");
    explorer.classList.toggle("is-open", shouldOpen);
    explorer.inert = !shouldOpen;
    explorerToggle.setAttribute("aria-expanded", String(shouldOpen));

    if (shouldOpen) {
      explorer.querySelector("button")?.focus();
    }
  }

  function closeMobileExplorer(returnFocus = false) {
    explorer.classList.remove("is-open");
    explorer.inert = true;
    explorerToggle.setAttribute("aria-expanded", "false");

    if (returnFocus) {
      explorerToggle.focus();
    }
  }

  function syncExplorerWithViewport() {
    if (mobileViewport.matches) {
      closeMobileExplorer();
      return;
    }

    explorer.classList.remove("is-open");
    explorer.inert = false;
    explorerToggle.setAttribute("aria-expanded", "true");
  }

  function createExplorerTree(paths) {
    const root = {};

    paths.forEach(path => {
      const segments = path.split("/");
      let level = root;

      segments.forEach((segment, index) => {
        level[segment] ??= {
          children: {},
          path: index === segments.length - 1 ? path : null
        };
        level = level[segment].children;
      });
    });

    return root;
  }

  function renderExplorerNodes(nodes, container) {
    Object.entries(nodes).forEach(([name, node]) => {
      const item = document.createElement("li");

      if (node.path) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "tree-item";
        button.dataset.file = node.path;
        button.textContent = name;
        button.setAttribute("aria-label", `Open ${node.path}`);
        button.addEventListener("click", () => openFile(node.path));
        item.appendChild(button);
      } else {
        const folderButton = document.createElement("button");
        const children = document.createElement("ul");
        folderButton.type = "button";
        folderButton.className = "tree-folder-label";
        folderButton.textContent = `▾ ${name}`;
        folderButton.setAttribute("aria-expanded", "true");
        folderButton.addEventListener("click", () => {
          const expanded = folderButton.getAttribute("aria-expanded") === "true";
          folderButton.setAttribute("aria-expanded", String(!expanded));
          folderButton.textContent = `${expanded ? "▸" : "▾"} ${name}`;
          children.hidden = expanded;
        });
        renderExplorerNodes(node.children, children);
        item.append(folderButton, children);
      }

      container.appendChild(item);
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
    editor.classList.toggle("is-markdown", file.type === "markdown");
    document.getElementById("lang").textContent = file.type;

    renderLines(file.content);
    updateTabs(name);
    updateActiveExplorerItem();

    if (mobileViewport.matches) {
      closeMobileExplorer();
    }
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
      tab.dataset.file = name;
      tab.setAttribute("role", "presentation");

      const title = document.createElement("button");
      title.type = "button";
      title.className = "tab-title";
      title.textContent = name.split("/").pop();
      title.setAttribute("role", "tab");
      title.setAttribute("aria-controls", "editor");
      title.setAttribute("aria-label", `Open ${name}`);
      title.addEventListener("click", () => openFile(name));

      const close = document.createElement("button");
      close.type = "button";
      close.textContent = "×";
      close.className = "close";
      close.setAttribute("aria-label", `Close ${name}`);
      close.addEventListener("click", event => {
        event.stopPropagation();
        const wasActive = activeFile === name;
        tab.remove();

        if (wasActive && tabs.lastElementChild) {
          const fallbackTab = tabs.lastElementChild;
          openFile(fallbackTab.dataset.file);
          fallbackTab.querySelector(".tab-title").focus();
        } else if (wasActive) {
          activeFile = null;
          editor.textContent = "";
          editor.classList.remove("is-markdown");
          document.getElementById("lines").textContent = "";
          document.getElementById("lang").textContent = "Plain Text";
          updateActiveExplorerItem();
          editor.focus();
        } else {
          document.querySelector(".tab.active .tab-title")?.focus();
        }
      });

      tab.append(title, close);
      tabs.appendChild(tab);
    }

    document.querySelectorAll(".tab").forEach(item => item.classList.remove("active"));
    document.querySelectorAll(".tab-title").forEach(item => item.setAttribute("aria-selected", "false"));
    tab.classList.add("active");
    tab.querySelector(".tab-title").setAttribute("aria-selected", "true");
  }

  function updateActiveExplorerItem() {
    document.querySelectorAll(".tree-item").forEach(item => {
      const active = item.dataset.file === activeFile;
      item.classList.toggle("active", active);
      if (active) {
        item.setAttribute("aria-current", "page");
      } else {
        item.removeAttribute("aria-current");
      }
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
        .replace(
          /\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g,
          '<a class="editor-link" href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
        )
        .replace(/^(#{1,2} .*)$/gm, '<span class="md-title">$1</span>')
        .replace(/^(- .*)$/gm, '<span class="comment">$1</span>');
    }

    return safeContent;
  }

  function showLoadError(error) {
    const message = `Unable to load professional content. ${error.message}`;
    editor.textContent = message;
    terminalController.clear();
    terminalController.write(`Error: ${message}`);
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
