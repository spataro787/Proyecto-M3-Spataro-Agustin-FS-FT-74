/* =========================
   PERSONAJE ACTUAL
========================= *

/* =========================
   DATOS PERSONAJES
========================= */

const characterData = {
  gandalf: {
    name: "Gandalf",
    description: "El sabio mago de la Tierra Media.",
    avatar: "/images/Gandalf.png"
  },

  yoda: {
    name: "Yoda",
    description: "Maestro Jedi lleno de sabiduría.",
    avatar: "/images/yoda.png"
  },

  sherlock: {
    name: "Sherlock Holmes",
    description: "Detective experto en deducción.",
    avatar: "/images/Sherlock.png"
  }
};

/* =========================
   CAMBIAR PERSONAJE
========================= */

function selectCharacter(character) {

  if (!characterData[character]) return;

  window.currentCharacter = character;

  const avatar = document.getElementById("characterAvatar");
  const name = document.getElementById("characterName");
  const description = document.getElementById("characterDescription");

  if (avatar) {
    avatar.src = characterData[character].avatar;
    avatar.alt = characterData[character].name;
  }

  if (name) {
    name.textContent = characterData[character].name;
  }

  if (description) {
    description.textContent = characterData[character].description;
  }
  if (window.loadMessages) {
  window.loadMessages();
}

  // Ir automáticamente al chat
  showView("chat");
}

/* =========================
   SPA + HISTORY API
========================= */

function showView(viewId, pushState = true) {

  const views = document.querySelectorAll(".view");

  views.forEach(view => {
    view.classList.remove("active");
  });

  const target = document.getElementById(viewId);

  if (target) {
    target.classList.add("active");
  }

  // Actualizar URL sin recargar
  if (pushState) {

    const newUrl = `/${viewId}`;

    if (window.location.pathname !== newUrl) {

      history.pushState(
        { view: viewId },
        "",
        newUrl
      );

    }
  }
}

/* =========================
   BOTONES ATRÁS/ADELANTE
========================= */

window.addEventListener("popstate", event => {

  const view = event.state?.view ||
    window.location.pathname.replace("/", "") ||
    "home";

  showView(view, false);

});

/* =========================
   INICIALIZACIÓN
========================= */

document.addEventListener("DOMContentLoaded", () => {

  let currentRoute =
    window.location.pathname.replace("/", "");

  const validRoutes = ["home", "chat", "about"];

  if (!validRoutes.includes(currentRoute)) {
    currentRoute = "home";
  }

  history.replaceState(
    { view: currentRoute },
    "",
    `/${currentRoute}`
  );

  showView(currentRoute, false);

});

/* =========================
   EXPORT GLOBAL
========================= */

window.showView = showView;
window.selectCharacter = selectCharacter;
window.characterData = characterData;