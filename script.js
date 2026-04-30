// TEMA CLARO/ESCURO
const themeRoot = document.documentElement;
const themeBtn = document.getElementById("toggle-theme");
const storedTheme = localStorage.getItem("theme");

if (storedTheme === "light") {
  themeRoot.classList.add("is-light");
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    themeRoot.classList.toggle("is-light");

    localStorage.setItem(
      "theme",
      themeRoot.classList.contains("is-light") ? "light" : "dark"
    );
  });
}

// ANO AUTOMÁTICO
const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

// ANIMAÇÕES AO FAZER SCROLL
const revealElements = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((el) => io.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("is-revealed"));
}

// SCROLL SUAVE DO MENU
document.querySelectorAll(".dock a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const target = document.querySelector(link.getAttribute("href"));

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

// ESTADO DE DISPONIBILIDADE
function updateStatus() {
  const status = document.getElementById("status");

  if (!status) return;

  const now = new Date();
  const hour = now.getHours();

  if (hour >= 9 && hour <= 18) {
    status.textContent = "disponível para projetos";
  } else {
    status.textContent = "fora do horário comercial";
  }
}

updateStatus();
setInterval(updateStatus, 60000);
