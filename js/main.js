"use strict";
//------------------------------------FUNCTIONS------------------------------------
/* const API_DATA = {
    token: "UTtvCaiWDvNQrjQUXmBqZncsMQzXXMrrsOvlTujQ",
    url: "https://api.discogs.com/",
    header: ['User-Agent', 'musicAPIs v0.1 https://rovilram.github.io/musicAPI/']
} */

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

const showMaster = (searchText, resultsDiv) => {



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
                paintArtists(artistsData, resultsDiv, searchText);
            }
            else {
                //si no está en caché hacemos el fetch
                const api = new DiscogsAPI;
                api.fetchArtists(searchText)
                    .then(artistsData => {
                        //guardamos en caché los datos
                        setCache(searchText, artistsData);
                        //quitamos los resultados que están en favoritos
                        artistsData = artistsData.filter(
                            fetchD => !favData.some(fav => fav.id === fetchD.id)
                        )
                        //unimos los datos de favoritos y fetch
                        artistsData = favData.concat(artistsData);
                        paintArtists(artistsData, resultsDiv, searchText);
                    })
            }
        })

}


const paintArtists = (dataArtists, resultsDiv, searchText) => {

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


        if (logged) {
            const favBtn = createNode("Div", {
                className: "favBtn",
                innerHTML: '<i class="fa fa-heart"></i>'
            }, artistFavBtnWrapper);
            //si es favorito marca el botón como favorito
            getFav(`artist${artist.id}`)
                .then(id => favBtn.classList.add("fav"))
                .then(() => favBtn.innerHTML = '<i class="fas fa-heart"></i>')
                .catch(err => null); //no quiero tratar el error y no quiero que salga en consola
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
                    favBtn.innerHTML = '<i class="far fa-heart"></i>'
                }
                else {
                    //Esto es para búsqueda en firebase. Lo comento porque no me da la funcionalidad que necesito
                    //  artist.titleSearch = artist.title.toLowerCase();
                    setFav(`artist${artist.id}`, artist);
                    favBtn.classList.add("fav");
                    //showMaster(searchText, newResultDiv, API_DATA);
                    //No hace falta dibujar todo, solo lo cambiamos de sitio.
                    parentDiv.prepend(favDiv)
                    favBtn.innerHTML = '<i class="fas fa-heart"></i>'

                }

            })
        }

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

        artistWrapper.addEventListener("click", () => {
            showDetail(dataArtists, artist.id, newResultDiv, searchText);
        })

    })
}

const showDetail = (artists, id, resultsDiv, searchText) => {

    const cache = getCache(`artist${id}`);

    if (cache !== false) {
        paintArtist(artists, cache, resultsDiv, searchText);
    }
    else {
        const api = new DiscogsAPI;
        api.fetchArtist(id)
            .then(artist => {
                setCache(`artist${id}`, artist);
                paintArtist(artists, artist, resultsDiv, searchText);
            })
    }
}

const paintArtist = (artists, artist, resultsDiv, searchText) => {
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


    if (logged) {
        const favBtn = createNode("Div", {
            className: "favBtn",
            innerHTML: '<i class="fas fa-heart"></i>'
        }, detailBtnWrapper);
        //si es favorito marca el botón como favorito
        getFav(`artist${artist.id}`)
            .then(id => favBtn.classList.add("fav"))
            .then(() => favBtn.innerHTML = '<i class="fas fa-heart"></i>')
            .catch(err => null); //no quiero tratar el error y no quiero que salga en consola
        //EVENTO BOTÓN FAVORITO
        favBtn.addEventListener("click", () => {
            if (favBtn.classList.contains("fav")) {
                cleanFav(`artist${artist.id}`);
                favBtn.classList.remove("fav");
                favBtn.innerHTML = '<i class="far fa-heart"></i>';
            }
            else {
                //selecciono el artista del array artistas
                //para guardarlo en favoritos para el listado maestro.
                const myArtist = artists.filter(el => el.id === artist.id)[0];
                //Esto es para búsqueda en firebase. Lo comento porque no me da la funcionalidad que necesito
                //myArtist.titleSearch = myArtist.title.toLowerCase();
                setFav(`artist${artist.id}`, myArtist);
                favBtn.classList.add("fav");
                favBtn.innerHTML = '<i class="fas  fa-heart"></i>';
            }
        })
    }

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
    showDiscography(artist.id, newResultDiv);

    //EVENTO BOTÓN REGRESAR
    backBtn.addEventListener("click", () => {
        showMaster(searchText, newResultDiv);
    })


}



const showDiscography = (id, resultsDiv) => {


    const cache = getCache(`discos${id}`);

    if (cache !== false) {
        paintDiscography(cache.data, resultsDiv);
    }
    else {
        const api = new DiscogsAPI;
        api.fetchDisco(id)
        .then(discography => {
            setCache(`discos${id}`, discography);
            paintDiscography(discography, resultsDiv);
        })
    }

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
let logged;
let resultAuth;
//al iniciar la aplicación vemos si estamos ya logeados o no
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        logged = true;
        const btnAuthText = d.createTextNode("Desconectar");
        d.querySelector(".headBtnAuth").firstChild.remove();
        d.querySelector(".headBtnAuth").appendChild(btnAuthText);
    }
    //si no lo estamos autenticamos

    else {
        logged = false;
        const btnAuthText = d.createTextNode("Conectar");
        d.querySelector(".headBtnAuth").firstChild.remove();
        d.querySelector(".headBtnAuth").appendChild(btnAuthText);
    }

    //------------------------------------EVENTS------------------------------------
    d.querySelector(".headBtnAuth").addEventListener("click", () => {


        if (logged) {
            //estamos conectados, entonces nos desconectamos
            firebase.auth().signOut().then(() => {
                console.log("DESCONECTADO");
                logged = false;
            }).catch((error) => {
                console.log("ERROR AL DESCONECTAR", error);
            });

        }
        else {
            //estamos desconectados, nos conectamos
            resultAuth = login();
            console.log("CONECTADO");
            console.log(resultAuth);
        }

        /*     //miramos si estamos ya autenticados
            firebase.auth().onAuthStateChanged(user => {
                //si lo estamos nos desconectamos
        
                if (user) {
                    logged = true;
                    console.log("ESTAS CONECTADO");
                    console.log(resultAuth);
                    firebase.auth().signOut().then(() => {
                        console.log("DESCONECTADO")
                    }).catch((error) => {
                        console.log("ERROR AL DESCONECTAR", error);
                    });
        
        
                }
                //si no lo estamos autenticamos
        
                else {
                    logged = false;
                    console.log("NO ESTAS CONECTADO")
                    resultAuth = login();
                } */

    })

})




d.querySelector(".searchBtn").addEventListener("click", () => {
    const resultsDiv = d.querySelector(".results");
    const searchText = d.querySelector(".searchInput").value;
    d.querySelector(".searchSection").classList.add("masterVersion");
    showMaster(searchText, resultsDiv)

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