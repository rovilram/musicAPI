"use strict";
//------------------------------------FUNCTIONS------------------------------------
const API_DATA = {
    token: "UTtvCaiWDvNQrjQUXmBqZncsMQzXXMrrsOvlTujQ",
    url: "https://api.discogs.com/",
    header: ['User-Agent', 'musicAPIs v0.1 https://rovilram.github.io/musicAPI/']
}

// const API_TOKEN = "fNluMyNocCgjQNKAiyOmdWcUTVVfhHEfOTFNBIrT";
// const API = "https://api.discogs.com/"
let backHistory = {};
/* 

const getCache = (searchText) => {
    if (localStorage) {
        const cache = JSON.parse(localStorage.getItem(searchText));
        if (cache != null) {
            //hay datos y los devuelvo
            console.log("CACHE", searchText, cache);
            return cache;
        }
        else {
            //no hay datos
            return false;
        }
    }
    else return false;
}


const setCache = (searchText, data) => {
    if (localStorage) {
        console.log(`Datos de "${searchText}" guardados en LOCALSTORAGE`);
        return localStorage.setItem(searchText, JSON.stringify(data));
    }
};

const clearCache = () => localStorage.clear();

 */





const clearCache = () => localStorage.clear();






const showMaster = (searchText, resultsDiv, API_DATA, backHistory) => {

    //    const cache = 
    getCache(searchText)
        .then(
            cache => {
                console.log("Recogiendo datos de FIREBASE", searchText)
                paintArtists(cache.data, resultsDiv, API_DATA); //TODO: Necesitamos API_DATA para el evento de click del botón. Ver como desacoplar
            }
        )
        .catch(
            error => {
                console.log(error, searchText);
                fetchArtists(searchText, resultsDiv, API_DATA);
            }
        )


    /*     console.log("CACHEEEEER", cache)
        if (cache !== false) {
            paintArtists(cache, resultsDiv, API_DATA); //TODO: Necesitamos API_DATA para el evento de click del botón. Ver como desacoplar
        }
        else {
            fetchArtists(searchText, resultsDiv, API_DATA);
        } */


}

const fetchArtists = (searchText, resultsDiv, API_DATA) => {

    const headers = new Headers();
    // add headers
    headers.append(...API_DATA.header);
    const request = new Request(`${API_DATA.url}/database/search?q=${searchText}&token=${API_DATA.token}&type=artist&per_page=10`, {
        headers: headers
    });

    fetch(request)
        .then(response => response.json())
        .then(data => {
            const dataArtists = data.results;
            setCache(searchText, dataArtists);
            /*backHistory = {
                            searchText: searchText,
                            resultsArray: dataArtists
            } */
            //localStorage.setItem("backHistory", JSON.stringify(backHistory));
            //console.log("backHistory Guardado:", JSON.parse(localStorage.getItem("backHistory")));

            paintArtists(dataArtists, resultsDiv, API_DATA); //TODO: Necesitamos API_DATA para el evento de click del botón. Ver como desacoplar

        });
}

const paintArtists = (dataArtists, resultsDiv, API_DATA) => {

    const newResultDiv = createNode("div", {
        className: "results"
    })

    dataArtists.forEach(artist => {

        const artistWrapper = createNode("div", {
            id: `divArtist${artist.id}`,
            className: "artistWrapper"
        })
        createNode("div", {
            className: "artistName",
            innerText: artist.title
        }, artistWrapper);
        createNode("img", {
            className: "artistPic",
            src: (artist.thumb) ? artist.thumb : "https://via.placeholder.com/150x150.png?text=NO+PHOTO"
        }, artistWrapper);

        newResultDiv.appendChild(artistWrapper);

        resultsDiv.replaceWith(newResultDiv);

        //Definimos aquí el evento que lleva al artista.    
        d.querySelector(`#divArtist${artist.id}`).addEventListener("click", function () {
            showDetail(artist.id, API_DATA, newResultDiv);
        })
    });



}



