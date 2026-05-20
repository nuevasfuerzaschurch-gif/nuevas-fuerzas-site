const CONTACT_EMAIL = "";

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-menu-toggle]");
const year = document.querySelector("[data-year]");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(contactForm);
  const subject = `Contacto desde nuevasfuerzaschurch.org - ${data.get("interest")}`;
  const body = [
    `Nombre: ${data.get("name")}`,
    `Email: ${data.get("email")}`,
    `Interes: ${data.get("interest")}`,
    "",
    data.get("message"),
  ].join("\n");

  const recipient = CONTACT_EMAIL.trim();
  const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;

  formStatus.textContent = recipient
    ? "Abrimos tu aplicación de correo con el mensaje preparado."
    : "Abrimos tu aplicación de correo con el mensaje preparado. Agrega el destinatario oficial cuando esté confirmado.";
});

year.textContent = new Date().getFullYear();
window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();
