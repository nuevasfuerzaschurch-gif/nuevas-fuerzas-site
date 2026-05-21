const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-menu-toggle]");
const testimonyToggle = document.querySelector("[data-testimony-toggle]");
const testimonyPanel = document.querySelector("[data-testimony-panel]");
const testimonyClose = document.querySelector("[data-testimony-close]");
const testimonyForm = document.querySelector("[data-testimony-form]");
const testimonyStatus = document.querySelector("[data-testimony-status]");

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

const closeMenu = () => {
  document.body.classList.remove("nav-open");
  header.classList.remove("nav-active");
  nav.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
};

toggle.addEventListener("click", () => {
  const isOpen = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!isOpen));
  nav.classList.toggle("is-open", !isOpen);
  header.classList.toggle("nav-active", !isOpen);
  document.body.classList.toggle("nav-open", !isOpen);
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    closeMenu();
  }
});

const openTestimonyForm = () => {
  testimonyPanel.hidden = false;
  requestAnimationFrame(() => {
    testimonyPanel.classList.add("is-open");
    testimonyToggle.setAttribute("aria-expanded", "true");
  });
};

const closeTestimonyForm = () => {
  testimonyPanel.classList.remove("is-open");
  testimonyToggle.setAttribute("aria-expanded", "false");
  window.setTimeout(() => {
    if (!testimonyPanel.classList.contains("is-open")) {
      testimonyPanel.hidden = true;
    }
  }, 260);
};

testimonyToggle.addEventListener("click", () => {
  if (testimonyPanel.hidden) {
    openTestimonyForm();
    return;
  }

  closeTestimonyForm();
});

testimonyClose.addEventListener("click", closeTestimonyForm);

testimonyForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = testimonyForm.querySelector('button[type="submit"]');
  const formData = new FormData(testimonyForm);
  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    testimony: formData.get("testimony"),
    consent: formData.get("consent") === "on",
    publicName: formData.get("publicName") === "si",
  };

  testimonyStatus.textContent = "Enviando tu testimonio...";
  submitButton.disabled = true;

  try {
    const response = await fetch("/api/testimonio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("No se pudo enviar el testimonio.");
    }

    testimonyForm.reset();
    testimonyStatus.textContent = "Gracias. Recibimos tu testimonio y lo revisaremos con cuidado pastoral antes de publicarlo.";
  } catch (error) {
    testimonyStatus.textContent = "No pudimos enviarlo ahora. Por favor intenta nuevamente en unos minutos.";
  } finally {
    submitButton.disabled = false;
  }
});

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();
