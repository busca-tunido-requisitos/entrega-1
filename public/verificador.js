// HU-04 · CU-04 — Verificación presencial: lectura del QR con la cámara del navegador.
(function () {
  'use strict';

  var boton = document.getElementById('btn-escanear');
  var video = document.getElementById('camara');
  var estado = document.getElementById('estado-camara');
  var campo = document.getElementById('contenido');

  if (!boton || !video || !campo) return;

  boton.addEventListener('click', function () {
    if (typeof BarcodeDetector === 'undefined') {
      estado.textContent =
        'Este navegador no puede leer códigos QR con la cámara. ' +
        'Pega el contenido del QR en el campo de abajo.';
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      estado.textContent =
        'La cámara no está disponible en este dispositivo. Pega el contenido del QR en el campo de abajo.';
      return;
    }

    estado.textContent = 'Solicitando permiso de cámara…';

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then(function (flujo) {
        video.srcObject = flujo;
        return video.play();
      })
      .then(function () {
        estado.textContent = 'Escaneando… apunta a la ficha del estudiante.';
        var detector = new BarcodeDetector({ formats: ['qr_code'] });

        var leer = function () {
          if (video.readyState === video.HAVE_ENOUGH_DATA) {
            detector
              .detect(video)
              .then(function (codigos) {
                if (codigos && codigos.length > 0) {
                  campo.value = codigos[0].rawValue;
                  estado.textContent =
                    'Código QR capturado. Presiona «Verificar y registrar llegada».';
                  if (video.srcObject) {
                    video.srcObject.getTracks().forEach(function (pista) {
                      pista.stop();
                    });
                  }
                  return;
                }
              })
              .catch(function () {
                // Continúa escaneando.
              });
          }
          window.requestAnimationFrame(leer);
        };

        window.requestAnimationFrame(leer);
      })
      .catch(function (error) {
        estado.textContent =
          'No se pudo usar la cámara (' + error.message + '). ' +
          'Pega el contenido del QR en el campo de abajo.';
      });
  });
})();
