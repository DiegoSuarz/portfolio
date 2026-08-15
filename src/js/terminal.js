export function createTerminal({ form, input, output, onCommand }) {
  const history = [];
  let historyIndex = 0;

  function appendLine(text, className = "") {
    const line = document.createElement("div");
    line.className = className;
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function write(message, className = "") {
    String(message)
      .split("\n")
      .forEach(line => appendLine(line, className));
  }

  function clear() {
    output.replaceChildren();
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const command = input.value.trim();

    if (!command) {
      return;
    }

    write(`$ ${command}`, "terminal-command");
    history.push(command);
    historyIndex = history.length;
    input.value = "";

    const result = await onCommand(command);
    if (result) {
      write(result);
    }
  });

  input.addEventListener("keydown", event => {
    if (!history.length || (event.key !== "ArrowUp" && event.key !== "ArrowDown")) {
      return;
    }

    event.preventDefault();
    historyIndex += event.key === "ArrowUp" ? -1 : 1;
    historyIndex = Math.max(0, Math.min(history.length, historyIndex));
    input.value = history[historyIndex] ?? "";
    input.setSelectionRange(input.value.length, input.value.length);
  });

  return { clear, write };
}
