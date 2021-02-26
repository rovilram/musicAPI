"use strict";

//------------------------------------------------------------------
//numQuestions = getNumQuestions(maxNum)
//Mira si en la URL viene dado un valor de preguntas 
//sino da un valor predefinido.
//el máximo puede ser maxNum (longitud del array questions)
//el mínimo puede ser 1
const getNumQuestions = (maxNum) => {
    let numQuestions;
    //vemos si en el URL nos dicen cuantas preguntas usar:
    if (!isNaN(window.location.search.split("=")[1])) {
        numQuestions = parseInt(window.location.search.split("=")[1]);
    }
    else numQuestions = 5; //predeterminado 5
    if (numQuestions < 1) {
        numQuestions = 1;
    }
    else if (numQuestions > maxNum) {
        numQuestions = maxNum;
    }
    return numQuestions;
}
//------------------------------------------------------------------
// question = randomizeAnswer(question);
// devuelve el mismo objeto pero mezclando las respuestas
const randomizeAnswer = (question) => {
    let array = question.answers;
    //para modificar la respuesta válida si cambiamos su orden
    let validAnswer = question.validAnswer;

    //mezclamos sin usar el método Array.sort()
    for (let i = 0; i < array.length - 1; i++) {
        if (Math.random() > 0.5) {
            [array[i], array[i + 1]] = [array[i + 1], array[i]];
            question.answers = array;
            //modificamos la posición de la respuesta válida
            if (validAnswer === i + 1) {
                validAnswer = i;
            }
            else if (validAnswer === i) {
                validAnswer = i + 1;
            }
            question.validAnswer = validAnswer;
        }
    }

    return question;
}

//------------------------------------------------------------------
//returnQuestions = getQuestions(questions, num)
//devuelve tantas preguntas como pasemos en el parámetro "num"
//de entre el array de preguntas que le pasemos.
const getQuestions = (questions, num) => {
    const returnQuestions = [];
    let randomQuestion;//índice generado aleatoriamente

    for (let i = 0; i < num; i++) {
        do {
            randomQuestion = Math.floor(Math.random() * questions.length);
        }
        //hacerlo mientras no encuentre una pregunta que no esté ya añadida
        while (returnQuestions.includes(questions[randomQuestion]));
        //guarda la pregunta aleatoria y mezcla sus respuestas
        returnQuestions[i] = randomizeAnswer(questions[randomQuestion]);
    }
    return returnQuestions;
}


//------------------------------------------------------------------
//HTMLnode=createNode(tipo, message, className, container)
// Crea un nuevo nodo HTML del tipo htmlElement
//si queremos lo mete dentro del elemento que le pasemos en container
//El parametro htmlAttributes es un objeto que tiene como propiedades
//los atributos css (con el nombre que usaríamos en JS) que queramos cambiar
//devuelve el nodo creado por si lo queremos usar
const createNode = (htmlElement, htmlAttributes, container) => {
    
    const HTMLnode = document.createElement(htmlElement);

    Object.entries(htmlAttributes).forEach(([key, val]) => {
        HTMLnode[key] = val;
    })
    if (container) {
        container.appendChild(HTMLnode);
    }
        return HTMLnode;
}

//------------------------------------------------------------------
// questionHTML=generateForm(question)
// hace el nodo del formulario de una pregunta y lo devuelve
const generateForm = (question) => {

    const questionHTML = createNode("form", {
        className: "quizForm invisible",
        name: `quID_${question.questionID}`
    });


    //creamos el título de cada pregunta
    const titleHTML = createNode("p", {
        className: "title",
        innerText: question.title
    });

    //creamos un wrapper para el título y lo añadimos dentro
    const titleWrapper = createNode("div", {
        id: "titleWrapper"
    });
    titleWrapper.appendChild(titleHTML);

    //añadimos el wrapper al formulario
    questionHTML.appendChild(titleWrapper);

    const submitBtnHTML = createNode("input", {
        className: "hidden",
        id: "questionBtn",
        type: "submit",
        value: "Corregir Pregunta"
    });
    questionHTML.appendChild(submitBtnHTML);

    return questionHTML;
}


//------------------------------------------------------------------
//answersHTML = generateAnswers(question)
//creamos un nodo que contiene las label e input de cada pregunta
//y lo devolvemos
function generateAnswers(question) {
    const answers = question.answers;

    const answersHTML = createNode("div", { id: "answersWrapper" });


    const subDivArray = [];
    //para empaquetar las preguntas de dos en dos
    for (let j = 0; j < answers.length / 2; j++) {
        subDivArray[j] = createNode("div", { className: "answersSubWraper" });
    }

    for (let i = 0; i < answers.length; i++) { //creamos el html de cada pregunta
        //vemos en que subWrapper hay que ponerlo:
        let subWrapper = Math.floor(i / 2);

        const answerWrapper = createNode("div", { className: "answerWrapper btn" });

        //creamos los input
        const answerHTMLinput = createNode("input", {
            className: "answerInput",
            type: "radio",
            name: `quID_${question.questionID}`,
            id: `answer_${i}`,
            value: i.toString()
        });


        //creamos las label
        const answerHTMLlabel = createNode("label", {
            innerText: answers[i],
            className: "answerLabel btn",
            htmlFor: `answer_${i}`
        });

        //los metemos en el wrapper de respuesta
        answerWrapper.appendChild(answerHTMLinput);
        answerWrapper.appendChild(answerHTMLlabel);

        //lo metemos en el subWrapper de respuesta que corresponde
        subDivArray[subWrapper].appendChild(answerWrapper);

        //unimos los subDivArray en answersHTML
        subDivArray.forEach(subDiv => {
            answersHTML.appendChild(subDiv)
        })
    }
    //devolvemos el nodo con todas las respuestas.
    return answersHTML;
}


