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


const setCache = (searchText, data) => {
    if (localStorage) {
        //FIREBASE VERSION
        console.log(`Datos de "${searchText}" guardados en FIREBASE`);
        firebase.database().ref(searchText).set({
            data: data
        });

    };
}

const getCache = (searchText) => {
    //FIREBASE VERSION

    //devolvemos una promesa
    return new Promise((resolv, reject) => {

        firebase.database().ref(searchText).on('value', (data) => {
            if (data.val()===null) reject("NO HAY DATOS GUARDADOS");
            else resolv(data.val());
        })
    })

}


