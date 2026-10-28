(async function () {
  const container = document.getElementById('edicoes-container');
  const dataBR = value => {
    if (!value) return 'Data não informada';
    const parts = value.split('-');
    return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : value;
  };
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  try {
    const response = await fetch('dados/edicoes.json');
    if (!response.ok) throw new Error('Não foi possível carregar as edições.');
    const dados = await response.json();
    const edicoes = Array.isArray(dados.edicoes) ? dados.edicoes.slice().sort((a, b) => Number(b.id) - Number(a.id)) : [];
    if (!edicoes.length) {
      container.innerHTML = '<div class="sem-edicoes"><i class="fas fa-newspaper" style="font-size:3rem;display:block;margin-bottom:18px"></i><p>Nenhuma edição publicada ainda.</p></div>';
      return;
    }
    const capa = e => `assets/img/${String(e.capa || '').replace(/^\/+/, '')}`;
    const ultima = edicoes[0];
    let html = `<section class="destaque"><div class="capa-destaque"><img src="${capa(ultima)}" alt="Capa da edição ${escapeHTML(ultima.numero)}"><div class="info-destaque"><h2>Edição ${escapeHTML(ultima.numero)}</h2><p><i class="fas fa-calendar-alt"></i> ${escapeHTML(dataBR(ultima.data))}</p><p><i class="fas fa-file-alt"></i> ${Number(ultima.totalPaginas) || 1} páginas</p><a href="leitor.html?id=${encodeURIComponent(ultima.id)}" class="btn-ler"><i class="fas fa-book-open"></i> Ler edição</a></div></div></section>`;
    if (edicoes.length > 1) {
      html += '<section class="edicoes-anteriores"><h3>Edições anteriores</h3><div class="grid">';
      html += edicoes.slice(1).map(e => `<div class="card-edicao"><img src="${capa(e)}" alt="Capa da edição ${escapeHTML(e.numero)}"><div class="card-info"><h4>Edição ${escapeHTML(e.numero)}</h4><p>${escapeHTML(dataBR(e.data))}</p><a href="leitor.html?id=${encodeURIComponent(e.id)}" class="btn-pequeno">Ler edição</a></div></div>`).join('');
      html += '</div></section>';
    }
    container.innerHTML = html;
  } catch (error) {
    container.innerHTML = '<div class="sem-edicoes"><i class="fas fa-exclamation-triangle" style="font-size:2.5rem;display:block;margin-bottom:18px"></i><p>Não foi possível carregar as edições.</p><p>Confira se o arquivo dados/edicoes.json foi enviado ao GitHub.</p></div>';
    console.error(error);
  }
})();
