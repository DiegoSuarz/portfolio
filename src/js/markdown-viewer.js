export function createMarkdownViewer({ editor }) {
  function show(markdown) {
    editor.replaceChildren();
    editor.classList.add("markdown-preview");

    const lines = markdown.split("\n");
    let paragraph = [];
    let list = null;
    let code = null;

    const flushParagraph = () => {
      if (!paragraph.length) return;
      const node = document.createElement("p");
      appendInline(node, paragraph.join(" "));
      editor.appendChild(node);
      paragraph = [];
    };
    const flushList = () => {
      if (!list) return;
      editor.appendChild(list);
      list = null;
    };

    lines.forEach(line => {
      if (line.startsWith("```")) {
        flushParagraph();
        flushList();
        if (code) {
          editor.appendChild(code);
          code = null;
        } else {
          code = document.createElement("pre");
          const value = document.createElement("code");
          code.appendChild(value);
        }
        return;
      }
      if (code) {
        code.firstChild.textContent += `${code.firstChild.textContent ? "\n" : ""}${line}`;
        return;
      }
      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        flushParagraph();
        flushList();
        const node = document.createElement(`h${heading[1].length}`);
        appendInline(node, heading[2]);
        editor.appendChild(node);
        return;
      }
      const bullet = line.match(/^[-*]\s+(.+)$/);
      if (bullet) {
        flushParagraph();
        if (!list) list = document.createElement("ul");
        const item = document.createElement("li");
        appendInline(item, bullet[1]);
        list.appendChild(item);
        return;
      }
      if (!line.trim()) {
        flushParagraph();
        flushList();
        return;
      }
      paragraph.push(line.trim());
    });
    flushParagraph();
    flushList();
    if (code) editor.appendChild(code);
  }

  function appendInline(container, text) {
    const pattern = /\[([^\]]+)\]\((https:\/\/[^)\s]+)\)|`([^`]+)`|\*\*([^*]+)\*\*/g;
    let cursor = 0;
    let match;
    while ((match = pattern.exec(text))) {
      container.appendChild(document.createTextNode(text.slice(cursor, match.index)));
      if (match[1]) {
        const link = document.createElement("a");
        link.href = match[2];
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = match[1];
        container.appendChild(link);
      } else if (match[3]) {
        const inlineCode = document.createElement("code");
        inlineCode.textContent = match[3];
        container.appendChild(inlineCode);
      } else {
        const strong = document.createElement("strong");
        strong.textContent = match[4];
        container.appendChild(strong);
      }
      cursor = pattern.lastIndex;
    }
    container.appendChild(document.createTextNode(text.slice(cursor)));
  }

  return { show };
}
