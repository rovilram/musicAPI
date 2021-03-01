# musicAPI
<https://rovilram.github.io/musicAPI/>


-- Modo normal --

Se pide implementar una SPA que muestre al usuario un buscador compuesto por una caja de texto y un botón de enviar, y al pinchar sobre él utilice los términos de búsqueda introducidos por el usuario para solicitar a una API remota pública una colección de datos relacionados con dichos términos de búsqueda.

Tras recibir los datos, la aplicación los mostrará en forma de listado, de manera que al pinchar el usuario en uno de los objetos listados, desaparecerá el buscador y el maestro, y se mostrará un detalle del objeto seleccionado, realizando otra petición a la API remota, y visualizando en pantalla los nuevos datos.

 (Al tratarse de una SPA, no debe haber recarga de página en ningún momento ni caso.)

-- Modo asiático --

- En la vista maestro, añadir un botón de "Limpiar", que borre todos los datos y los términos de búsqueda, reseteando así la búsqueda anterior.

- En la vista detalle, mostrar un botón de "Volver" atrás que de nuevo muestre el listado anterior, tal como estaba antes de mostrar el detalle.

NOTA: Para esta última acción, se realizará una nueva petición a la API (con los mismos términos de búsqueda), y se comprobará que lo recibido coincide con lo solicitado en la vez anterior, esto es, comparando los datos previamente recibidos y pintados en pantalla, con los nuevamente solicitados en esta segunda petición, y se pintarán solamente los nuevos, o se borrarán los desaparecidos. Es decir, lo que se pide es implementar un comportamiento de caché de los datos.

- BONUSTRACK: Que la búsqueda sea persistente, esto es, que al cerrar y abrir la pestaña, aparezcan los mismos resultados de la búsqueda anterior (si esta se realizó).

(Recordatorio: Se trata de una SPA, ergo NO debe haber recarga de página never.)