const showDetail = (id, API_DATA, resultsDiv, backHistory) => {


    getCache(`artist${id}`)
        .then(cache => {
            console.log("Recogiendo datos de FIREBASE", `artist${id}`)
            paintArtist(cache, resultsDiv, API_DATA);; //TODO: Necesitamos API_DATA para el evento de click del botón. Ver como desacoplar
        })
        .catch(error => {
            console.log(error, `artist${id}`);
            fetchArtist(id, API_DATA, resultsDiv);
        })


}


const fetchArtist = (id, API_DATA, resultsDiv) => {
    const headers = new Headers();
    // add headers
    headers.append('User-Agent', 'musicAPIs v0.1 https://rovilram.github.io/musicAPI/');
    const request = new Request(`https://api.discogs.com/artists/${id}?token=${API_DATA.token}`, {
        headers: headers
    });
    fetch(request)
        .then(response => {
            console.log(response)
            response.json()
        })
        .then(artist => {
            setCache(`artist${id}`, artist);
            paintArtist(artist, resultsDiv, API_DATA);
        })
}

const paintArtist = (artist, resultsDiv, API_DATA) => {
    const newResultDiv = createNode("div", {
        className: "results",
    });

    const detailBtn = createNode("Div", {
        className: "detailBtn",
        innerText: "Regresar"
    }, newResultDiv);

    createNode("h2", {
        className: "artistData",
        innerText: artist.name,
    }, newResultDiv);

    createNode("img", {
        className: "ArtistData Pic",
        src: (artist.images) ? artist.images[0].uri : "https://via.placeholder.com/150x150.png?text=NO+PHOTO"
    }, newResultDiv);
    //BIOGRAFÍA
    const bioWrapper = createNode("div", {
        className: "bioWrapper"
    })
    createNode("h3", {
        className: "bioTitle",
        innerText: "Biografía"
    }, bioWrapper)
    createNode("div", {
        className: "artistData profile",
        innerText: artist.profile
    }, bioWrapper);
    newResultDiv.appendChild(bioWrapper);

    //FORMACIÓN
    if (artist.members) {

        const membersDiv = createNode("div", {
            className: "artistData members",
        });
        createNode("h3", {
            className: "membersTitle",
            innerText: "Formación"
        }, membersDiv);
        artist.members.forEach(
            member => {
                createNode("div", {
                    className: "artistData member",
                    innerText: member.name
                }, membersDiv)
            }
        );
        newResultDiv.appendChild(membersDiv);
    }
    resultsDiv.replaceWith(newResultDiv);
    showDiscography(artist.id, API_DATA, newResultDiv);



    //EVENTO BOTÓN REGRESAR
    detailBtn.addEventListener("click", () => {
        newResultDiv.replaceWith(resultsDiv);

        //Aqui vamos a hacer la implementación de la caché
        //        newCachedSearch(API_DATA, resultsDiv, backHistory);

    })




}

const compareArrays = (oldArray, newArray) => {

    console.log("VIEJO", oldArray);
    console.log("NUEVO", newArray);

    const addsArray = newArray.filter(elnew => !oldArray.some(elold => elold.id === elnew.id));
    const delsArray = oldArray.filter(elold => !newArray.some(elnew => elold.id === elnew.id));

    console.log("AÑADIR", addsArray);
    console.log("QUITAR", delsArray);

    return [addsArray, delsArray];
}

const newCachedSearch = (API_DATA, resultsDiv, backHistory) => {

    //hacemos una nueva consulta a la API para ver si hay cambios
    //vamos a simular que hay menos datos empleando una búsqueda que recoja menos datos de la API
    console.log(backHistory)


    const headers = new Headers();
    // add headers
    headers.append('User-Agent', 'musicAPIs v0.1 https://rovilram.github.io/musicAPI/');
    const request = new Request(`${API_DATA.url}/database/search?q=${backHistory.searchText}&token=${API_DATA.token}&type=artist&per_page=5`, {
        headers: headers
    });
    const response = fetch(request)
        .then(response => response.json())
        .then(data => {
            const newDataArtists = data.results;

            const [addsArray, delsArray] = compareArrays(backHistory.resultsArray, newDataArtists);

            console.log("DELS ARRAY", delsArray)

            //quitamos elementos desactualizados
            delsArray.forEach(el => resultsDiv.querySelector(`#divArtist${el.id}`).remove())

            //añadimos los nuevos elementos
            //TODO: ME HE QUEDADO POR AQUI. VER COMO HACER QUE ME AÑADA LOS NUEVOS. HAY QUE FORZAR UN NUEVO ELEMENTO





        })
    console.log("RESPONSE:", response);
}


