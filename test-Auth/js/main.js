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

let resultAuth = {};

//login()


firebase.auth().onAuthStateChanged(user => {
  if (user) {
    logged = true;
    console.log("ESTAS CONECTADO");
    console.log(resultAuth)


  } else {
    logged = false;
    console.log("NO ESTAS CONECTADO")
    resultAuth = login();
  }
});



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






const createNodes = (nodes) => {
  const htmlNodes = document.createDocumentFragment();
  const varNodes = {};
  nodes.map(node => {
    console.log(node)
    let tempNode;
    if (node.nodeType === "text") {
      console.log(node, "NODO DE TEXTO")
      tempNode = document.createTextNode(node.text)
    }
    else {
      tempNode = document.createElement(node.nodeType);
      htmlNodes.appendChild(tempNode);
      Object.keys(node).map(key => {
        if(key === "childNodes") {
          console.log("CHILD", node.childNodes)
          const childNode = createNodes(node.childNodes);
          console.log(childNode);
          setTimeout(tempNode.appendChild(childNode), 10000);
        }
        else if (key !== "nodeType" && key !== "text" && key !== "varName") {
          tempNode.setAttribute(key, node[key]);
        }
      })


    }
    if (node.varName) varNodes[node.varName] = tempNode;
    return htmlNodes; 
  })


}
/* 
const createNode = (htmlElement, htmlAttributes, container) => {
    
  const HTMLnode = document.createElement(htmlElement);

  Object.entries(htmlAttributes).forEach(([key, val]) => {
      HTMLnode[key] = val;
  })
  if (container) {
      container.appendChild(HTMLnode);
  }
      return HTMLnode;
}
 */






nodesObject = [

  {
    varName: "div1",
    nodeType: "div",
    id: "div1",
    className: "divClass",
    childNodes: [
      {
        nodeType: "text",
        text: "texto a adjuntar"
      }
    ]
  },
  {
    varName: "div2",
    nodeType: "p",
    id: "div2",
    className: "pClass",
    childNodes: [
      {
        nodeName: "text P"
      }
    ]
  }


]


createNodes(nodesObject)