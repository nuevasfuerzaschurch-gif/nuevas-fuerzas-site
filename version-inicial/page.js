const pageHeader = document.querySelector("[data-header]");
const pageNav = document.querySelector("[data-nav]");
const pageToggle = document.querySelector("[data-menu-toggle]");
const panelTriggers = document.querySelectorAll("[data-open-panel]");
const panelClosers = document.querySelectorAll("[data-close-panel]");
const pageForms = document.querySelectorAll("[data-page-form]");
const smsForms = document.querySelectorAll("[data-sms-form]");
const faqSelect = document.querySelector("[data-faq-select]");
const faqAnswer = document.querySelector("[data-faq-answer]");

const faqAnswers = {
  parking: "Encontrarás un amplio parqueadero al llegar a las instalaciones. Puedes estacionarte con comodidad antes del servicio.",
  "second-floor": "Ingresa por la entrada principal, dirígete hacia las escaleras y sube al segundo piso. Al llegar, gira a la derecha y sigue los letreros de Nuevas Fuerzas.",
  children: "Sí. Las familias son bienvenidas. Estamos formando un espacio seguro y espiritual para niños y familias.",
  duration: "El servicio dominical tiene un tiempo de adoración, oración y enseñanza bíblica. Si necesitas salir antes o tienes alguna situación especial, puedes hacerlo con libertad.",
  clothing: "No tenemos un código de vestimenta. Encontrarás personas vestidas de manera casual y otras de manera más formal.",
  other: "Escribe tu pregunta en el campo de abajo y con gusto te responderemos antes de tu visita.",
};

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

panelTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const panel = document.getElementById(trigger.dataset.openPanel);

    if (!panel) {
      return;
    }

    panel.hidden = false;
    panel.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

panelClosers.forEach((closer) => {
  closer.addEventListener("click", () => {
    const panel = document.getElementById(closer.dataset.closePanel);

    if (panel) {
      panel.hidden = true;
    }
  });
});

if (faqSelect && faqAnswer) {
  faqSelect.addEventListener("change", () => {
    faqAnswer.textContent = faqAnswers[faqSelect.value] || "Selecciona una pregunta frecuente para ver una respuesta breve.";
  });
}

smsForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const status = form.querySelector("[data-form-status]");
    const formData = new FormData(form);
    const lines = [
      "Hola Nuevas Fuerzas, quiero planificar mi visita.",
      "",
      `Nombre: ${formData.get("name") || ""}`,
      `Correo: ${formData.get("email") || ""}`,
      `Teléfono: ${formData.get("phone") || "No indicado"}`,
      `Personas: ${formData.get("people") || "No indicado"}`,
    ];
    const message = formData.get("message");

    if (message) {
      lines.push(`Mensaje: ${message}`);
    }

    if (status) {
      status.textContent = "Se abrirá tu aplicación de mensajes para enviar tu visita.";
    }

    window.location.href = `sms:+17372005446?body=${encodeURIComponent(lines.join("\n"))}`;
  });
});

pageForms.forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const status = form.querySelector("[data-form-status]");
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const endpoint = form.action.replace("https://formsubmit.co/", "https://formsubmit.co/ajax/");

    if (status) {
      status.textContent = "Enviando...";
    }

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("No se pudo enviar el formulario.");
      }

      form.reset();

      if (faqAnswer) {
        faqAnswer.textContent = "Selecciona una pregunta frecuente para ver una respuesta breve.";
      }

      if (status) {
        status.textContent = "Gracias. Recibimos tu mensaje y nos comunicaremos contigo pronto.";
      }
    } catch (error) {
      if (status) {
        status.textContent = "No pudimos enviarlo ahora. Por favor intenta nuevamente en unos minutos.";
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
});
