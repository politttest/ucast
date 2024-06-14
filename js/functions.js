import { updateDoc, doc, getDocs, db, collection } from "/js/global.js";

function downloadSpecializationsFromDB() {
  return new Promise((resolve, reject) => {
    let specializations = [];
    getDocs(collection(db, "Specializations"))
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          specializations.push({ ...doc.data() });
        });
        resolve(specializations);
      })
      .catch((err) => {
        console.log("Error retrieving specializations: ", err);
        reject(err);
      });
  });
}

function openInfoPopup(idButton) {
  document.querySelector("body").className += "popup-active";
  document.getElementById(idButton).setAttribute("style", "display: block");
}

function closeInfoPopup(idButton) {
  document.querySelector("body").removeAttribute("class");
  document.getElementById(idButton).setAttribute("style", "display: none");
}

export { downloadSpecializationsFromDB, openInfoPopup, closeInfoPopup };
