// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC3mQXBtV5XLasCE-3QZKlcSLZjZ6zrTgo",
    authDomain: "musicapis.firebaseapp.com",
    projectId: "musicapis",
    storageBucket: "musicapis.appspot.com",
    messagingSenderId: "694160094125",
    appId: "1:694160094125:web:7ea0809cb66a56d1bf6724"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


const setFav = (favID, favObject) => {
    console.log("guardando favorito:", favID);
    firebase.database().ref(`fav/${favID}`).set(favObject);
}




const getFav = (favID) => {
    //devolvemos una promesa
    return new Promise((resolv, reject) => {
        firebase.database().ref(`fav/${favID}`).once('value', (data) => {
            if (data.val() === null) reject("NO HAY DATOS GUARDADOS");
            else resolv(data.val());
        })
    })
}

const cleanFav = (favID) => {
    firebase.database().ref(`fav/${favID}`).set(null);
}

const searchFav = (searchText) => {
    return new Promise((resolv, reject) => {
        firebase.database().ref("fav/").once('value', (data) => {
            if (data.val() === null) resolv([]);
            else {
                const allFav = data.val();
                const favData = Object.keys(allFav).map(key => allFav[key]);
                const favFilter = favData.filter(el => el.title.toLowerCase().includes(searchText))
                resolv(favFilter);
            }
        })
    })
}


