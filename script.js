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
function escapeHtml(text = "") {
  return String(text).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Erro ao carregar ${path}`);
  }
  return response.json();
}

async function carregarConteudos() {
  try {
    const sobre = await loadJSON("data/sobre.json");
    const sobreEl = document.getElementById("sobre-texto");
    if (sobreEl) sobreEl.textContent = sobre.texto;

    const destaques = await loadJSON("data/destaques.json");
    const destaquesEl = document.getElementById("destaques-list");
    if (destaquesEl) {
      destaquesEl.innerHTML = destaques.items
        .map(item => `<li>${escapeHtml(item.texto)}</li>`)
        .join("");
    }

    const experiencia = await loadJSON("data/experiencia.json");
    const experienciaEl = document.getElementById("experiencia-list");
    if (experienciaEl) {
      experienciaEl.innerHTML = experiencia.items.map(item => `
        <li class="timeline-item">
          <span class="timeline-year">${escapeHtml(item.ano)}</span>
          <div class="timeline-body">
            <span class="timeline-cargo">${escapeHtml(item.cargo)}</span>
            <span class="timeline-empresa">${escapeHtml(item.empresa)}</span>
            <p class="projeto-desc">${escapeHtml(item.descricao)}</p>
          </div>
        </li>
      `).join("");
    }

    const competencias = await loadJSON("data/competencias.json");
    const competenciasEl = document.getElementById("competencias-list");
    if (competenciasEl) {
      competenciasEl.innerHTML = competencias.items
        .map(item => `<li>${escapeHtml(item.texto)}</li>`)
        .join("");
    }

    const formacao = await loadJSON("data/formacao.json");
    const formacaoEl = document.getElementById("formacao-list");
    if (formacaoEl) {
      formacaoEl.innerHTML = formacao.items.map(item => `
        <li class="timeline-item">
          <span class="timeline-year">${escapeHtml(item.ano)}</span>
          <div class="timeline-body">
            <span class="timeline-cargo">${escapeHtml(item.curso)}</span>
            <span class="timeline-empresa">${escapeHtml(item.entidade)}</span>
          </div>
        </li>
      `).join("");
    }

    const projetos = await loadJSON("data/projetos.json");
    const projetosEl = document.getElementById("projetos-list");
    if (projetosEl) {
      projetosEl.innerHTML = projetos.items.map((item, index) => `
        <article class="projeto">
          <div class="projeto-head">
            <h3 class="projeto-nome">${escapeHtml(item.nome)}</h3>
            <span class="projeto-num">${String(index + 1).padStart(2, "0")}</span>
          </div>
          <p class="projeto-desc">${escapeHtml(item.descricao)}</p>
        </article>
      `).join("");
    }

    const disponivel = await loadJSON("data/disponivel.json");
    const disponivelEl = document.getElementById("disponivel-list");
    if (disponivelEl) {
      disponivelEl.innerHTML = disponivel.items.map(item => `
        <li>
          <strong>${escapeHtml(item.titulo)}</strong><br>
          ${escapeHtml(item.descricao)}
        </li>
      `).join("");
    }

  } catch (error) {
    console.error("Erro ao carregar conteúdos:", error);
  }
}

carregarConteudos();