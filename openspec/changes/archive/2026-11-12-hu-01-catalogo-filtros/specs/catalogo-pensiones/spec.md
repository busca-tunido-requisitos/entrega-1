## ADDED Requirements

### Requirement: Catálogo filtrado por sede universitaria y rango de precio
El sistema DEBE (MUST) mostrar únicamente las pensiones que tengan al menos una habitación en estado `Disponible`, cuya sede universitaria seleccionada esté dentro del radio de búsqueda (2 km por defecto, ampliable) y cuyo precio mensual esté dentro del rango indicado. La lista y el mapa DEBEN mostrar el mismo conjunto de pensiones, ordenadas por distancia ascendente desde la sede y, a igual distancia, por precio ascendente. Al modificar cualquier filtro, la lista y el mapa DEBEN actualizarse sin recargar la página.

#### Scenario: Filtrado exitoso de pensiones por sede universitaria y rango de precio
- **WHEN** existen pensiones universitarias con habitaciones disponibles en el sector del campus seleccionado, el estudiante foráneo define un rango de precio mensual entre $150.000 y $250.000 y solicita el catálogo filtrado para dicho campus y rango de precio
- **THEN** el catálogo despliega únicamente las pensiones que cumplen ambos criterios
- **THEN** las propiedades se ordenan por proximidad geográfica a la sede universitaria

### Requirement: Aviso y sugerencias cuando no hay coincidencias
Cuando ningún resultado cumpla los filtros de sede, precio y normas de convivencia, el sistema DEBE (MUST) indicar que no se encontraron habitaciones disponibles con ese criterio y DEBE sugerir ampliar el radio de búsqueda geográfica o flexibilizar las normas seleccionadas.

#### Scenario: Búsqueda sin coincidencias por restricciones excesivas de convivencia
- **WHEN** no existen pensiones disponibles que permitan mascotas en un radio de 2 kilómetros del campus y el estudiante activa el filtro de convivencia "Permite mascotas"
- **THEN** el catálogo indica que no se encontraron habitaciones disponibles con ese criterio
- **THEN** sugiere ampliar el radio de búsqueda geográfica o flexibilizar las normas seleccionadas
