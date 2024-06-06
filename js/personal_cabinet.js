if (!localStorage.getItem("snapshot.data")) {
  document.location = "/";
}

const userInfo = JSON.parse(localStorage.getItem("snapshot.data"));

const changePersonalInformation = document.getElementById("personalInformation");
const personalInformationForm = document.getElementById("personalInformationForm");
const warningList = document.getElementById("warningsList");
const addSubject = document.getElementById("addSubject");
const personalTimetable = document.getElementById("personalTimetable");

const infoPopup = document.getElementById("infoPopup");
const infoPopupCloseButton = document.getElementById("infoPopupCloseButton");

if (userInfo.fullInfo) {
  document.querySelector("select[name='specialization']").setAttribute("disabled", "");
  downloadInformationFromLocalStorage();
  changePersonalInformation.removeAttribute("disabled");
  warningList.removeAttribute("disabled");
  addSubject.removeAttribute("disabled");
  personalTimetable.removeAttribute("disabled");
} else {
  changePersonalInformation.removeAttribute("disabled");
}

import { updateDoc, doc, getDocs, db, collection } from "/js/global.js";

changePersonalInformation.addEventListener("click", () => {
  openInfoPopup();
  console.log(userInfo);
  console.log(userInfo.fullInfo);
  if (userInfo.fullInfo) {
    putInfoInFormPersonalInformation_FullInfo();
  }
  if (!userInfo.fullInfo) {
    putInfoInFormPersonalInformation_WithoutFullInfo();
  }
});
personalInformationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  changeUserInfoInDB();
});
infoPopupCloseButton.addEventListener("click", closeInfoPopup);

function changeUserInfoInDB() {
  const userId = userInfo.uid;

  var name = document.querySelector("input[name='name']").value;
  var surname = document.querySelector("input[name='surname']").value;
  var dateBirthday = document.querySelector("input[name='dateBirthday']").value;
  var specializationId = document.querySelector("select[name='specialization']").value;
  var phone = document.querySelector("input[name='phone']").value;
  var imageUrl = document.querySelector("input[name='imageUrl']").value;

  var imageTest = new Image();
  imageTest.src = imageUrl;
  imageTest.onload = function () {
    updateDoc(doc(db, "Students", userId), {
      name: name,
      surname: surname,
      dateBirthday: dateBirthday,
      specialization_id: specializationId,
      phone: phone,
      photoUrl: imageUrl,
      fullInfo: true,
    }).then(() => {
      userInfo.name = name;
      userInfo.surname = surname;
      userInfo.dateBirthday = dateBirthday;
      userInfo.specialization_id = specializationId;
      userInfo.phone = phone;
      userInfo.photoUrl = imageUrl;
      userInfo.fullInfo = true;
      localStorage.setItem("snapshot.data", JSON.stringify(userInfo));

      document.getElementById("userName").innerText = name + " " + surname;

      warningList.removeAttribute("disabled");
      addSubject.removeAttribute("disabled");
      personalTimetable.removeAttribute("disabled");

      closeInfoPopup();
    });
  };
  imageTest.onerror = function () {
    // Обработка случая, когда URL не указывает на действительное изображение
    alert("Предоставленный URL изображения невалиден. Пожалуйста, проверьте и попробуйте снова.");
  };
}

function downloadInformationFromLocalStorage() {
  // var userInfo = JSON.parse(localStorage.getItem("snapshot.data"));

  // console.log(userInfo);
  document.getElementById("userName").innerText = userInfo.name + " " + userInfo.surname;
  if (userInfo.photoUrl) document.getElementById("userPhotoUrl").src = userInfo.photoUrl;
}

function openInfoPopup() {
  document.querySelector("body").className += " popup-active";
  infoPopup.setAttribute("style", "display: block");
}

function closeInfoPopup() {
  document.querySelector("body").removeAttribute("class");
  infoPopup.setAttribute("style", "display: none");
}

function putInfoInFormPersonalInformation_FullInfo() {
  // var userInfo = JSON.parse(localStorage.getItem("snapshot.data"));

  console.log(userInfo);

  downloadSpecializationsFromDB()
    .then((specializations) => {
      showSpecializationsInList(specializations);
      if (userInfo.specialization_id) document.querySelector("select[name='specialization']").value = userInfo.specialization_id;
    })
    .catch((error) => {
      console.log("Error with ", error);
    });

  document.querySelector("input[name='name']").value = userInfo.name;
  document.querySelector("input[name='surname']").value = userInfo.surname;
  document.querySelector("input[name='dateBirthday']").value = userInfo.dateBirthday;
  document.querySelector("input[name='phone']").value = userInfo.phone;
  document.querySelector("input[name='email']").value = userInfo.email;
  document.querySelector("input[name='imageUrl']").value = userInfo.photoUrl;
}

function putInfoInFormPersonalInformation_WithoutFullInfo() {
  // var userInfo = JSON.parse(localStorage.getItem("snapshot.data"));

  console.log("awdawd")

  downloadSpecializationsFromDB()
    .then((specializations) => {
      showSpecializationsInList(specializations);
    })
    .catch((error) => {
      console.log("Error with ", error);
    });

  document.querySelector("input[name='email']").value = userInfo.email;
  document.querySelector("input[name='imageUrl']").value = userInfo.photoUrl;
}

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

function showSpecializationsInList(specializations) {
  const select = document.getElementById("specializations");
  select.innerHTML = "";
  specializations.forEach((spec) => {
    const option = document.createElement("option");
    option.value = spec.number_specialization;
    option.textContent = spec.spec_name;
    select.appendChild(option);
  });
}
