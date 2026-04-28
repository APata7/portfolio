// theme
const themeRoot = document.documentElement;
const themeBtn  = document.getElementById("toggle-theme");
const stored    = localStorage.getItem("theme");
if (stored === "light") themeRoot.classList.add("is-light");
themeBtn.addEventListener("click", () => {
  themeRoot.classList.toggle("is-light");
  localStorage.setItem("theme", themeRoot.classList.contains("is-light") ? "light" : "dark");
});

// year
document.getElementById("year").textContent = new Date().getFullYear();

// scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("is-revealed");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll("[data-reveal]").forEach(el => io.observe(el));

// helpers
const escapeHtml = (s = "") => String(s).replace(/[&<>"']/g, c => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));

// SOBRE
fetch("/data/sobre.json")
  .then(r => r.json())
  .then(d => {
    const sobre = document.getElementById("sobre-texto");
    sobre.innerHTML = "";
    sobre.classList.remove("prose-loading");
    sobre.textContent = d.texto || "";

    const contactos = (d.contacto || "").split("|").map(s => s.trim()).filter(Boolean);
    const list = document.getElementById("contacto-list");
    list.innerHTML = contactos.map((c, i) => {
      const isEmail = c.includes("@");
      const isPhone = /^[+\d][\d\s().-]+$/.test(c);
      const label   = isEmail ? "Email" : isPhone ? "Telefone" : `Linha ${String(i + 1).padStart(2, "0")}`;
      const href    = isEmail ? `mailto:${c}` : isPhone ? `tel:${c.replace(/[^\d+]/g, "")}` : "#";
      return `
        <a class="contact-row" href="${href}">
          <span class="contact-label">${label}</span>
          <span class="contact-value">${escapeHtml(c)}</span>
          <svg class="contact-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>
        </a>`;
    }).join("");
  })
  .catch(() => {
    document.getElementById("sobre-texto").textContent = "Não foi possível carregar a biografia.";
  });

// EXPERIÊNCIA
fetch("/data/experiencia")
  .then(r => r.json())
  .then(data => {
    const list = document.getElementById("experiencia");
    if (!Array.isArray(data) || data.length === 0) {
      list.innerHTML = `<li class="timeline-item"><span class="timeline-empresa">Sem experiências para mostrar.</span></li>`;
      return;
    }
    // sort by year desc when possible
    data.sort((a, b) => {
      const ya = parseInt(String(a.ano).match(/\d{4}/)?.[0] ?? "0", 10);
      const yb = parseInt(String(b.ano).match(/\d{4}/)?.[0] ?? "0", 10);
      return yb - ya;
    });
    list.innerHTML = data.map(e => `
      <li class="timeline-item">
        <span class="timeline-year">${escapeHtml(e.ano || "")}</span>
        <div class="timeline-body">
          <span class="timeline-cargo">${escapeHtml(e.cargo || "")}</span>
          <span class="timeline-empresa">${escapeHtml(e.empresa || "")}</span>
        </div>
      </li>`).join("");
  })
  .catch(() => {
    document.getElementById("experiencia").innerHTML =
      `<li class="timeline-item"><span class="timeline-empresa">Não foi possível carregar a experiência.</span></li>`;
  });

// PROJETOS
fetch("/data/projetos")
  .then(r => r.json())
  .then(data => {
    const list = document.getElementById("projetos-list");
    if (!Array.isArray(data) || data.length === 0) {
      list.innerHTML = `<article class="projeto"><p class="projeto-desc">Sem projetos para mostrar.</p></article>`;
      return;
    }
    list.innerHTML = data.map((p, i) => `
      <article class="projeto">
        <div class="projeto-head">
          <h3 class="projeto-nome">${escapeHtml(p.nome || "")}</h3>
          <span class="projeto-num">${String(i + 1).padStart(2, "0")}</span>
        </div>
        <p class="projeto-desc">${escapeHtml(p.descricao || "")}</p>
      </article>`).join("");
  })
  .catch(() => {
    document.getElementById("projetos-list").innerHTML =
      `<article class="projeto"><p class="projeto-desc">Não foi possível carregar os projetos.</p></article>`;
  });
// ... teu código original ...

// Adiciona scroll suave para links do dock
document.querySelectorAll('.dock a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Detecta se está disponível baseado na hora (opcional)
function updateStatus() {
  const now = new Date();
  const hour = now.getHours();
  const status = document.getElementById('status');
  if (hour >= 9 && hour <= 18) {
    status.textContent = 'disponível para projetos';
  } else {
    status.textContent = 'fora do horário comercial';
  }
}
updateStatus();
setInterval(updateStatus, 60000);
