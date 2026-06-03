const pageHeader = document.querySelector("[data-header]");
const pageNav = document.querySelector("[data-nav]");
const pageToggle = document.querySelector("[data-menu-toggle]");

const syncPageHeader = () => {
  if (!pageHeader) {
    return;
  }

  pageHeader.classList.toggle("is-scrolled", window.scrollY > 12);
};

const closePageMenu = () => {
  if (!pageHeader || !pageNav || !pageToggle) {
    return;
  }

  document.body.classList.remove("nav-open");
  pageHeader.classList.remove("nav-active");
  pageNav.classList.remove("is-open");
  pageToggle.setAttribute("aria-expanded", "false");
};

if (pageHeader && pageNav && pageToggle) {
  pageToggle.addEventListener("click", () => {
    const isOpen = pageToggle.getAttribute("aria-expanded") === "true";
    pageToggle.setAttribute("aria-expanded", String(!isOpen));
    pageNav.classList.toggle("is-open", !isOpen);
    pageHeader.classList.toggle("nav-active", !isOpen);
    document.body.classList.toggle("nav-open", !isOpen);
  });

  pageNav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      closePageMenu();
    }
  });

  window.addEventListener("scroll", syncPageHeader, { passive: true });
  syncPageHeader();
}
