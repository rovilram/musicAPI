"use strict";
//------------------------------------FUNCTIONS------------------------------------

const searchAPI = (searchText, resultsDiv) => {


    fetch(`http://musicbrainz.org/ws/2/artist?query=${searchText}&fmt=json`)
        .then(response => response.json())
        .then(data => {//Aquí es donde tengo que desarrollar el código que se ejecuta cuando llega el asíncrono

            const dataArtists = data.artists;

            dataArtists.forEach(artist => {
                const artistWrapper = createNode("div", {
                    className:"artistWrapper"
                })
                createNode("div", {
                    id: artist.id,
                    className: "artistName",
                    innerText: artist.name
                }, artistWrapper);
                createNode("div", {
                    className: "artistDis",
                    innerText: `${(artist.disambiguation) ? artist.disambiguation : "-"}`
                }, artistWrapper)
                resultsDiv.appendChild(artistWrapper);
            });



        });

}

const showDetail = (id, resultsDiv) => {

    fetch(`http://musicbrainz.org/ws/2/artist/${id}?inc=releases&fmt=json`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const discography = data.releases;
            discography.forEach(disco => {
                const discWrapper = createNode("div", {
                    className: "discWrapper",
                })
                createNode("div", {
                    id: discography.id,
                    className: "artistName",
                    innerText: disco.title
                }, discWrapper);
                console.log(`http://coverartarchive.org/release/${disco.id}`);
                fetch(`http://coverartarchive.org/release/${disco.id}`)
                    .then(response => response.json())
                    .then(data => {
                        createNode("img", {
                            id: data.id,
                            className: "releaseImg",
                            src: data.images[0].image
                        }, discWrapper);
                    })
                    .catch (data => {
                        console.log("CATCH");
                        createNode("img", {
                            className: "releaseImg",
                            src: "https://via.placeholder.com/150x150.png?text=NO+COVER"
                        }, discWrapper);
                    })
                resultsDiv.appendChild(discWrapper)
            })
        })
}





//------------------------------------MAIN------------------------------------
const d = document;



//------------------------------------EVENTS------------------------------------
document.addEventListener("click", (e) => {
    const resultsDiv = document.querySelector(".results");
    if (e.target.className.includes("searchBtn")) {
        const searchText = document.querySelector("#searchInput").value;
        searchAPI(searchText, resultsDiv);
    }
    else if (e.target.className.includes("artistName")) {
        console.log(`CLICK EN ${e.target.innerText} con ID ${e.target.id}`)
        showDetail(e.target.id, resultsDiv);
    }
})