$(function(){
  const book = $('#flipbook');
  const stage = $('#reader-stage');
  const pages = $('.page');
  const total = pages.length || 1;
  let current = 1;
  let zoom = 1;
  let dark = false;

  $('#total-pages').text(total);

  function sizeBook(){
    const sw = Math.max(280, stage.innerWidth() - 110);
    const sh = Math.max(390, stage.innerHeight() - 35);
    const ratio = 0.7071; // A4 retrato: largura / altura
    let h = sh;
    let w = h * ratio;
    if (w > sw) { w = sw; h = w / ratio; }
    book.css({width: Math.floor(w) + 'px', height: Math.floor(h) + 'px'});
    applyZoom();
  }

  function applyZoom(){
    book.css('transform', 'scale(' + zoom + ')');
  }

  function showPage(n){
    current = Math.max(1, Math.min(total, n));
    pages.removeClass('active').hide();
    pages.eq(current - 1).addClass('active').show();
    $('#current-page').text(current);
    $('#prev-page').prop('disabled', current <= 1);
    $('#next-page').prop('disabled', current >= total);
    $('#sumario-panel').hide();
  }

  // Não dependemos do Turn.js: a navegação funciona mesmo sem biblioteca externa.
  pages.hide();
  showPage(1);
  sizeBook();
  $(window).on('resize', sizeBook);

  $('#next-page').on('click', function(){ showPage(current + 1); });
  $('#prev-page').on('click', function(){ showPage(current - 1); });

  $('#btn-zoom-in').on('click', function(){
    zoom = Math.min(1.5, +(zoom + .1).toFixed(2));
    applyZoom();
  });

  $('#btn-zoom-out').on('click', function(){
    zoom = Math.max(.75, +(zoom - .1).toFixed(2));
    applyZoom();
  });

  $('#btn-dark-mode').on('click', function(){
    dark = !dark;
    $('#leitor-container').toggleClass('dark-mode', dark);
    $(this).html(dark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>');
  });

  $('#btn-sumario').on('click', function(){ $('#sumario-panel').fadeToggle(160); });
  $('#btn-fechar-sumario').on('click', function(){ $('#sumario-panel').fadeOut(160); });

  $('#sumario-panel li[data-page]').on('click', function(){
    showPage(parseInt($(this).data('page'), 10) || 1);
  });

  $('#btn-fechar').on('click', function(){ window.location.href = 'index.php'; });

  $(document).on('keydown', function(e){
    if (e.key === 'ArrowRight' || e.key === 'PageDown') showPage(current + 1);
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') showPage(current - 1);
    if (e.key === 'Escape') $('#btn-fechar').trigger('click');
  });

  // Clique na própria página também avança/volta.
  book.on('click', function(e){
    const rect = book[0].getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width * .25) showPage(current - 1);
    else if (x > rect.width * .75) showPage(current + 1);
  });
});
