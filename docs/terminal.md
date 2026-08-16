# Interactive Terminal Contract

## 1. Purpose

The portfolio terminal provides a keyboard-first alternative for exploring the same professional content available in the Explorer. It simulates a small, documented command interface and does not execute operating-system commands.

## 2. Safety Boundary

The command dispatcher accepts only the commands defined in this document. It must not use `eval`, create a shell process, execute arbitrary JavaScript, or send user input to an external service.

Unknown commands return a concise error followed by a suggestion to run `help`.

## 3. Command Grammar

```text
command := name [argument]
name    := help | ls | open | projects | contact | cv | clear
```

Command names are case-insensitive. Leading and trailing whitespace is ignored, and repeated internal whitespace is treated as a single separator.

## 4. Commands

### `help`

Lists the supported commands and their purpose.

### `ls [path]`

Lists the virtual files at the root or inside a virtual directory such as `projects`.

### `open <path>`

Opens an existing virtual file through the same application function used by the Explorer. A missing path or unknown file returns usage guidance without changing the active file.

### `projects`

Opens `projects/overview.json` as a discoverable shortcut.

### `contact`

Opens `contact.txt` as a discoverable shortcut.

### `cv`

Starts the existing public CV download flow.

### `clear`

Clears terminal output while preserving the command input and application state.

## 5. Interaction Contract

The visible prompt identifies the public portfolio as `DiegoSuarz@portfolio:~$`. The same prompt prefixes every submitted command so the GitHub identity remains visible without implying access to a real operating-system shell.

Closing the bottom panel preserves the current terminal session. The `New Terminal` application-menu action reopens Terminal with empty output, empty input and a new in-memory history.

- Enter or the labeled Run button submits a non-empty command.
- Arrow Up and Arrow Down navigate commands submitted during the current page session.
- Command history remains in memory and is not written to browser storage.
- Output is rendered as text, not injected as HTML.
- Output uses a polite live log so new command results can be announced without interrupting the user.
- Terminal controls remain usable with keyboard navigation and at mobile widths.

## 6. Ownership

The terminal controller owns input, in-memory history and text-only output. The command dispatcher owns parsing, command validation and mapping commands to application actions. File navigation and CV download continue to use the existing application functions so the terminal does not duplicate portfolio behavior.
