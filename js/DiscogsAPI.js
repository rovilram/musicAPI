class DiscogsAPI {
    constructor () {
        this.TOKEN = "UTtvCaiWDvNQrjQUXmBqZncsMQzXXMrrsOvlTujQ";
        this.URL= "https://api.discogs.com/";
        this.HEADER = ['User-Agent', 'musicAPIs v0.1 https://rovilram.github.io/musicAPI/'];
    }

    getToken() {
        return this.TOKEN;
    }

    getURL() {
        return this.URL;
    }

    getHeader () {
        return this.HEADER;
    }
}

const discogsAPI = new DiscogsAPI;



