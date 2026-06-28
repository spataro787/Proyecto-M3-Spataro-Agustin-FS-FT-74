/* =========================
   PERSONAJE ACTUAL
========================= */

window.currentCharacter = "gandalf";

const characterData = {

  gandalf: {
    name: "🧙 Gandalf",
    description: "El sabio mago de la Tierra Media.",
    avatar: "/images/gandalf.png"
  },

  yoda: {
    name: "🟢 Yoda",
    description: "Maestro Jedi lleno de sabiduría.",
    avatar: "/images/yoda.png"
  },

  sherlock: {
    name: "🕵️ Sherlock Holmes",
    description: "Detective experto en deducción.",
    avatar: "/images/sherlock.png"
  }

};

/* =========================
   CAMBIAR PERSONAJE
========================= */

function selectCharacter(character) {

  window.currentCharacter = character;

  const avatar = document.getElementById("characterAvatar");
  const name = document.getElementById("characterName");
  const description = document.getElementById("characterDescription");

  if (!characterData[character]) return;

  if (avatar) {
    avatar.src = characterData[character].avatar;
    avatar.alt = characterData[character].name;
  }

  if (name) {
    name.textContent = characterData[character].name;
  }

  if (description) {
    description.textContent =
      characterData[character].description;
  }

  showView("chat");

}

/* =========================
   NAVEGACIÓN SPA
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
   EXPORTAR A WINDOW
========================= */

window.showView = showView;
window.selectCharacter = selectCharacter;
window.characterData = characterData;