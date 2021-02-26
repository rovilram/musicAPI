"use strict";
//------------------------------------FUNCTIONS------------------------------------
const apiToken = "qIHUSqYVTbUwldVvzrbgbUObJAwpPOvOtpTSxzZk";


const searchAPI = (searchText, resultsDiv) => {

    console.log("fuera del fetch")
    fetch(`https://api.discogs.com/database/search?q=${searchText}&token=${apiToken}&type=artist`)
        .then(response => response.json())
        .then(data => {//Aquí es donde tengo que desarrollar el código que se ejecuta cuando llega el asíncrono

            const dataArtists = data.results;
            dataArtists.forEach(artist => {
                const artistPic = (artist.thumb) ? artist.thumb : "https://via.placeholder.com/150x150.png?text=NO+PHOTO"
                const artistWrapper = createNode("div", {
                    className: "artistWrapper"
                })
                createNode("div", {
                    id: artist.id,
                    className: "artistName",
                    innerText: artist.title
                }, artistWrapper);
                createNode("img", {
                    className: "artistDis",
                    src: artistPic
                }, artistWrapper)
                resultsDiv.appendChild(artistWrapper);
            });



        });

}

const showDetail = (id, apiToken, resultsDiv) => {

    fetch(`https://api.discogs.com/artists/${id}?token=${apiToken}`)
        .then(response => response.json())
        .then(artist => {
            const artistObject = {
                artistName: artist.name,
                artistPic: (artist.images[0].uri)?
                    artist.images[0].uri:
                    "https://via.placeholder.com/150x150.png?text=NO+PHOTO",
                artistProfile: artist.profile,
                membersArray: artist.members,
            }

            createNode("h2", {
                className: "artistData",
                innerText: artistObject.artistName,
            }, resultsDiv);

            createNode("img", {
                className: "ArtistData Pic",
                src: (artistObject.artistPic)
                    ? artistObject.artistPic
                    : "https://via.placeholder.com/150x150.png?text=NO+PHOTO"
            }, resultsDiv);
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
            resultsDiv.appendChild(bioWrapper);

            //FORMACIÓN
            if (artistObject.membersArray) {

                const membersDiv = createNode("div", {
                    className: "artistData members",
                });
                createNode("h3", {
                    className: "membersTitle",
                    innerText: "Miembros"
                }, membersDiv);
                artistObject.membersArray.forEach(
                    member => {
                        createNode("div", {
                            className: "artistData member",
                            innerText: member.name
                        }, membersDiv)
                    }
                );
                resultsDiv.appendChild(membersDiv);
            }
            showDiscography(id, apiToken, resultsDiv);
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
    console.log("CLICK")
    if (e.target.classList.contains("search")) {
        const searchText = document.querySelector(".searchInput").value;
        searchAPI(searchText, resultsDiv);

    }
    else if (e.target.className.includes("artistName")) {
        console.log(`CLICK EN ${e.target.innerText} con ID ${e.target.id}`)
        showDetail(e.target.id, apiToken, resultsDiv);
    }
})