(function () {
  const PANEL_ID = "overflow-panel";
  const OVERLAY_ID = "overflow-overlay";

  function getMenu() {
    return document.getElementById("menu");
  }

  // Return only the "real" menu items (li) excluding the Others trigger li
  function getMenuItemLis(menu, moreLi) {
    return Array.from(menu.children).filter((li) => li !== moreLi);
  }

  function ensureMoreNode(menu) {
    let more = menu.querySelector(".menu-more");
    if (more) return more;

    more = document.createElement("li");
    more.className = "menu-more";

    const trigger = document.createElement("a");
    trigger.href = "javascript:void(0)";

    // ICON trigger (no text)
    trigger.innerHTML = `
      <span class="others-icon" aria-hidden="true">
        <span></span>
      </span>
    `;
    trigger.setAttribute("aria-label", "Open menu");
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-expanded", "false");

    more.appendChild(trigger);
    menu.appendChild(more);

    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      openPanel(more);
      trigger.setAttribute("aria-expanded", "true");
    });

    return more;
  }

  function ensurePanel() {
    let overlay = document.getElementById(OVERLAY_ID);
    let panel = document.getElementById(PANEL_ID);

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = OVERLAY_ID;
      overlay.className = "overflow-overlay";
      document.body.appendChild(overlay);
      overlay.addEventListener("click", closePanel);
    }

    if (!panel) {
      panel = document.createElement("div");
      panel.id = PANEL_ID;
      panel.className = "overflow-panel";
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-modal", "true");

      panel.innerHTML = `
        <div class="overflow-panel-header">
          <div class="overflow-panel-title">Menu</div>
          <button class="overflow-panel-close" aria-label="Close">×</button>
        </div>
        <div class="overflow-panel-body"></div>
      `;

      document.body.appendChild(panel);
      panel.querySelector(".overflow-panel-close").addEventListener("click", closePanel);
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePanel();
    });

    return { overlay, panel };
  }

  function openPanel(more) {
    const { overlay, panel } = ensurePanel();
    const body = panel.querySelector(".overflow-panel-body");

    const links = Array.from(more.querySelectorAll("a[data-overflow='true']"));
    body.innerHTML = "";

    links.forEach((a) => {
      const item = document.createElement("a");
      item.className = "overflow-panel-link";
      item.href = a.getAttribute("href") || "#";
      item.textContent = a.textContent;

      const target = a.getAttribute("target");
      if (target) item.setAttribute("target", target);

      const rel = a.getAttribute("rel");
      if (rel) item.setAttribute("rel", rel);

      item.addEventListener("click", () => closePanel());
      body.appendChild(item);
    });

    overlay.classList.add("open");
    panel.classList.add("open");

    if (!links.length) {
      const empty = document.createElement("div");
      empty.className = "overflow-panel-empty";
      empty.textContent = "No items.";
      body.appendChild(empty);
    }
  }

  function closePanel() {
    const overlay = document.getElementById(OVERLAY_ID);
    const panel = document.getElementById(PANEL_ID);
    if (overlay) overlay.classList.remove("open");
    if (panel) panel.classList.remove("open");

    const menu = getMenu();
    if (menu) {
      const trigger = menu.querySelector(".menu-more > a");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    }
  }

  // Move ALL items into Others (all-or-nothing behavior)
  function collapseAllIntoOthers(menu, more) {
    restoreAll(menu, more);

    const lis = getMenuItemLis(menu, more);
    lis.forEach((li) => {
      const a = li.querySelector("a");
      if (!a) {
        li.remove();
        return;
      }
      a.setAttribute("data-overflow", "true");
      more.appendChild(a); // stored inside more (hidden via CSS), panel reads them
      li.remove();
    });

    more.style.display = "";
  }

  // Restore all items from Others back into the menu
  function restoreAll(menu, more) {
    const links = Array.from(more.querySelectorAll("a[data-overflow='true']"));
    links.forEach((a) => {
      a.removeAttribute("data-overflow");
      const li = document.createElement("li");
      li.appendChild(a);
      menu.insertBefore(li, more);
    });
  }

  function setExpanded(menu, more) {
    restoreAll(menu, more);
    more.style.display = "none";
  }

  // Check if full expanded menu fits
  function fullMenuFits(menu, more) {
    setExpanded(menu, more);
    if (menu.offsetParent === null) return true;
    return menu.scrollWidth <= menu.clientWidth + 1;
  }

  function compute(menu) {
    const more = ensureMoreNode(menu);

    if (fullMenuFits(menu, more)) {
      setExpanded(menu, more);
      return;
    }

    collapseAllIntoOthers(menu, more);

    // If panel is open, refresh after resize
    const panel = document.getElementById(PANEL_ID);
    if (panel && panel.classList.contains("open")) {
      openPanel(more);
    }
  }

  function init() {
    const menu = getMenu();
    if (!menu) return;

    const run = () => compute(menu);
    run();
    window.addEventListener("resize", run);
    setTimeout(run, 200);
    setTimeout(run, 600);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
