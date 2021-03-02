const pintarArray = (array, resultsNode) => {
    array.forEach(element => {
        const nodo = document.createElement("div");
        const textNode = document.createTextNode(element);
        nodo.appendChild(textNode)
        nodo.setAttribute("id", element);
        resultsNode.appendChild(nodo);
    });
}



const comparaArray = (array1, array2, resultNode) =>{
    addArray = array2.filter(el=>!array1.includes(el));

    console.log("PARA AÑADIR", addArray );


    removeArray = array1.filter(el=>!array2.includes(el));
    console.log("PARA BORRAR", removeArray);

    actualizarArray (addArray, removeArray, resultNode);
}



const actualizarArray = (addArray, removeArray, resultNode) => {

    //añadimos
    pintarArray(addArray, resultNode);

    //borramos
    removeArray.forEach(el=>document.querySelector(`#${el}`).remove())

}

let array1 = ["cadena1", "cadena2", "cadena3", "cadena4", "cadena5", "cadena6", "cadena7", "cadena8", "cadena9", "cadena10"];
let array2 = ["cadena1", "cadena2", "cadena3", "cadena4", "cadena5", "cadena6", "cadena7", "cadena8", "cadena9", "cadena11"];

const resultsNode = document.querySelector(".results");

pintarArray(array1, resultsNode);


document.querySelector("#btn").addEventListener(("click"), (e) => {
    console.log("CLICK");

    comparaArray(array1, array2, resultsNode);







})