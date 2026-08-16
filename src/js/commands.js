const HELP_TEXT = [
  "Available commands:",
  "  help                 List supported commands",
  "  ls [path]            List virtual files",
  "  open <path>          Open a virtual file",
  "  projects             Open the project showcase",
  "  contact              Open professional contact details",
  "  cv                   Download the public CV",
  "  clear                Clear terminal output"
].join("\n");

function normalizePath(path) {
  return path.trim().replace(/^\/+|\/+$/g, "");
}

function listDirectory(files, requestedPath) {
  const directory = normalizePath(requestedPath);
  const prefix = directory ? `${directory}/` : "";
  const entries = new Set();

  Object.keys(files).forEach(path => {
    if (!path.startsWith(prefix)) {
      return;
    }

    const remainder = path.slice(prefix.length);
    const [entry, ...rest] = remainder.split("/");
    if (entry) {
      entries.add(rest.length ? `${entry}/` : entry);
    }
  });

  return [...entries];
}

export function createCommandDispatcher({ getFiles, openFile, clearTerminal }) {
  function resolveFile(requestedPath) {
    const normalized = normalizePath(requestedPath).toLowerCase();
    return Object.keys(getFiles()).find(path => path.toLowerCase() === normalized);
  }

  function openKnownFile(path) {
    const resolvedPath = resolveFile(path);

    if (!resolvedPath) {
      return `File not found: ${path}`;
    }

    openFile(resolvedPath);
    return resolvedPath === "cv.docx" ? "Downloading cv.docx" : `Opened ${resolvedPath}`;
  }

  return function executeCommand(rawCommand) {
    const [name = "", ...argumentParts] = rawCommand.trim().split(/\s+/);
    const command = name.toLowerCase();
    const argument = argumentParts.join(" ");

    switch (command) {
      case "help":
        return HELP_TEXT;
      case "ls": {
        const entries = listDirectory(getFiles(), argument);
        return entries.length
          ? entries.join("\n")
          : `Directory not found: ${argument || "/"}`;
      }
      case "open":
        return argument ? openKnownFile(argument) : "Usage: open <path>";
      case "projects":
        return openKnownFile("projects/overview.json");
      case "contact":
        return openKnownFile("contact.txt");
      case "cv":
        return openKnownFile("cv.docx");
      case "clear":
        clearTerminal();
        return null;
      default:
        return `Command not found: ${name}. Run help to list available commands.`;
    }
  };
}
