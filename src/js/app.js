document.addEventListener("DOMContentLoaded", () => {

  let files = {};
  let activeFile = null;

  fetch("data/files.json")
    .then(res => res.json())
    .then(data => {
      files = data;
      buildExplorer();
    });

  function buildExplorer() {
    const tree = document.getElementById("file-tree");
    Object.keys(files).forEach(name => {
      const li = document.createElement("li");
      li.innerText = name;
      li.onclick = () => openFile(name);
      tree.appendChild(li);
    });
  }

  function openFile(name) {
    activeFile = name;
    const file = files[name];

    const editor = document.getElementById("editor");
    editor.innerHTML = highlight(file.content, file.type);

    document.getElementById("lang").innerText = file.type;

    renderLines(file.content);
    updateTabs(name);

    document.querySelectorAll(".sidebar li").forEach(li =>
      li.classList.toggle("active", li.innerText === name)
    );
  }

  function renderLines(content) {
    const gutter = document.getElementById("lines");
    gutter.innerHTML = "";
    content.split("\n").forEach((_, i) => {
      gutter.innerHTML += (i + 1) + "<br>";
    });
  }

  function updateTabs(name) {
    const tabs = document.getElementById("tabs");

    let tab = document.getElementById(`tab-${name}`);
    if (!tab) {
      tab = document.createElement("div");
      tab.className = "tab";
      tab.id = `tab-${name}`;

      const title = document.createElement("span");
      title.innerText = name;
      title.onclick = () => openFile(name);

      const close = document.createElement("span");
      close.innerText = "✕";
      close.className = "close";
      close.onclick = (e) => {
        e.stopPropagation();
        tab.remove();
        document.getElementById("editor").innerHTML = "";
        document.getElementById("lines").innerHTML = "";
      };

      tab.appendChild(title);
      tab.appendChild(close);
      tabs.appendChild(tab);
    }

    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
  }

  function highlight(content, type) {
    if (type === "javascript") {
      return content
        .replace(/(\/\/.*)/g, '<span class="comment">$1</span>')
        .replace(/\b(const|let|var|function|return)\b/g, '<span class="keyword">$1</span>')
        .replace(/(".*?")/g, '<span class="string">$1</span>');
    }

    if (type === "json") {
      return content
        .replace(/(".*?")\s*:/g, '<span class="key">$1</span>:')
        .replace(/:\s*(".*?")/g, ': <span class="string">$1</span>');
    }

    if (type === "markdown") {
      return content.replace(/^(# .*)/gm, '<span class="md-title">$1</span>');
    }

    return content;
  }

  const editor = document.getElementById("editor");
  const statusLeft = document.querySelector(".status-bar span");

  editor.addEventListener("click", updateCursor);
  editor.addEventListener("keyup", updateCursor);

  function updateCursor() {
    const text = editor.innerText;
    const selection = window.getSelection();
    const pos = selection.focusOffset;

    const before = text.slice(0, pos);
    const line = before.split("\n").length;
    const col = before.split("\n").pop().length + 1;

    statusLeft.innerText = `Ln ${line}, Col ${col}`;
  }

});
