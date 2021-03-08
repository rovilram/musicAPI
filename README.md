# musicAPI
<https://rovilram.github.io/musicAPI/>


## FUNCIONALIDADES:
* Búsqueda de bandas musicales, obteniendo un listado maestro que nos lleva a un listado detalle.
* Todo carga en SPA
* botón de regreso de detalle a maestro, y para volver a estado inicial la aplicación.
* Persistencia de datos (caché) en localStorage para evitar fetch innecesarios
* botón de borrado de datos de caché localStorage
* Permite elección de favoritos de bandas en listado maestro y también en listado detalle.
* Persistencia de datos de favoritos en Firebase (de todo el objeto que permita pintarlo en el listado maestro)
* Los Favoritos en el listado maestro van a aparecer encima del resto de búsqueda
* Al pulsar en botón favoritos de vista maestro se hace un "caché de escritura" que no pinta todos los datos de nuevo, sino que elimina de la vista el elemento y lo reubica en el DOM en un sitio u otro en función de si es favorito o no.

## TODO:
* refactorizar
* refactorizar CSS y aplicar mobile first
* Hacer caché de repintado (si se actualiza un listado maestro no lo borramos del todo, solo quitamos los elementos que ya no necesitamos en la nueva búsqueda, y ponemos los nuevos)
* Mejorar función searchFav ya que ahora estamos haciendo el filtrado en frontend, ya que no entiendo como hacer una búsqueda en firebase;

## REQUISITOS
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
