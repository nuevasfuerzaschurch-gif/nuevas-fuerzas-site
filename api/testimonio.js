const TESTIMONY_TO = "testimoniosnuevasfuerzas@gmail.com";

const escapeHtml = (value) =>
  String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const normalize = (value) => String(value || "").trim();

module.exports = async (request, response) => {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ message: "Método no permitido." });
  }

  const data = typeof request.body === "string" ? JSON.parse(request.body || "{}") : request.body || {};
  const name = normalize(data.name) || "Anónimo";
  const email = normalize(data.email);
  const testimony = normalize(data.testimony);
  const consent = data.consent === true;
  const publicName = data.publicName === true ? "Sí" : "No";

  if (!testimony || !consent) {
    return response.status(400).json({ message: "Faltan campos requeridos." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.TESTIMONY_FROM || "Nuevas Fuerzas <onboarding@resend.dev>";

  if (!apiKey) {
    return response.status(500).json({ message: "Falta configurar RESEND_API_KEY en Vercel." });
  }

  const text = [
    "Nuevo Testimonio - Nuevas Fuerzas",
    "",
    `Nombre: ${name}`,
    `Correo: ${email || "No compartido"}`,
    `Autoriza publicación: Sí`,
    `Desea que su nombre aparezca públicamente: ${publicName}`,
    "",
    "Testimonio:",
    testimony,
  ].join("\n");

  const html = `
    <h2>Nuevo Testimonio - Nuevas Fuerzas</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
    <p><strong>Correo:</strong> ${escapeHtml(email || "No compartido")}</p>
    <p><strong>Autoriza publicación:</strong> Sí</p>
    <p><strong>Desea que su nombre aparezca públicamente:</strong> ${escapeHtml(publicName)}</p>
    <hr />
    <p><strong>Testimonio:</strong></p>
    <p>${escapeHtml(testimony).replaceAll("\n", "<br />")}</p>
  `;

  const result = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [TESTIMONY_TO],
      subject: "Nuevo Testimonio - Nuevas Fuerzas",
      text,
      html,
      reply_to: email || undefined,
    }),
  });

  if (!result.ok) {
    return response.status(502).json({ message: "No se pudo enviar el testimonio." });
  }

  return response.status(200).json({ message: "Testimonio enviado." });
};
