$(async function () {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));
  const book = $('#flipbook');
  const stage = $('#reader-stage');
  let pages = $();
  let total = 1;
  let current = 1;
  let zoom = 1;
  let dark = false;

  try {
    const response = await fetch('dados/edicoes.json');
    if (!response.ok) throw new Error('JSON não encontrado');
    const data = await response.json();
    const edicao = (data.edicoes || []).find(e => Number(e.id) === id);
    if (!edicao) throw new Error('Edição não encontrada');

    document.title = `Mucuri em Foco — Edição ${edicao.numero}`;
    $('#edition-info').text(`Edição ${edicao.numero} • ${formatDate(edicao.data)}`);
    const coverPath = `assets/img/${String(edicao.capa || '').replace(/^\/+/, '')}`;
    book.append(`<div class="page"><img src="${safePath(coverPath)}" alt="Capa da edição ${Number(edicao.numero) || ''}"></div>`);
    const totalInformado = Math.max(1, Number(edicao.totalPaginas) || 1);
    for (let pageNumber = 2; pageNumber <= totalInformado; pageNumber++) {
      const imageNumber = pageNumber - 1;
      const imagePath = `assets/paginas/edicao-${Number(edicao.id)}/pag${String(imageNumber).padStart(2, '0')}.png`;
      book.append(`<div class="page"><img src="${safePath(imagePath)}" alt="Página ${pageNumber}"></div>`);
    }
    pages = $('.page');
    total = pages.length;
    $('#total-pages').text(total);

    const sumario = Array.isArray(edicao.sumario) ? edicao.sumario : [];
    if (sumario.length) {
      $('#sumario-list').html(sumario.map(item => `<li data-page="${Math.max(1, Number(item.pagina) || 1)}"><span>${escapeHTML(item.titulo)}</span><span class="page-num">${Math.max(1, Number(item.pagina) || 1)}</span></li>`).join(''));
    } else {
      $('#sumario-list').html('<li class="empty">Nenhum sumário definido.</li>');
    }

    function sizeBook() {
      const sw = Math.max(200, stage.innerWidth() - 110);
      const sh = Math.max(250, stage.innerHeight() - 35);
      const ratio = 0.7071;
      let h = sh;
      let w = h * ratio;
      if (w > sw) { w = sw; h = w / ratio; }
      book.css({ width: Math.floor(w) + 'px', height: Math.floor(h) + 'px' });
      applyZoom();
    }
    function applyZoom() { book.css('transform', `scale(${zoom})`); }
    function showPage(n) {
      current = Math.max(1, Math.min(total, n));
      pages.removeClass('active').hide();
      pages.eq(current - 1).addClass('active').show();
      $('#current-page').text(current);
      $('#prev-page').prop('disabled', current <= 1);
      $('#next-page').prop('disabled', current >= total);
      $('#sumario-panel').hide();
    }
    pages.hide();
    showPage(1);
    sizeBook();
    $(window).on('resize', sizeBook);
    $('#next-page').on('click', () => showPage(current + 1));
    $('#prev-page').on('click', () => showPage(current - 1));
    $('#btn-zoom-in').on('click', () => { zoom = Math.min(1.5, +(zoom + .1).toFixed(2)); applyZoom(); });
    $('#btn-zoom-out').on('click', () => { zoom = Math.max(.75, +(zoom - .1).toFixed(2)); applyZoom(); });
    $('#btn-dark-mode').on('click', function () {
      dark = !dark;
      $('#leitor-container').toggleClass('dark-mode', dark);
      $(this).html(dark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>');
    });
    $('#btn-sumario').on('click', () => $('#sumario-panel').fadeToggle(160));
    $('#btn-fechar-sumario').on('click', () => $('#sumario-panel').fadeOut(160));
    $('#sumario-panel').on('click', 'li[data-page]', function () { showPage(Number($(this).data('page')) || 1); });
    $('#btn-fechar').on('click', () => { window.location.href = 'index.html'; });
    $(document).on('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') showPage(current + 1);
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') showPage(current - 1);
      if (e.key === 'Escape') window.location.href = 'index.html';
    });
    book.on('click', function (e) {
      const rect = book[0].getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x < rect.width * .25) showPage(current - 1);
      else if (x > rect.width * .75) showPage(current + 1);
    });
  } catch (error) {
    console.error(error);
    $('#toolbar, #reader-stage').hide();
    $('#reader-error').show();
  }

  function formatDate(value) {
    if (!value) return 'Data não informada';
    const parts = String(value).split('-');
    return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : value;
  }
  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function safePath(value) { return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
});
