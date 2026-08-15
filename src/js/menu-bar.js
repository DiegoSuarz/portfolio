const MENU_DEFINITIONS = [
  { label: "File", items: [["Open Profile", "openAbout"], ["Open Projects", "openProjects"], null, ["Download CV", "downloadCv"]] },
  { label: "Edit", items: [["Focus Editor", "focusEditor"], ["Select All Content", "selectEditor"]] },
  { label: "Selection", items: [["Select Editor Content", "selectEditor"], ["Clear Selection", "clearSelection"]] },
  { label: "View", items: [["Toggle Explorer", "toggleExplorer"], ["Toggle Terminal", "toggleTerminal"]] },
  { label: "Go", items: [["Experience", "openExperience"], ["Skills", "openSkills"], ["Education", "openEducation"], ["Contact", "openContact"]] },
  { label: "Run", items: [["Focus Terminal", "focusTerminal"], ["Run Terminal Command", "runTerminal"]] },
  { label: "Terminal", items: [["Focus Terminal", "focusTerminal"], ["Clear Terminal", "clearTerminal"], ["Show Available Commands", "showTerminalHelp"]] },
  { label: "Help", items: [["Terminal Command Reference", "showTerminalHelp"], null, ["GitHub Profile", "openGithub"], ["LinkedIn Profile", "openLinkedin"]] }
];

export function createMenuBar({ container, actions }) {
  let openMenu = null;

  MENU_DEFINITIONS.forEach((definition, menuIndex) => {
    const menu = document.createElement("div");
    const trigger = document.createElement("button");
    const popover = document.createElement("div");
    const menuId = `app-menu-${menuIndex}`;

    menu.className = "app-menu";
    trigger.className = "menu-trigger";
    trigger.type = "button";
    trigger.textContent = definition.label;
    trigger.setAttribute("aria-haspopup", "menu");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", menuId);

    popover.className = "menu-popover";
    popover.id = menuId;
    popover.hidden = true;
    popover.setAttribute("role", "menu");
    popover.setAttribute("aria-label", `${definition.label} menu`);

    definition.items.forEach(item => {
      if (!item) {
        const separator = document.createElement("div");
        separator.className = "menu-separator";
        separator.setAttribute("role", "separator");
        popover.appendChild(separator);
        return;
      }

      const [label, actionName] = item;
      const menuItem = document.createElement("button");
      menuItem.className = "menu-item";
      menuItem.type = "button";
      menuItem.textContent = label;
      menuItem.setAttribute("role", "menuitem");
      menuItem.addEventListener("click", () => {
        closeMenus();
        actions[actionName]?.();
      });
      popover.appendChild(menuItem);
    });

    trigger.addEventListener("click", () => {
      const shouldOpen = openMenu !== menu;
      closeMenus();
      if (shouldOpen) {
        open(menu, trigger, popover);
      }
    });

    trigger.addEventListener("keydown", event => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        open(menu, trigger, popover);
        popover.querySelector(".menu-item")?.focus();
      }
    });

    popover.addEventListener("keydown", event => handleMenuKeys(event, popover, trigger));
    menu.append(trigger, popover);
    container.appendChild(menu);
  });

  document.addEventListener("click", event => {
    if (!container.contains(event.target)) {
      closeMenus();
    }
  });

  function open(menu, trigger, popover) {
    closeMenus();
    openMenu = menu;
    popover.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
  }

  function closeMenus() {
    container.querySelectorAll(".menu-popover").forEach(popover => {
      popover.hidden = true;
    });
    container.querySelectorAll(".menu-trigger").forEach(trigger => {
      trigger.setAttribute("aria-expanded", "false");
    });
    openMenu = null;
  }

  function handleMenuKeys(event, popover, trigger) {
    const items = [...popover.querySelectorAll(".menu-item")];
    const index = items.indexOf(document.activeElement);

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenus();
      trigger.focus();
      return;
    }

    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }

    event.preventDefault();
    const direction = event.key === "ArrowDown" ? 1 : -1;
    const nextIndex = (index + direction + items.length) % items.length;
    items[nextIndex].focus();
  }
}
