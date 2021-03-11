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
console.log("FIREBASE", firebase)


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

const getAllFav = () => {
    return new Promise((resolv, reject) => {
        //como no consigo hacer la búsqueda que yo quiero directamente en Firebase (ver función searchFav2)
        //recojo todos los favoritos y hago el filtrado directamente yo
        firebase.database().ref("fav/").once('value', (data) => {
            if (data.val() === null) resolv([]);
            else
                resolv(data.val());
        })
    })
}


const searchFav = async (searchText) => {

    const allFav = await getAllFav();
    const favData = Object.keys(allFav).map(key => allFav[key]);
    const favFilter = favData.filter(el => el.title.toLowerCase().includes(searchText))
    return favFilter;
}


function login() {
    provider = new firebase.auth.GoogleAuthProvider();
    auth = firebase.auth();

    // Controlar el acceso a la parte privada
    auth.signInWithPopup(provider)
        .then((result) => {
            let credential = result.credential;

            // This gives you a Google Access Token. You can use it to access the Google API.
            let token = credential.accessToken;

            // The signed-in user info.
            let user = result.user;

            logged = true;

            console.log("CONECTADO!!")
            console.log(result)
            return result;

        })
        .catch((error) => {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            // The email of the user's account used.
            let email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            let credential = error.credential;
            // ...

            console.log(error.message);
        });
}


//No se puede hacer una búsqueda en el texto completo con firebase directamente, solo podemos hacer una búsqueda que empiece con un determinado texto (no que lo tenga entre medias).
//Para hacer eso deberíamos usar un servicio externo a firebase que se llama "Algoria".
/*
const searchFav2 = (searchText) => {
    return new Promise((resolv, reject) => {
        //encontré la forma de hacer la búsqueda parcial en este recurso
        //https://stackoverflow.com/questions/38618953/how-to-do-a-simple-search-in-string-in-firebase-database
        firebase.database().ref("fav/")
            .orderByChild("titleSearch")
            .equalTo(searchText)
            //.endAt(searchText + "\uf8ff")
            .on('value', (data) => {
                if (data.val() === null) resolv([]);
                else {
                    const favs = data.val();
                    console.log("FAVS", favs)
                    resolv(favs);
                }
            })
    })
}
 */

//searchFav2 ("tijerita")
