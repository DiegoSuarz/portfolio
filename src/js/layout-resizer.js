export function createLayoutResizers({ sidebar, panel, sidebarHandle, panelHandle }) {
  const root = document.documentElement;
  const mobileViewport = window.matchMedia("(max-width: 600px)");

  setupHandle(sidebarHandle, { axis: "x", min: 180, max: 420, initial: 240, property: "--sidebar-width", measure: event => event.clientX - sidebar.getBoundingClientRect().left });
  setupHandle(panelHandle, { axis: "y", min: 120, max: 420, initial: 160, property: "--panel-height", measure: event => panel.getBoundingClientRect().bottom - event.clientY });

  function setupHandle(handle, config) {
    let value = config.initial;
    const update = nextValue => {
      value = Math.min(config.max, Math.max(config.min, Math.round(nextValue)));
      root.style.setProperty(config.property, `${value}px`);
      handle.setAttribute("aria-valuenow", String(value));
    };

    handle.addEventListener("pointerdown", event => {
      if (mobileViewport.matches) return;
      event.preventDefault();
      handle.setPointerCapture(event.pointerId);
      handle.classList.add("is-dragging");
    });
    handle.addEventListener("pointermove", event => {
      if (handle.hasPointerCapture(event.pointerId)) update(config.measure(event));
    });
    const finish = event => {
      if (!handle.hasPointerCapture(event.pointerId)) return;
      handle.releasePointerCapture(event.pointerId);
      handle.classList.remove("is-dragging");
    };
    handle.addEventListener("pointerup", finish);
    handle.addEventListener("pointercancel", finish);
    handle.addEventListener("dblclick", () => update(config.initial));
    handle.addEventListener("keydown", event => {
      const decrease = config.axis === "x" ? "ArrowLeft" : "ArrowDown";
      const increase = config.axis === "x" ? "ArrowRight" : "ArrowUp";
      if (![decrease, increase, "Home"].includes(event.key)) return;
      event.preventDefault();
      update(event.key === "Home" ? config.initial : value + (event.key === increase ? 10 : -10));
    });
  }
}
