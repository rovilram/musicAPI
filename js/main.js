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
            console.log("Obteniendo datos de LOCALSTORAGE", searchText);
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



    //Primero recuperamos los favoritos de firebase
    searchFav(searchText)
        .then(data => {
            let favData = [];
            let artistsData = [];
            //organizamos el objeto recibido para que sea igual
            //al recibido de localStorage y fetch
            favData = Object.keys(data).map(key => data[key]);

            //Consulta a caché (localStorage) 
            let cacheData = getCache(searchText);
            if (cacheData !== false) {
                //quitamos los resultados que están en favoritos
                cacheData = cacheData.filter(
                    cache => !favData.some(fav => fav.id === cache.id)
                )
                //unimos los datos de favoritos y caché
                artistsData = favData.concat(cacheData);
                paintArtists(artistsData, resultsDiv, API_DATA, searchText);
            }
            else {
                //si no está en caché hacemos el fetch
                fetchArtists(searchText, API_DATA)
                    .then(fetchData => {
                        //quitamos los resultados que están en favoritos
                        fetchData = fetchData.filter(
                            fetchD => !favData.some(fav => fav.id === fetchD.id)
                        )
                        //unimos los datos de favoritos y fetch
                        artistsData = favData.concat(fetchData);
                        paintArtists(artistsData, resultsDiv, API_DATA, searchText);
                    })
            }
        })

}

const fetchArtists = async (searchText, API_DATA) => {
    //RECURSO PARA HACER UN AWAIT DE UN FETCH https://dmitripavlutin.com/javascript-fetch-async-await/
    const headers = new Headers();
    // add headers
    headers.append(...API_DATA.header);
    const request = new Request(`${API_DATA.url}/database/search?q=${searchText}&token=${API_DATA.token}&type=artist&per_page=10`, {
        headers: headers
    });

    const response = await fetch(request);
    const dataArtists = await response.json();
    setCache(searchText, dataArtists.results);
    return await dataArtists.results;
}

const paintArtists = (dataArtists, resultsDiv, API_DATA, searchText) => {

    const newResultDiv = createNode("div", {
        className: "results"
    })

    dataArtists.map(artist => {

        const artistWrapper = createNode("div", {
            id: `divArtist${artist.id}`,
            className: "artistWrapper"
        }, newResultDiv)
        const artistFavBtnWrapper = createNode("div", {
            className: "artistFavBtnWrapper",   
        }, artistWrapper);
        const favBtn = createNode("Div", {
            className: "favBtn",
            innerHTML: '<i class="fas fa-heart"></i>' 
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
        //Botón favoritos
        favBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const favDiv = favBtn.closest(".artistWrapper");
            const parentDiv = favDiv.parentNode;
            if (favBtn.classList.contains("fav")) {
                //showMaster(searchText, newResultDiv, API_DATA);
                //No hace falta dibujar todo, solo lo cambiamos de sitio.
                const FavDivsBtn = parentDiv.querySelectorAll(".fav");
                const lastFavDivsBtn = FavDivsBtn[FavDivsBtn.length - 1]
                const lastFavDiv = lastFavDivsBtn.closest(".artistWrapper");
                lastFavDiv.after(favDiv);
                cleanFav(`artist${artist.id}`);
                favBtn.classList.remove("fav");

            }
            else {
                setFav(`artist${artist.id}`, artist);
                favBtn.classList.add("fav");
                //showMaster(searchText, newResultDiv, API_DATA);
                //No hace falta dibujar todo, solo lo cambiamos de sitio.
                parentDiv.prepend(favDiv)
            }

        })
        artistWrapper.addEventListener("click", () => {
            showDetail(dataArtists, artist.id, API_DATA, newResultDiv, searchText);
        })

    })
}

const showDetail = (artists, id, API_DATA, resultsDiv, searchText) => {

    const cache = getCache(`artist${id}`);

    if (cache !== false) {
        //TODO: Necesitamos API_DATA para el evento de click del botón. Ver como desacoplar
        paintArtist(artists, cache, resultsDiv, API_DATA, searchText);
    }
    else {
        fetchArtist(id, API_DATA)
            .then(artist =>
                paintArtist(artists, artist, resultsDiv, API_DATA, searchText)
            )
    }
}

const fetchArtist = async (id, API_DATA) => {
    const headers = new Headers();
    // add headers
    headers.append(...API_DATA.header);
    const request = new Request(`${API_DATA.url}artists/${id}?token=${API_DATA.token}`, {
        headers: headers
    });
    const response = await fetch(request);
    const artist = await response.json();

    setCache(`artist${id}`, artist);
    return await artist;
    /*       .then(response => response.json())
          .then(artist => {
              setCache(`artist${id}`, artist);
              return artist;
          }) */
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
        innerText: '<i class="fas fa-heart"></i>'
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
        artist.members.map(
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
        showMaster(searchText, newResultDiv, API_DATA);
    })

    //EVENTO BOTÓN FAVORITO
    favBtn.addEventListener("click", () => {
        if (favBtn.classList.contains("fav")) {
            cleanFav(`artist${artist.id}`);
            favBtn.classList.remove("fav");
        }
        else {
            //selecciono el artista del array artistas
            //para guardarlo en favoritos para el listado maestro.
            const myArtist = artists.filter(el => el.id === artist.id)[0];
            setFav(`artist${artist.id}`, myArtist);
            favBtn.classList.add("fav");
        }
    })
}



const showDiscography = (id, API_DATA, resultsDiv) => {


    const cache = getCache(`discos${id}`);

    if (cache !== false) {
        paintDiscography(cache.data, resultsDiv);
    }
    else {
        fetchDisco(id, API_DATA, resultsDiv);
    }

}


const fetchDisco = (id, API_DATA, resultsDiv) => {
    const headers = new Headers();
    // add headers
    headers.append('User-Agent', 'musicAPIs v0.1 https://rovilram.github.io/musicAPI/');
    const request = new Request(`${API_DATA.url}/artists/${id}/releases?token=${API_DATA.token}&sort=year`, {
        headers: headers
    });
    fetch(request)
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


//------------------------------------MAIN------------------------------------
const d = document;

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