const showDiscography = (id, API_DATA, resultsDiv) => {


    getCache(`discos${id}`)
        .then(
            cache => {
                console.log("Recogiendo datos de FIREBASE", cache.data)
                paintDiscography(cache.data, resultsDiv); //TODO: Necesitamos API_DATA para el evento de click del botón. Ver como desacoplar
            }
        )

        .catch(error => {
            console.log(error, `discos${id}`);
            fetchDisco(id, API_DATA, resultsDiv);
        })

}


const fetchDisco = (id, API_DATA, resultsDiv) => {
    const headers = new Headers();
    // add headers
    headers.append('User-Agent', 'musicAPIs v0.1 https://rovilram.github.io/musicAPI/');
    const request = new Request(`${API_DATA.url}/artists/${id}/releases?token=${API_DATA.token}&sort=year`, {
        headers: headers
    });
    const response = fetch(request)
        //obtenemos la discografía
        .then(response => {
            console.log(response)
            response.json()
        })
        .then(releases => {
            const discography = releases.releases;
            setCache(`discos${id}`, discography);

            paintDiscography(discography, resultsDiv);
        })
}


const paintDiscography = (discography, resultsDiv) => {
    if (discography) {

        const discosWrapper = createNode("div", {
            className: "discosWrapper"
        })

        createNode("h3", {
            className: "discosTitle",
            innerText: "Discografía"
        }, discosWrapper)


        discography.forEach(disco => {
            const discoWrapper = createNode("div", {
                className: "discoWrapper"
            });
            createNode("div", {
                className: "discoTitle",
                innerText: disco.title
            }, discoWrapper)

            createNode("div", {
                className: "discoYear",
                innerText: disco.year
            }, discoWrapper)

            createNode("img", {
                className: "discoPic",
                src: (disco.thumb) ? disco.thumb : "https://via.placeholder.com/150x150.png?text=NO+PHOTO"
            }, discoWrapper)
            discosWrapper.appendChild(discoWrapper)
        })

        resultsDiv.appendChild(discosWrapper);
    }

}


/* const getCache = (searchText) =>  {

    return  localStorage.getItem(searchText);

}

const setCache = (searchText, searchObject) {

    localStorage.setItem(searchText, searchObject);

} */

//------------------------------------MAIN------------------------------------
const d = document;
//TODO: Usar localStorage para guardar el estado actual de la web
//if (localStorage) console.log("OK LOCALSTORAGE")

//------------------------------------EVENTS------------------------------------
d.querySelector(".searchBtn").addEventListener("click", () => {
    const resultsDiv = d.querySelector(".results");
    const searchText = d.querySelector(".searchInput").value;
    d.querySelector(".searchSection").classList.add("masterVersion");
    showMaster(searchText, resultsDiv, API_DATA, backHistory)

})
d.querySelector(".cleanBtn").addEventListener("click", () => {
    const resultsDiv = d.querySelector(".results");
    const newResultsDiv = createNode("div", {
        className: "results",
    })
    resultsDiv.replaceWith(newResultsDiv);
    d.querySelector(".searchSection").classList.remove("masterVersion");
    d.querySelector(".searchInput").value = "";
})

d.querySelector(".cacheBtn").addEventListener("click", () => {
    console.log("CLEAR CACHE")
    clearCache();
})


d.querySelector(".searchInput").addEventListener("keyup", (e) => {
    if (e.key === "Enter") d.querySelector(".searchBtn").click();
})