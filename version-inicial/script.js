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
  const formSubmitEndpoint = testimonyForm.action.replace("https://formsubmit.co/", "https://formsubmit.co/ajax/");
  const payload = {
    name: formData.get("name") || "No compartido",
    email: formData.get("email") || "",
    "Correo electrónico": formData.get("email") || "No compartido",
    Testimonio: formData.get("testimony"),
    "Autorización para publicar": formData.get("consent") === "on" ? "Sí" : "No",
    "Deseo que mi nombre aparezca públicamente": formData.get("publicName") === "si" ? "Sí" : "No",
    _subject: "Nuevo Testimonio - Nuevas Fuerzas",
    _template: "table",
    _captcha: "false",
  };

  testimonyStatus.textContent = "Enviando tu testimonio...";
  submitButton.disabled = true;

  try {
    const response = await fetch(formSubmitEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("No se pudo enviar el testimonio.");
    }

    testimonyForm.reset();
    testimonyStatus.textContent = "Gracias por compartir tu testimonio. Lo revisaremos antes de publicarlo.";
  } catch (error) {
    testimonyStatus.textContent = "No pudimos enviarlo ahora. Por favor intenta nuevamente en unos minutos.";
  } finally {
    submitButton.disabled = false;
  }
});

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();
