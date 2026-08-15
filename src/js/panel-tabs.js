export function createPanelTabs({ container }) {
  const tabs = [...container.querySelectorAll('[role="tab"]')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute("aria-controls")));

  tabs.forEach(tab => {
    tab.addEventListener("click", () => activate(tab.dataset.panel));
    tab.addEventListener("keydown", event => handleKeydown(event, tab));
  });

  function activate(panelName, focus = false) {
    const selectedTab = tabs.find(tab => tab.dataset.panel === panelName);
    if (!selectedTab) {
      return;
    }

    tabs.forEach((tab, index) => {
      const selected = tab === selectedTab;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[index].hidden = !selected;
    });

    if (focus) {
      selectedTab.focus();
    }
  }

  function handleKeydown(event, currentTab) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== "Home" && event.key !== "End") {
      return;
    }

    event.preventDefault();
    const currentIndex = tabs.indexOf(currentTab);
    let nextIndex = currentIndex;

    if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    } else {
      const direction = event.key === "ArrowRight" ? 1 : -1;
      nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
    }

    activate(tabs[nextIndex].dataset.panel, true);
  }

  return { activate };
}
