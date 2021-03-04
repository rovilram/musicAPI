# musicAPI
<https://rovilram.github.io/musicAPI/>

(cambio requisitos 04/03/21)
-- Modo normal --

Se pide implementar una SPA que muestre al usuario un buscador compuesto por una caja de texto y un botón de enviar, y al pinchar sobre él utilice los términos de búsqueda introducidos por el usuario para solicitar a una API remota pública una colección de datos relacionados con dichos términos de búsqueda.

Tras recibir los datos, la aplicación los mostrará en forma de listado, de manera que al pinchar el usuario en uno de los objetos listados, desaparecerá el buscador y el maestro, y se mostrará un detalle del objeto seleccionado, realizando otra petición a la API remota, y visualizando en pantalla los nuevos datos.

(Al tratarse de una SPA, no debe haber recarga de página en ningún momento ni caso.)

-- Modo asiático --

- En la vista maestro, añadir un botón de "Limpiar", que borre todos los datos y los términos de búsqueda, reseteando así la búsqueda anterior.

- En la vista detalle, mostrar un botón de "Volver" atrás que de nuevo muestre el listado anterior, tal como estaba antes de mostrar el detalle.

NOTA: Para esta última acción, si es la misma búsqueda no se realizará una nueva petición a la API, sino que se repintarán a partir de lo que tengo previamente guardado de la búsqueda anterior.

Si no es la misma búsqueda, entonces se hará una nueva petición a la API.

Es decir, lo que se pide es implementar un comportamiento de caché de los datos.

- BONUSTRACK: Que la búsqueda sea persistente, esto es, que al cerrar y abrir la pestaña, aparezcan los mismos resultados de la búsqueda anterior (si esta se realizó).

(Recordatorio: Se trata de una SPA, ergo NO debe haber recarga de página never.)

-- Modo infierno --

Añadir en la vista detalle un botón de "Guardar en/Quitar de favoritos" que almacene/borre en/de Firebase los datos de ese detalle.

En la vista maestro, deben aparecer primero los favoritos y luego el resto.