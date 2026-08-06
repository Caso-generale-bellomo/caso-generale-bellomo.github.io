/* Generale Nicola Bellomo - logica di pagina.
   Tre cose, nessuna dipendenza esterna:
   1. la barra-indice del rapporto evidenzia la sezione corrente;
   2. lo scrollytelling della sintesi visiva cambia immagine, didascalia
      e inquadratura della mappa a seconda del passaggio in vista;
   3. le fotografie si aprono a tutto schermo al clic.
   I contenuti (didascalie, viste) stanno negli attributi data-* del
   markup e nelle figcaption, non qui. */
(function () {
  'use strict';

  /* --- barra-indice del rapporto --- */
  var vociIndice = Array.prototype.slice.call(document.querySelectorAll('[data-idx]'));
  var sezioni = vociIndice.map(function (a) {
    return document.getElementById(a.getAttribute('data-idx'));
  });

  /* --- scrollytelling --- */
  var passi = Array.prototype.slice.call(document.querySelectorAll('.scrolly__passo'));
  var didascalia = document.getElementById('scrolly-didascalia');
  var mappa = document.getElementById('mappa');

  var sezioneCorrente = null;
  var passoCorrente = null;
  var vistaMappaCorrente = null;

  function aggiornaIndice() {
    if (!vociIndice.length) return;
    var corrente = 0;
    for (var i = 0; i < sezioni.length; i++) {
      var el = sezioni[i];
      if (el && el.getBoundingClientRect().top <= 180) corrente = i;
    }
    if (corrente === sezioneCorrente) return;
    sezioneCorrente = corrente;
    vociIndice.forEach(function (a, i) {
      a.classList.toggle('is-corrente', i === corrente);
    });
  }

  function aggiornaScrolly() {
    if (!passi.length) return;

    /* il passaggio attivo e' quello la cui scheda attraversa il 45% della finestra;
       se nessuna lo attraversa vale l'ultima gia' superata */
    var meta = window.innerHeight * 0.45;
    var attivo = 0;
    passi.forEach(function (el, i) {
      var r = el.getBoundingClientRect();
      if (r.top <= meta && r.bottom > meta) attivo = i;
      else if (r.bottom <= meta && i > attivo) attivo = i;
    });
    if (attivo === passoCorrente) return;
    passoCorrente = attivo;

    var passo = passi[attivo];

    /* immagini: una sola visibile, la mappa resta sotto e non va mai rimossa */
    var idVisuale = passo.getAttribute('data-visuale');
    document.querySelectorAll('.scrolly__layer').forEach(function (img) {
      img.classList.toggle('is-attivo', img.id === idVisuale);
    });

    if (didascalia) didascalia.textContent = passo.getAttribute('data-didascalia') || '';

    var vista = passo.getAttribute('data-mappa');
    if (vista && vista !== vistaMappaCorrente && mappa && mappa.contentWindow) {
      vistaMappaCorrente = vista;
      mappa.contentWindow.postMessage({ mapView: vista }, '*');
    }
  }

  var inCoda = false;
  function alloScroll() {
    if (inCoda) return;
    inCoda = true;
    window.requestAnimationFrame(function () {
      inCoda = false;
      aggiornaIndice();
      aggiornaScrolly();
    });
  }

  window.addEventListener('scroll', alloScroll, { passive: true });
  window.addEventListener('resize', alloScroll);

  /* la mappa parte sulla vista del primo passaggio appena l'iframe e' pronto */
  if (mappa) {
    mappa.addEventListener('load', function () {
      var vista = vistaMappaCorrente || (passi[0] && passi[0].getAttribute('data-mappa'));
      if (vista && mappa.contentWindow) mappa.contentWindow.postMessage({ mapView: vista }, '*');
    });
  }

  aggiornaIndice();
  aggiornaScrolly();

  /* --- ingrandimento delle fotografie --- */
  var lente = document.getElementById('lente');
  var lenteImg = document.getElementById('lente-img');
  var lenteDid = document.getElementById('lente-didascalia');
  var lenteChiudi = document.getElementById('lente-chiudi');
  var pagina = document.querySelector('.pagina');
  var tornaA = null;

  function apriLente(bottone) {
    var img = bottone.querySelector('img');
    if (!img || !lente) return;
    var figura = bottone.closest('figure');
    var did = figura && figura.querySelector('figcaption');
    lenteImg.src = img.currentSrc || img.src;
    lenteImg.alt = img.alt || '';
    lenteDid.textContent = did ? did.textContent.trim() : '';
    lente.hidden = false;
    document.body.classList.add('lente-aperta');
    /* il resto della pagina esce dalla navigazione finche' la lente e' aperta */
    pagina.inert = true;
    tornaA = bottone;
    lenteChiudi.focus();
  }

  function chiudiLente() {
    if (!lente || lente.hidden) return;
    lente.hidden = true;
    lenteImg.src = '';
    document.body.classList.remove('lente-aperta');
    pagina.inert = false;
    if (tornaA) { tornaA.focus(); tornaA = null; }
  }

  document.querySelectorAll('.zoom').forEach(function (b) {
    b.addEventListener('click', function () { apriLente(b); });
    /* l'etichetta per gli screen reader dice quale foto si apre:
       la prende dalla didascalia, cosi' resta una sola fonte del testo */
    var fig = b.closest('figure');
    var did = fig && fig.querySelector('figcaption');
    if (did) {
      var t = did.textContent.replace(/\s*\[.*?\]\s*/g, ' ').trim();
      if (t) b.setAttribute('aria-label', 'Ingrandisci la fotografia: ' + t);
    }
  });

  if (lente) {
    /* un clic ovunque sullo sfondo chiude; sull'immagine no */
    lente.addEventListener('click', function (e) {
      if (e.target !== lenteImg) chiudiLente();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') chiudiLente();
    });
  }
})();
