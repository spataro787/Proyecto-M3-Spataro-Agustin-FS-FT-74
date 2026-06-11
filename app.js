// app.js

function showView(viewId) {
  // ocultar todas las vistas
  document.querySelectorAll(".view").forEach(v => {
    v.classList.remove("active");
    v.classList.add("hidden");
  });

  // mostrar vista seleccionada
  const target = document.getElementById(viewId);
  if (target) {
    target.classList.remove("hidden");
    target.classList.add("active");
  }
}

// exponer global para HTML
window.showView = showView;

// iniciar app
document.addEventListener("DOMContentLoaded", () => {
  console.log("Gandalf SPA iniciado 🧙");

  showView("home");
});