//------------------------------------------------------------------
//va a generar el nodo HTML con el form de cada pregunta y lo va a añadir al documento.
//va a recibir las preguntas y un elemento del DOM donde luego añadir los nodos creados.
const generateHTML = (question, $parent) => {

    //llamamos a las funciones que hacen los nodos del formulario y de las respuestas
    const questionHTML = generateForm(question);
    const answersHTML = generateAnswers(question);

    //borramos el formulario anterior si existe
    if ($parent.querySelector(".quizForm")) {
        $parent.querySelector(".quizForm").remove();
    }

    //pegamos los nodos de las respuestas antes del botón que ya estaba generado en el nodo del formulario
    questionHTML
        .insertBefore(answersHTML, questionHTML.querySelector(".questionBtn"));

    //pegamos el nuevo nodo en el documento html
    $parent.appendChild(questionHTML);

}



//------------------------------------------------------------------
//return result = validateAnswer ($selectedInput, $selectedLabel, validAnswer)
const validateAnswer = ($selectedInput, $selectedLabel, validAnswer) => {
    const result = {};

    if ($selectedInput === null) {
        return false; //no se puede continuar mientras no elijan una respuesta (solo válida para versión con botón)
    }
    else {
        result.choiseAnswer = $selectedInput.value;
        if ($selectedInput.value == validAnswer) {
            $selectedLabel.parentNode.classList.remove("btn");
            $selectedLabel.parentNode.classList.add("valid");
            result.isRight = true;

        }
        else {
            $selectedLabel.parentNode.classList.remove("btn");
            $selectedLabel.parentNode.classList.add("invalid");
            result.isRight = false;
        }
        return result;
    }



}


//------------------------------------------------------------------
//printQuestion(quizQuestions, questionIndex, numQuestion, $formParent, $screenParent)
//va a generar el HTML del formulario y cambiar el texto en el div.footer
const printQuestion = (quizQuestions, questionIndex, $formParent, $screenParent) => {
    generateHTML(quizQuestions[questionIndex], $formParent);
    changeScreen($screenParent, questionIndex, quizQuestions.length);

    //para animación cuando se pinta la pregunta
    window.setTimeout(function () {
        document.querySelector(".quizForm").classList.remove("invisible");
    }, 100);


}

//------------------------------------------------------------------
//va a generar el nodo html de los resultados
//printResults = (results, $screenParent, $formParent)
const printResults = (results, $screenParent, $formParent) => {
    let points = 0;
    const totalPoints = results.length;
    const screen = createNode("div", {
        className: "quizForm resultScreen invisible"
    });
    const divResultsScreen = createNode("div", {
        className: "quizForm resultScreen invisible"
    });
    const divFinished = createNode("div", {
        className: "finished"
    });
    const divNewGame = createNode("div", {
        className: "finishedBtn newGame btn"
    });
    const divGoIndex = createNode("div", {
        className: "finishedBtn goIndex btn"
    });

    //vemos la puntuación obtenida
    results.forEach(result => {
        if (result.isRight) points++;
    });

    //eliminamos del DOM los formularios y footScreen anteriores
    if ($formParent.querySelector(".quizForm")) $formParent.querySelector(".quizForm").remove();
    if ($screenParent.querySelector(".footScreen")) $screenParent.querySelector(".footScreen").remove();

    //creamos los nodos del HTML
    createNode("h2", {
        innerText: "Partida finalizada",
        className: "finishedHeader"
    }, divFinished);

    createNode("span", {
        innerText: "has acertado",
        className: "finishedText"
    }, divFinished);

    createNode("div", {
        innerText: points.toString(),
        className: "finishedNumber"
    }, divFinished);

    createNode("span", {
        innerText: "de", className: "finishedText"
    }, divFinished);

    createNode("div", {
        innerText: totalPoints,
        className: "finishedNumber"
    }, divFinished);

    createNode("span", {
        innerText: "preguntas",
        className: "finishedText",
    }, divFinished);

    divResultsScreen.appendChild(divFinished);

    createNode("span", {
        innerText: "Jugar nueva partida",
        className: "finishedBtnText newGame"
    }, divNewGame);

    createNode("span", {
        innerText: "Volver al inicio",
        className: "finishedBtnText goIndex"
    }, divGoIndex);

    divResultsScreen.appendChild(divNewGame);
    divResultsScreen.appendChild(divGoIndex);

    $formParent.appendChild(divResultsScreen);
    $screenParent.appendChild(screen);

    //para animación cuando se pinta la pantalla de resultados
    window.setTimeout(function () {
        document.querySelector(".quizForm").classList.remove("invisible");
    })


}
//------------------------------------------------------------------
//changeScreen = ($div, questionIndex, numQuestions, message)
//cambia el screen del footer con datos sobre la evolución del juego
//TODO: PONER MENSAJE CADA VEZ QUE FALLAS O ACIERTAS. Para eso está el parámetro sin uso message
const changeScreen = ($div, questionIndex, numQuestions, message) => {
    const screen = createNode("div", {
        innerText: `Pregunta ${questionIndex + 1} de ${numQuestions}`,
        className: "footScreen"
    })

    //borrar el footscreen que había antes
    if ($div.querySelector(".footScreen")) {
        $div.querySelector(".footScreen").remove();
    }

    //añade el nuevo nodo como primer hijo del footer
    $div.insertAdjacentElement("afterbegin", screen);
}

