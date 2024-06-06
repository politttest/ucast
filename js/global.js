import { app } from "/ucast/js/firebase.js";

import { getFirestore, collection, getDoc, getDocs, doc, setDoc, updateDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

const db = getFirestore();

import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

export { updateDoc, doc, db, getDocs, collection };

const provider = new GoogleAuthProvider();

const auth = getAuth(app);
auth.languageCode = "pl";

/* ------- MAIN CODE ------- */

const googleAuthButton = document.getElementById("googleAuthButton");
if (googleAuthButton) googleAuthButton.addEventListener("click", googleAuth);
else console.log("Error with document.getElementById('googleAuthButton')");

const personalCabinetButton = document.getElementById("goToPersonalCabinet");
const logOutButton = document.getElementById("googleLogOutButton");

if (localStorage.getItem("snapshot.data")) {
  personalCabinetButton.setAttribute("style", "display: block");
  logOutButton.setAttribute("style", "display: block");
  googleAuthButton.setAttribute("style", "display: none");
} else {
  personalCabinetButton.setAttribute("style", "display: none");
  logOutButton.setAttribute("style", "display: none");
  googleAuthButton.setAttribute("style", "display: block");
}

logOutButton.addEventListener("click", () => {
  localStorage.removeItem("snapshot.data");
  document.location = "/ucast/"
})

personalCabinetButton.addEventListener("click", () => {
  document.location = "/ucast/personal_cabinet.html"
})

/* ------- FUNCTIONS ------- */

function googleAuth() {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      sendUserInfoToDB(token, user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log("errorCode - ", errorCode);
      console.log("errorMessage - ", errorMessage);
    });
}

function sendUserInfoToDB(token, userInfo) {
  const colRef = collection(db, "Students");
  const userId = userInfo.uid;

  localStorage.setItem("userId", userId);

  getDoc(doc(db, "Students", userId))
    .then((snapshot) => {
      if (snapshot.data()) {
        console.log();
        localStorage.setItem("snapshot.data", JSON.stringify(snapshot.data()));
        document.location = "/ucast/personal_cabinet.html";
      } else {
        setDoc(doc(db, "Students", userId), {
          email: userInfo.email,
          uid: userId,
          photoUrl: userInfo.photoURL,
          name: "",
          surname: "",
          phone: "",
          fullInfo: false,
        }).then(() => {
          console.log("Send to BD");
          var newInfo = {
            email: userInfo.email,
            uid: userId,
            photoUrl: userInfo.photoURL,
            name: "",
            surname: "",
            phone: "",
            fullInfo: false,
          };
          localStorage.setItem("snapshot.data", JSON.stringify(newInfo));
          document.location = "/ucast/personal_cabinet.html";
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
