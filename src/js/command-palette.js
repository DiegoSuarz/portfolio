export function createCommandPalette({ dialog, input, list, commands }) {
  let visibleCommands = commands;
  let activeIndex = 0;
  let returnFocus = null;

  input.addEventListener("input", render);
  input.addEventListener("keydown", event => {
    if (["ArrowDown", "ArrowUp"].includes(event.key) && visibleCommands.length) {
      event.preventDefault();
      activeIndex = (activeIndex + (event.key === "ArrowDown" ? 1 : -1) + visibleCommands.length) % visibleCommands.length;
      renderOptions();
    } else if (event.key === "Enter") {
      event.preventDefault();
      run(visibleCommands[activeIndex]);
    } else if (event.key === "Escape") close();
  });
  dialog.addEventListener("click", event => { if (event.target === dialog) close(); });
  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "p") {
      event.preventDefault();
      open();
    }
  });

  function open() {
    returnFocus = document.activeElement;
    dialog.hidden = false;
    input.value = "";
    render();
    input.focus();
  }
  function close() { dialog.hidden = true; returnFocus?.focus(); }
  function render() {
    const query = input.value.replace(/^>/, "").trim().toLowerCase();
    visibleCommands = commands.filter(command => command.label.toLowerCase().includes(query));
    activeIndex = 0;
    renderOptions();
  }
  function renderOptions() {
    list.replaceChildren();
    visibleCommands.forEach((command, index) => {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "command-option";
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", String(index === activeIndex));
      const label = document.createElement("span");
      label.textContent = command.label;
      option.appendChild(label);
      if (command.shortcut) { const shortcut = document.createElement("kbd"); shortcut.textContent = command.shortcut; option.appendChild(shortcut); }
      option.addEventListener("mouseenter", () => { activeIndex = index; renderOptions(); });
      option.addEventListener("click", () => run(command));
      list.appendChild(option);
    });
    if (!visibleCommands.length) { const empty = document.createElement("p"); empty.className = "command-empty"; empty.textContent = "No matching commands"; list.appendChild(empty); }
  }
  function run(command) { if (!command) return; close(); command.action(); }
  return { open, close };
}
