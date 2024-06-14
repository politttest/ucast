import { updateDoc, doc, getDocs, db, collection } from "/ucast/js/global.js";

import { downloadSpecializationsFromDB } from "/ucast/js/functions.js";

downloadSpecializationsFromDB()
  .then((specializations) => {
    specializations.forEach((spec) => {
      let buttonContainer = document.createElement("button");
      buttonContainer.className = "announcement-button";
      buttonContainer.innerText = spec.spec_name;
      buttonContainer.setAttribute("data-id", spec.number_specialization);

      document.getElementById("announcementButtonsContainer").appendChild(buttonContainer);
    });
  })
  .then(() => {
    let buttonContainer = document.createElement("button");
    buttonContainer.className = "announcement-button";
    buttonContainer.innerText = "Dla wszystkich";
    buttonContainer.setAttribute("data-id", "-1");

    document.getElementById("announcementButtonsContainer").appendChild(buttonContainer);
  })
  .catch((error) => {
    console.log("Error with ", error);
  });
