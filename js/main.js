"use strict";
//------------------------------------FUNCTIONS------------------------------------
const API_TOKEN = "qIHUSqYVTbUwldVvzrbgbUObJAwpPOvOtpTSxzZk";
let backHistory="";


const showMaster = (searchText, resultsDiv, d, backHistory) => {

    fetch(`https://api.discogs.com/database/search?q=${searchText}&token=${API_TOKEN}&type=artist`)
        .then(response => response.json())
        .then(data => {//Aquí es donde tengo que desarrollar el código que se ejecuta cuando llega el asíncrono

            const dataArtists = data.results;

            const newResultDiv = createNode("div", {
                className:"results"
            })

            dataArtists.forEach(artist => {
                const artistPic = (artist.thumb) ? artist.thumb : "https://via.placeholder.com/150x150.png?text=NO+PHOTO"
                const artistWrapper = createNode("div", {
                    className: "artistWrapper"
                })
                createNode("div", {
                    id: `divArtist${artist.id}`,
                    className: "artistName",
                    innerText: artist.title
                }, artistWrapper);
                createNode("img", {
                    className: "artistDis",
                    src: artistPic
                }, artistWrapper);

                newResultDiv.appendChild(artistWrapper);

                resultsDiv.replaceWith(newResultDiv);
                backHistory = resultsDiv;

                //Definimos aquí el evento que lleva al artista.
                d.querySelector(`#divArtist${artist.id}`).addEventListener("click", () => {
                    showDetail(artist.id, API_TOKEN, newResultDiv, backHistory);
                })
            });



        });

}

const showDetail = (id, apiToken, resultsDiv, backHistory) => {


    fetch(`https://api.discogs.com/artists/${id}?token=${apiToken}`)
        .then(response => response.json())
        .then(artist => {
            const artistObject = {
                artistName: artist.name,
                artistPic: (artist.images) ?
                    artist.images[0].uri :
                    "https://via.placeholder.com/150x150.png?text=NO+PHOTO",
                artistProfile: artist.profile,
                membersArray: artist.members,
            }

            
            
            const newResultDiv = createNode("div", {
                className: "results",
            });
            
            const detailBtn = createNode("Div", {
                className: "detailBtn",
                innerText: "Regresar"
            }, newResultDiv );
    
            createNode("h2", {
                className: "artistData",
                innerText: artistObject.artistName,
            }, newResultDiv);

            createNode("img", {
                className: "ArtistData Pic",
                src: artistObject.artistPic
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
                innerText: artistObject.artistProfile
            }, bioWrapper);
            newResultDiv.appendChild(bioWrapper);

            //FORMACIÓN
            if (artistObject.membersArray) {

                const membersDiv = createNode("div", {
                    className: "artistData members",
                });
                createNode("h3", {
                    className: "membersTitle",
                    innerText: "Formación"
                }, membersDiv);
                artistObject.membersArray.forEach(
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
            showDiscography(id, apiToken, newResultDiv);



            //EVENTO BOTÓN REGRESAR
            console.log(detailBtn);
            detailBtn.addEventListener ("click", () => {
                newResultDiv.replaceWith(resultsDiv);
            })


        })
}

const showDiscography = (id, apiToken, resultsDiv) => {

    //obtenemos la discografía
    fetch(`https://api.discogs.com/artists/${id}/releases?token=${apiToken}&sort=year`)
        .then(response => response.json())
        .then(releases => {

            const discography = releases.releases;
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

        })
}

//------------------------------------MAIN------------------------------------
const d = document;

//------------------------------------EVENTS------------------------------------
document.addEventListener("click", (e) => {

    const resultsDiv = document.querySelector(".results");
    if (e.target.classList.contains("search")) {
        const searchText = document.querySelector(".searchInput").value;
        d.querySelector(".searchSection").classList.add("masterVersion");
        showMaster(searchText, resultsDiv, d)
    }

})

d.querySelector(".searchInput").addEventListener("keyup", (e) => {
    if (e.key==="Enter") d.querySelector(".searchBtn").click();
})