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

  function appendCommand(command) {
    const line = document.createElement("div");
    const identity = document.createElement("span");
    const path = document.createElement("span");
    const symbol = document.createElement("span");
    const commandText = document.createElement("span");

    line.className = "terminal-command";
    identity.className = "prompt-identity";
    identity.textContent = "DiegoSuarz@portfolio";
    path.className = "prompt-path";
    path.textContent = ":~";
    symbol.className = "prompt-symbol";
    symbol.textContent = "$";
    commandText.className = "terminal-command-text";
    commandText.textContent = ` ${command}`;
    line.append(identity, path, symbol, commandText);
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

  function reset() {
    clear();
    history.length = 0;
    historyIndex = 0;
    input.value = "";
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const command = input.value.trim();

    if (!command) {
      return;
    }

    appendCommand(command);
    history.push(command);
    historyIndex = history.length;
    input.value = "";

    const result = await onCommand(command);
    if (result) {
      write(result);
    }
  });

  input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      form.requestSubmit();
      return;
    }

    if (!history.length || (event.key !== "ArrowUp" && event.key !== "ArrowDown")) {
      return;
    }

    event.preventDefault();
    historyIndex += event.key === "ArrowUp" ? -1 : 1;
    historyIndex = Math.max(0, Math.min(history.length, historyIndex));
    input.value = history[historyIndex] ?? "";
    input.setSelectionRange(input.value.length, input.value.length);
  });

  return { clear, reset, write };
}
