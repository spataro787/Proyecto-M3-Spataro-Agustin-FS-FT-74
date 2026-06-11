function showView(viewId) {
  document.querySelectorAll(".view").forEach(v => {
    v.classList.remove("active");
  });

  const target = document.getElementById(viewId);

  if (target) {
    target.classList.add("active");
  }
}

window.showView = showView;

document.addEventListener("DOMContentLoaded", () => {
  showView("home");
});