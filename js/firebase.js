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

/* firebase.database().ref('cache2').set({
    username: "nombre2",
    email: "email2"
}); */


const setFav = (favID) => {
    console.log("guardando favorito:", favID);
    firebase.database().ref(`fav/${favID}`).set(true);
}




const getFav = (favID) => {
    //FIREBASE VERSION

    //devolvemos una promesa
    return new Promise((resolv, reject) => {

        firebase.database().ref(`fav/${favID}`).on('value', (data) => {
            if (data.val() !==true) reject("NO HAY DATOS GUARDADOS");
            else resolv(data.val());
        })
    })

}

const cleanFav = (favID) => {
    firebase.database().ref(`fav/${favID}`).set(null);
}

//TODO: PROBAR GET!!!!