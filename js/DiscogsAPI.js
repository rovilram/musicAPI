class DiscogsAPI {
    constructor() {
        this.TOKEN = "UTtvCaiWDvNQrjQUXmBqZncsMQzXXMrrsOvlTujQ";
        this.URL = "https://api.discogs.com/";
        this.HEADER = ['User-Agent', 'musicAPIs v0.1 https://rovilram.github.io/musicAPI/'];
    }

    getToken() {
        return this.TOKEN;
    }

    getURL() {
        return this.URL;
    }

    getHeader() {
        return this.HEADER;
    }


    async apiFetch(URL) {
        //RECURSO PARA HACER UN AWAIT DE UN FETCH https://dmitripavlutin.com/javascript-fetch-async-await/
        const headers = new Headers();
        headers.append(...this.HEADER);
        const request = new Request(URL, {
            headers: headers
        });
        const response = await fetch(request);
        return await response.json();
    }


    async fetchArtists(searchText) {
        const URL = `${this.URL}/database/search?q=${searchText}&token=${this.TOKEN}&type=artist&per_page=10`;
        const dataArtists = await this.apiFetch(URL);
        return dataArtists.results;
    }


    async fetchArtist(id) {
        const URL = `${this.URL}artists/${id}?token=${this.TOKEN}`;
        const artist = await this.apiFetch(URL);
        return artist;
    }

    async fetchDisco(id) {
        const URL = `${this.URL}/artists/${id}/releases?token=${this.TOKEN}&sort=year`;
        const releases = await this.apiFetch(URL);
        return releases.releases;
    }

}


