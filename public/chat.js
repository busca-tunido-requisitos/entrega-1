// HU-04 · CU-05 — Chat de coordinación: actualización en vivo por sondeo.
(function () {
  'use strict';

  var contenedor = document.getElementById('mensajes');
  if (!contenedor) return;

  var codigo = contenedor.getAttribute('data-codigo') || '';
  var ultimoId = Number(contenedor.getAttribute('data-ultimo-id')) || 0;
  var url = '/solicitudes/' + encodeURIComponent(codigo) + '/chat/mensajes';
  var sinMensajes = document.getElementById('sin-mensajes');

  function escapar(texto) {
    return String(texto)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function formatearHora(fechaHora) {
    var partes = String(fechaHora).match(/(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
    if (!partes) return fechaHora;
    return partes[3] + '/' + partes[2] + '/' + partes[1] + ' ' + partes[4] + ':' + partes[5];
  }

  function agregar(mensaje) {
    var articulo = document.createElement('article');
    var propio = mensaje.autorRol === 'postulante';
    articulo.className = 'mensaje ' + (propio ? 'propio' : 'contrario');

    var cabecera = document.createElement('header');
    var autor = document.createElement('strong');
    autor.textContent = mensaje.autorNombre;
    var hora = document.createElement('span');
    hora.textContent = formatearHora(mensaje.fechaHoraEnvio);
    cabecera.appendChild(autor);
    cabecera.appendChild(hora);

    var texto = document.createElement('p');
    texto.textContent = mensaje.contenidoTexto;

    articulo.appendChild(cabecera);
    articulo.appendChild(texto);
    contenedor.appendChild(articulo);
  }

  function actualizar() {
    fetch(url + '?desde=' + ultimoId, { headers: { 'X-Solicitud': 'chat' } })
      .then(function (respuesta) {
        if (!respuesta.ok) throw new Error('Respuesta ' + respuesta.status);
        return respuesta.json();
      })
      .then(function (datos) {
        var mensajes = datos.mensajes || [];
        if (mensajes.length === 0) return;

        if (sinMensajes) {
          sinMensajes.remove();
          sinMensajes = null;
        }

        mensajes.forEach(function (mensaje) {
          if (mensaje.id > ultimoId) {
            ultimoId = mensaje.id;
            agregar(mensaje);
          }
        });

        contenedor.scrollTop = contenedor.scrollHeight;
      })
      .catch(function () {
        // Sin conexión: se reintenta en el siguiente ciclo.
      });
  }

  window.setInterval(actualizar, 3000);
})();
