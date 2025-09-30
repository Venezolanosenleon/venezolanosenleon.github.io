// js/content-loader.js

document.addEventListener('DOMContentLoaded', function () {
  // Función para cargar lista de posts o noticias
  async function loadContentList(folder, containerSelector, emptyMessage) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    try {
      const response = await fetch(`${folder}/`);
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const links = Array.from(doc.querySelectorAll('a'))
        .map(a => a.getAttribute('href'))
        .filter(href => href && href.endsWith('.html') && href !== 'index.html');

      if (links.length === 0) {
        container.innerHTML = `<p>${emptyMessage}</p>`;
        return;
      }

      let html = '<ul class="post-list">';
      for (const link of links) {
        try {
          const postResponse = await fetch(`${folder}/${link}`);
          const postText = await postResponse.text();
          const postDoc = parser.parseFromString(postText, 'text/html');
          
          const titleMeta = postDoc.querySelector('meta[name="title"]');
          const descMeta = postDoc.querySelector('meta[name="description"]');
          const title = titleMeta ? titleMeta.getAttribute('content') : link.replace('.html', '').replace(/-/g, ' ');
          const description = descMeta ? descMeta.getAttribute('content') : 'Sin descripción';

          html += `
            <li>
              <h2><a href="${folder}/${link}">${title}</a></h2>
              <p>${description}</p>
            </li>
          `;
        } catch (e) {
          console.warn('No se pudo cargar:', link, e);
        }
      }
      html += '</ul>';
      container.innerHTML = html;
    } catch (e) {
      container.innerHTML = `<p>Error al cargar el contenido. Por favor, visita las páginas directamente.</p>`;
      console.error(e);
    }
  }

  // Detectar si estamos en /blog/ o /noticias/
  const path = window.location.pathname;
  if (path === '/blog/' || path.endsWith('/blog/index.html')) {
    loadContentList('blog', 'main', 'No hay posts disponibles.');
  } else if (path === '/noticias/' || path.endsWith('/noticias/index.html')) {
    loadContentList('noticias', 'main', 'Próximamente publicaremos noticias.');
  }
});
