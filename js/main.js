"use strict";
//------------------------------------FUNCTIONS------------------------------------

const searchAPI = (searchText, resultsDiv) => {


    fetch(`http://musicbrainz.org/ws/2/artist?query=${searchText}&fmt=json`)
        .then(response => response.json())
        .then(data => {//Aquí es donde tengo que desarrollar el código que se ejecuta cuando llega el asíncrono

            const dataArtists = data.artists;

            dataArtists.forEach(artist => {
                console.log(artist);
                createNode("div", {
                    id: artist.id,
                    className: "artistName",
                    innerText: artist.name
                }, resultsDiv);
                createNode("div", {
                    className: "artistDis",
                    innerText: `${(artist.disambiguation) ? artist.disambiguation : "-"}`
                }, resultsDiv)
            });



        });

}

const showDetail = (id,resultsDiv) => {
    fetch(`http://musicbrainz.org/ws/2/artist/${id}?inc=release-groups&fmt=json`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const discography=data["release-groups"];
            resultsDiv.innerHTML="";
            discography.forEach(disco => {
                resultsDiv.innerHTML+=disco.title;
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