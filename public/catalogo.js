// HU-01 · CU-01 — Actualización reactiva del catálogo y del mapa (ACT-TOBE-01).
(function () {
  'use strict';

  var form = document.getElementById('form-filtros');
  var contenedorResultados = document.getElementById('resultados');
  var resumen = document.getElementById('resumen');
  var scriptDatos = document.getElementById('datos-catalogo');
  var avisoMapa = document.getElementById('aviso-mapa');

  if (!form || !contenedorResultados || !resumen || !scriptDatos) return;

  var formatoMoneda = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  });

  function formatearDistancia(metros) {
    if (metros < 1000) return metros + ' m';
    return (metros / 1000).toFixed(1).replace('.', ',') + ' km';
  }

  function escapar(texto) {
    return String(texto)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  var datos = leerDatos();
  var mapa = null;
  var capaMarcadores = null;
  var circuloRadio = null;

  function leerDatos() {
    try {
      return JSON.parse(scriptDatos.textContent || '{}');
    } catch (error) {
      return { sede: null, radioKm: 2, pensiones: [] };
    }
  }

  function iniciarMapa() {
    if (typeof L === 'undefined') {
      if (avisoMapa) avisoMapa.hidden = false;
      return;
    }

    L.Icon.Default.prototype.options.imagePath =
      'https://unpkg.com/leaflet@1.9.4/dist/images/';

    mapa = L.map('mapa', { scrollWheelZoom: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(mapa);

    capaMarcadores = L.layerGroup().addTo(mapa);
    pintaMapa();
  }

  function pintaMapa() {
    if (!mapa || !datos.sede) return;

    var sede = datos.sede;
    var radioKm = Number(datos.radioKm) || 2;
    var zoom = radioKm <= 1 ? 14 : radioKm <= 2 ? 13 : radioKm <= 5 ? 12 : 11;

    mapa.setView([sede.latitud, sede.longitud], zoom);

    if (circuloRadio) {
      mapa.removeLayer(circuloRadio);
    }
    circuloRadio = L.circle([sede.latitud, sede.longitud], {
      radius: radioKm * 1000,
      color: '#1f6feb',
      weight: 1,
      fillColor: '#1f6feb',
      fillOpacity: 0.06,
    }).addTo(mapa);

    capaMarcadores.clearLayers();

    (datos.pensiones || []).forEach(function (pension) {
      var marcador = L.marker([pension.latitud, pension.longitud]);
      marcador.bindPopup(
        '<strong>' +
          escapar(pension.nombre) +
          '</strong><br>Desde ' +
          formatoMoneda.format(pension.precioDesde) +
          ' al mes<br>' +
          formatearDistancia(pension.distanciaMetros) +
          ' de la sede',
      );
      marcador.addTo(capaMarcadores);
    });
  }

  function actualizarCatalogo() {
    var parametros = new URLSearchParams(new FormData(form));
    var url = '/catalogo?' + parametros.toString();

    fetch(url, { headers: { 'X-Solicitud': 'filtros' } })
      .then(function (respuesta) {
        if (!respuesta.ok) throw new Error('Respuesta ' + respuesta.status);
        return respuesta.text();
      })
      .then(function (html) {
        var documento = new DOMParser().parseFromString(html, 'text/html');
        var nuevosResultados = documento.getElementById('resultados');
        var nuevoResumen = documento.getElementById('resumen');
        var nuevosDatos = documento.getElementById('datos-catalogo');

        if (nuevosResultados) {
          contenedorResultados.innerHTML = nuevosResultados.innerHTML;
        }
        if (nuevoResumen) {
          resumen.textContent = nuevoResumen.textContent;
        }
        if (nuevosDatos) {
          scriptDatos.textContent = nuevosDatos.textContent;
          datos = leerDatos();
        }

        window.history.replaceState(null, '', url);
        pintaMapa();
      })
      .catch(function () {
        resumen.textContent =
          'No se pudo actualizar el catálogo. Revisa la conexión con el servidor y vuelve a intentarlo.';
      });
  }

  var temporizador = null;

  function actualizarConEspera() {
    window.clearTimeout(temporizador);
    temporizador = window.setTimeout(actualizarCatalogo, 250);
  }

  form.addEventListener('change', function (evento) {
    var destino = evento.target;
    if (destino && destino.type === 'number') return;
    actualizarCatalogo();
  });

  form.addEventListener('input', function (evento) {
    var destino = evento.target;
    if (destino && destino.type === 'number') actualizarConEspera();
  });

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();
    actualizarCatalogo();
  });

  iniciarMapa();
})();
