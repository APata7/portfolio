// Dark mode
document.getElementById("toggle-theme").onclick = () => {
    document.body.classList.toggle("dark");
};

// SOBRE
fetch('/data/sobre.json')
.then(r=>r.json())
.then(d=>{
    document.getElementById("sobre").innerText = d.texto;
    document.getElementById("contacto").innerText = d.contacto;
});

// EXPERIÊNCIA
fetch('/data/experiencia')
.then(r=>r.json())
.then(data=>{
    let html="";
    data.forEach(e=>{
        html += `
        <div class="timeline-item">
            <strong>${e.cargo}</strong><br>
            ${e.empresa}<br>
            <small>${e.ano}</small>
        </div>`;
    });
    document.getElementById("experiencia").innerHTML = html;
});

// PROJETOS
fetch('/data/projetos')
.then(r=>r.json())
.then(data=>{
    let html="";
    data.forEach(p=>{
        html += `<p><strong>${p.nome}</strong><br>${p.descricao}</p>`;
    });
    document.getElementById("projetos").innerHTML = html;
});