const dataElement = document.querySelector("#credential-data");

const credential = JSON.parse(dataElement.textContent);

const setText = (selector, value) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value || "Por confirmar";
  });
};

const getInitials = (name) =>
  String(name || "NF")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

setText("[data-name]", credential.fullName);
setText("[data-type]", credential.type);
setText("[data-ministry]", credential.ministry);
setText("[data-status]", credential.status);
setText("[data-issued]", credential.issuedAt);
setText("[data-note]", credential.note);
setText("[data-initials]", getInitials(credential.fullName));

const photoSlot = document.querySelector("[data-photo]");

if (credential.photoUrl) {
  const image = document.createElement("img");
  image.src = credential.photoUrl;
  image.alt = `Foto de ${credential.fullName}`;
  photoSlot.replaceChildren(image);
}
