"use strict";
//------------------------------------FUNCTIONS------------------------------------
const API_DATA = {
    token: "UTtvCaiWDvNQrjQUXmBqZncsMQzXXMrrsOvlTujQ",
    url: "https://api.discogs.com/",
    header: ['User-Agent', 'musicAPIs v0.1 https://rovilram.github.io/musicAPI/']
}

//let backHistory = {};

const getCache = (searchText) => {
    if (localStorage) {
        const cache = JSON.parse(localStorage.getItem(searchText));
        if (cache != null) {
            //hay datos y los devuelvo
            console.log("CACHE", searchText);
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

const showMaster = (searchText, resultsDiv, API_DATA) => {

    let favData = [];
    let artistsData = [];
    let fetchData = [];

    //Primero recuperamos los favoritos de firebase
    console.log("searchText", searchText)
    searchFav(searchText)
        .then(data => {
            favData = Object.keys(data).map(key => data[key]);
            console.log("favData", favData)
            //Consulta a caché (localStorage) 
            let cacheData = getCache(searchText);
            console.log("objeto CACHE", cacheData);
            if (cacheData !== false) {
                cacheData = cacheData.filter(
                        cache => !favData.some(fav => fav.id === cache.id)
                    )

                artistsData = favData.concat(cacheData);
                console.log("artistsData", artistsData)
            }
            else {
                fetchData = fetchArtists(searchText, API_DATA);
                fetchData = fetchData.filter (
                    fetchD => !favData.some(fav => fav.id === fetchD.id)
                )
                artistsData = favData.concat(fetchData);
            }

            paintArtists(artistsData, resultsDiv, API_DATA, searchText); //TODO: Necesitamos API_DATA para el evento de click del botón. Ver como desacoplar
        })


    /*         .then(
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
            ) */



}

const fetchArtists = (searchText, API_DATA) => {

    const headers = new Headers();
    // add headers
    headers.append(...API_DATA.header);
    const request = new Request(`${API_DATA.url}/database/search?q=${searchText}&token=${API_DATA.token}&type=artist&per_page=10`, {
        headers: headers
    });

    fetch(request)
        .then(response => {
            console.log("HEADER", response.headers);
            return response.json()
        })
        .then(data => {
            const dataArtists = data.results;
            console.log("objeto fetch", dataArtists)

            setCache(searchText, dataArtists);
            /*backHistory = {
                            searchText: searchText,
                            resultsArray: dataArtists
            } */
            //localStorage.setItem("backHistory", JSON.stringify(backHistory));
            //console.log("backHistory Guardado:", JSON.parse(localStorage.getItem("backHistory")));

            return dataArtists;

        });
}

const paintArtists = (dataArtists, resultsDiv, API_DATA, searchText) => {

    const newResultDiv = createNode("div", {
        className: "results"
    })

    dataArtists.forEach(artist => {

        const artistWrapper = createNode("div", {
            id: `divArtist${artist.id}`,
            className: "artistWrapper"
        }, newResultDiv)
        const artistFavBtnWrapper = createNode("div", {
            className: "artistFavBtnWrapper",
        }, artistWrapper);
        const favBtn = createNode("Div", {
            className: "favBtn",
            innerText: "Favorito"
        }, artistFavBtnWrapper);
        //si es favorito marca el botón como favorito
        getFav(`artist${artist.id}`)
            .then(id => favBtn.classList.add("fav"))
            .catch(err => null); //no quiero tratar el error y no quiero que salga en consola
        createNode("div", {
            className: "artistName",
            innerText: artist.title
        }, artistWrapper);
        createNode("img", {
            className: "artistPic",
            src: (artist.thumb) ? artist.thumb : "https://via.placeholder.com/150x150.png?text=NO+PHOTO"
        }, artistWrapper);

        resultsDiv.replaceWith(newResultDiv);


        //Eventos
        artistWrapper.addEventListener("click", e => {
            if (e.target === favBtn) {
                getFav(`artist${artist.id}`)
                    .then(data => {
                        console.log("YA ESTA GUARDADO COMO FAVORITO", `artist${artist.id}`, data);
                        cleanFav(`artist${artist.id}`);
                        console.log("BORRANDO", `artist${artist.id}`);
                        favBtn.classList.remove("fav");
                        showMaster(searchText, newResultDiv, API_DATA);
                        console.log("FUERA")
                    })
                    .catch(err => {
                        //añadimos en el objeto a guardar un campo para poder buscar en Firebase (no tiene búsqueda caseinsensitive)
                        artist.titleSearch = artist.title.toLowerCase();
                        console.log("NO ESTÁ GUARDADO", `artist${artist.id}`, err);
                        setFav(`artist${artist.id}`, artist);
                        console.log("GUARDANDO", `artist${artist.id}`);
                        favBtn.classList.add("fav");
                        showMaster(searchText, newResultDiv, API_DATA);
                        console.log("FUERA")
                    })
            }
            else if (e.target === artistWrapper) {
                showDetail(dataArtists, artist.id, API_DATA, newResultDiv, searchText);
            }

        })



    });



}



const showDetail = (artists, id, API_DATA, resultsDiv, searchText) => {


    const cache = getCache(`artist${id}`);
    /*         .then(cache => {
                console.log("Recogiendo datos de FIREBASE", `artist${id}`)
                paintArtist(cache, resultsDiv, API_DATA);; //TODO: Necesitamos API_DATA para el evento de click del botón. Ver como desacoplar
            })
            .catch(error => {
                console.log(error, `artist${id}`);
                fetchArtist(id, API_DATA, resultsDiv);
            }) */

    if (cache !== false) {
        paintArtist(artists, cache, resultsDiv, API_DATA, searchText); //TODO: Necesitamos API_DATA para el evento de click del botón. Ver como desacoplar
    }
    else {
        fetchArtist(artists, id, API_DATA, resultsDiv, searchText);
    }


}


const fetchArtist = (artists, id, API_DATA, resultsDiv, searchText) => {
    const headers = new Headers();
    // add headers
    headers.append('User-Agent', 'musicAPIs v0.1 https://rovilram.github.io/musicAPI/');
    const request = new Request(`https://api.discogs.com/artists/${id}?token=${API_DATA.token}`, {
        headers: headers
    });
    fetch(request)
        .then(response => {
            return response.json()
        })
        .then(artist => {
            setCache(`artist${id}`, artist);
            paintArtist(artists, artist, resultsDiv, API_DATA, searchText);
        })
}

const paintArtist = (artists, artist, resultsDiv, API_DATA, searchText) => {
    const newResultDiv = createNode("div", {
        className: "results",
    });

    const detailBtnWrapper = createNode("Div", {
        className: "detailBtnWrapper",
    }, newResultDiv)

    const backBtn = createNode("Div", {
        className: "backBtn",
        innerText: "Regresar"
    }, detailBtnWrapper);

    const favBtn = createNode("Div", {
        className: "favBtn",
        innerText: "Favorito"
    }, detailBtnWrapper);
    //si es favorito marca el botón como favorito
    getFav(`artist${artist.id}`)
        .then(id => favBtn.classList.add("fav"))
        .catch(err => null); //no quiero tratar el error y no quiero que salga en consola

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
    backBtn.addEventListener("click", () => {
        //newResultDiv.replaceWith(resultsDiv);
        showMaster(searchText, newResultDiv, API_DATA);



        //Aqui vamos a hacer la implementación de la caché
        //        newCachedSearch(API_DATA, resultsDiv, backHistory);

    })

    //EVENTO BOTÓN FAVORITO
    favBtn.addEventListener("click", () => {
        getFav(`artists${artist.id}`)
            .then(data => {
                console.log("YA ESTA GUARDADO COMO FAVORITO", `artists${artist.id}`, data);
                cleanFav(`artist${artist.id}`);
                console.log("BORRANDO", `artists${artist.id}`);
                favBtn.classList.remove("fav");

            })
            .catch(err => {
                console.log("NO ESTÁ GUARDADO", `artists${artist.id}`, err);
                //selecciono el artista del array artistas
                //para guardarlo en favoritos para el listado maestro.
                const myArtist = artists.filter(el => el.id === artist.id)[0];
                //añadimos en el objeto a guardar un campo para poder buscar en Firebase (no tiene búsqueda caseinsensitive)
                setFav(`artist${artist.id}`, myArtist);
                console.log("GUARDANDO", `artist${artist.id}`);
                favBtn.classList.add("fav");



            })
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


    const cache = getCache(`discos${id}`);

    if (cache !== false) {
        paintDiscography(cache.data, resultsDiv);
    }
    else {
        fetchDisco(id, API_DATA, resultsDiv);
    }



    /*     .then(
            cache => {
                console.log(cache)
 
                console.log("Recogiendo datos de FIREBASE", cache.data)
                paintDiscography(cache.data, resultsDiv); //TODO: Necesitamos API_DATA para el evento de click del botón. Ver como desacoplar
            }
        )
 
        .catch(error => {
            console.log(error, `discos${id}`);
            fetchDisco(id, API_DATA, resultsDiv);
        })
 */
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
            return response.json()
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

//------------------------------------MAIN------------------------------------
const d = document;
//TODO: Usar localStorage para guardar el estado actual de la web
//if (localStorage) console.log("OK LOCALSTORAGE")

//------------------------------------EVENTS------------------------------------
d.querySelector(".searchBtn").addEventListener("click", () => {
    const resultsDiv = d.querySelector(".results");
    const searchText = d.querySelector(".searchInput").value;
    d.querySelector(".searchSection").classList.add("masterVersion");
    showMaster(searchText, resultsDiv, API_DATA)

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