/* =========================
   PERSONAJE ACTUAL
========================= */

window.currentCharacter = "gandalf";

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

  // actualizar UI del personaje activo
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

  // ir a chat
  showView("chat");

  // 🔥 IMPORTANTE: opcional (limpiar chat al cambiar personaje)
  // messages = [];
  // renderMessages();
}

/* =========================
   SPA NAVIGATION
========================= */

function showView(viewId) {

  const views = document.querySelectorAll(".view");

  views.forEach(view => {
    view.classList.remove("active");
  });

  const target = document.getElementById(viewId);

  if (target) {
    target.classList.add("active");
  }
}

/* =========================
   INICIALIZACIÓN
========================= */

document.addEventListener("DOMContentLoaded", () => {
  showView("home");
});

/* =========================
   EXPORT GLOBAL
========================= */

window.showView = showView;
window.selectCharacter = selectCharacter;
window.characterData = characterData;
