# Casos de uso

## Actores

| Actor | Tipo (humano / sistema externo) | Descripción |
|-------|----------------------------------|-------------|
| **Estudiante** | Humano | Estudiante de educación superior foráneo que explora alojamientos, envía solicitudes formales y coordina su llegada. |
| **Dueño de Pensión** | Humano | Arrendador o administrador del inmueble que recibe postulaciones móviles, aprueba o rechaza cupos y entrega habitaciones. |
| **Servicio Push (FCM)** | Sistema externo | Plataforma Firebase Cloud Messaging encargada de despachar alertas en tiempo real a los dispositivos móviles de estudiantes y dueños. |
| **Servicio Criptográfico QR** | Sistema externo | Entidad de firma digital encargada de emitir y verificar sellos criptográficos asimétricos para validación de fichas sin conexión a internet. |

## Diagrama de casos de uso

![Casos de uso](./diagramas/casos-de-uso.png)

Archivo fuente: [`./diagramas/casos-de-uso.puml`](./diagramas/casos-de-uso.puml)

## Casos de uso y su origen

| ID | Caso de uso (objetivo del actor) | Actor principal | Historia de origen |
|----|-----------------------------------|-----------------|---------------------|
| **CU-01** | Filtrar catálogo de alojamientos | Estudiante | [`HU-01`](./04-historias-usuario.md#hu-01--filtrar-catálogo-por-campus-precio-y-normas) |
| **CU-02** | Enviar solicitud formal de reserva | Estudiante | [`HU-02`](./04-historias-usuario.md#hu-02--enviar-solicitud-formal-de-reserva) |
| **CU-02A** | Validar datos y disponibilidad *(<<include>>)* | Sistema | [`HU-02`](./04-historias-usuario.md#hu-02--enviar-solicitud-formal-de-reserva) |
| **CU-03** | Resolver postulación de reserva | Dueño de Pensión | [`HU-03`](./04-historias-usuario.md#hu-03--revisar-solicitud-y-resolver-postulación-desde-el-móvil) |
| **CU-03A** | Bloquear cupo en catálogo *(<<include>>)* | Sistema | [`HU-03`](./04-historias-usuario.md#hu-03--revisar-solicitud-y-resolver-postulación-desde-el-móvil) |
| **CU-03B** | Sugerir pensiones alternativas *(<<extend>>)* | Sistema | [`HU-03`](./04-historias-usuario.md#hu-03--revisar-solicitud-y-resolver-postulación-desde-el-móvil) |
| **CU-04** | Descargar comprobante oficial de reserva | Estudiante | [`HU-04`](./04-historias-usuario.md#hu-04--recibir-confirmación-y-coordinar-llegada-por-chat) |
| **CU-04A** | Generar firma digital QR offline *(<<include>>)* | Sistema | [`HU-04`](./04-historias-usuario.md#hu-04--recibir-confirmación-y-coordinar-llegada-por-chat) |
| **CU-05** | Coordinar llegada mediante chat integrado | Estudiante / Dueño | [`HU-04`](./04-historias-usuario.md#hu-04--recibir-confirmación-y-coordinar-llegada-por-chat) |
