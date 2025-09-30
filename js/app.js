// Carga dinámica de contenido con transición
async function loadPage(page) {
  const content = document.getElementById('content');
  content.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div></div>';

  let html = '';

  if (page === 'bienvenida') {
    html = `
      <div class="fade-in p-4">
        <h2 class="text-primary">Bienvenido a Venezolanos en León</h2>
        <p>Este espacio está creado para ayudarte a integrarte, encontrar empleo y formarte en España.</p>
        <p>Explora nuestro blog, recursos y guías actualizadas.</p>
      </div>
    `;
  } else if (page === 'recursos') {
    html = `
      <div class="fade-in p-4">
        <h2 class="text-primary">Recursos Útiles</h2>
        <ul>
          <li><a href="https://europass.europa.eu" target="_blank">CV Europass</a></li>
          <li><a href="https://www.sepe.es" target="_blank">SEPE - Servicio Público de Empleo</a></li>
          <li><a href="https://www.santamarialareal.org" target="_blank">Fundación Santa María la Real</a></li>
          <li><a href="https://www.jcyl.es/web/jcyl/Empleo/" target="_blank">ECYL - Empleo Castilla y León</a></li>
        </ul>
      </div>
    `;
  } else if (page.endsWith('.html')) {
    try {
      const response = await fetch(page);
      if (response.ok) {
        html = await response.text();
      } else {
        html = `<div class="fade-in p-4 text-danger">Error: No se pudo cargar la página.</div>`;
      }
    } catch (e) {
      html = `<div class="fade-in p-4 text-danger">Error de red al cargar la página.</div>`;
    }
  } else {
    html = `<div class="fade-in p-4">Contenido en construcción.</div>`;
  }

  setTimeout(() => {
    content.innerHTML = html;
  }, 300);
}

// Eventos para el menú
document.querySelectorAll('[data-page]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = e.target.getAttribute('data-page');
    loadPage(page);
    const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('sidebarMenu'));
    if (offcanvas) offcanvas.hide();
  });
});

// Cargar la primera entrada del blog si se accede directamente
window.addEventListener('load', () => {
  const path = window.location.pathname;
  if (path.includes('primer-paso-sepe.html')) {
    fetch('blog/primer-paso-sepe.html')
      .then(res => res.text())
      .then(html => {
        document.getElementById('content').innerHTML = html;
      });
  }
});
