if (!localStorage.getItem("snapshot.data")) {
  document.location = "/";
}

import { downloadSpecializationsFromDB, openInfoPopup, closeInfoPopup } from "/js/functions.js";
import { updateDoc, doc, getDoc, db, collection, setDoc, addDoc, getDocs, query, where } from "/js/global.js";

const userInfo = JSON.parse(localStorage.getItem("snapshot.data"));

const changePersonalInformation = document.getElementById("personalInformation");
const personalInformationForm = document.getElementById("personalInformationForm");
const createSubjectForm = document.getElementById("createSubjectForm");
const addSubjectForm = document.getElementById("addSubjectForm");

const warningList = document.getElementById("warningsList");
const addSubject = document.getElementById("addSubject");
const createSubject = document.getElementById("createSubject");
const personalTimetable = document.getElementById("personalTimetable");

const infoPopup = document.getElementById("infoPopup");
const infoPopupCloseButton = document.getElementById("infoPopupCloseButton");
const createSubjectPopupCloseButton = document.getElementById("createSubjectPopupCloseButton");
const addSubjectPopupCloseButton = document.getElementById("addSubjectPopupCloseButton");

getDoc(doc(db, "Teachers", userInfo.uid))
  .then((snapshot) => {
    console.log("snapshot.data - ", snapshot.data());
    if (snapshot.data()) {
      localStorage.setItem("teacher", "true");
      createSubject.setAttribute("style", "display:block");
      addSubject.setAttribute("style", "display:none");
    } else {
      getDoc(doc(db, "Rektors", userInfo.uid)).then((snapshot) => {
        if (snapshot.data()) {
          localStorage.setItem("rektor", "true");
          createSubject.setAttribute("style", "display:block");
          addSubject.setAttribute("style", "display:none");
        } else {
          createSubject.setAttribute("style", "display:none");
          addSubject.setAttribute("style", "display:block");
          localStorage.setItem("student", "true");
        }
      });
    }
  })
  .catch((err) => {
    console.log(err);
  });

if (userInfo.fullInfo) {
  document.querySelector("select[name='specialization']").setAttribute("disabled", "");

  downloadInformationFromLocalStorage();

  changePersonalInformation.removeAttribute("disabled");
  warningList.removeAttribute("disabled");
  addSubject.removeAttribute("disabled");
  createSubject.removeAttribute("disabled");
  personalTimetable.removeAttribute("disabled");
} else {
  changePersonalInformation.removeAttribute("disabled");
}

changePersonalInformation.addEventListener("click", () => {
  openInfoPopup("infoPopup");
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
infoPopupCloseButton.addEventListener("click", () => {
  closeInfoPopup("infoPopup");
});
warningList.addEventListener("click", () => {
  document.location = "/announcement.html";
});

addSubject.addEventListener("click", () => {
  openInfoPopup("addSubjectPopup");
});
addSubjectForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addSubjectFromDBToStudent();
});
addSubjectPopupCloseButton.addEventListener("click", () => {
  closeInfoPopup("addSubjectPopup");
});

createSubject.addEventListener("click", () => {
  openInfoPopup("createSubjectPopup");
});
createSubjectForm.addEventListener("submit", (event) => {
  event.preventDefault();
  createSubjectInDB();
});
createSubjectPopupCloseButton.addEventListener("click", () => {
  closeInfoPopup("createSubjectPopup");
});

function changeUserInfoInDB() {
  const userId = userInfo.uid;

  var name = document.querySelector("input[name='name']").value;
  var surname = document.querySelector("input[name='surname']").value;
  var dateBirthday = document.querySelector("input[name='dateBirthday']").value;
  var specializationId = document.querySelector("select[name='specialization']").value;
  var phone = document.querySelector("input[name='phone']").value;
  var imageUrl = document.querySelector("input[name='imageUrl']").value;

  console.log(imageUrl);

  if (imageUrl == "") {
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
      document.getElementById("userPhotoUrl").src = userInfo.photoUrl;

      warningList.removeAttribute("disabled");
      addSubject.removeAttribute("disabled");
      createSubject.removeAttribute("disabled");
      personalTimetable.removeAttribute("disabled");

      closeInfoPopup("infoPopup");
    });

    return;
  }

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
      document.getElementById("userPhotoUrl").src = userInfo.photoUrl;

      warningList.removeAttribute("disabled");
      addSubject.removeAttribute("disabled");
      createSubject.removeAttribute("disabled");
      personalTimetable.removeAttribute("disabled");

      closeInfoPopup();
    });
  };
  imageTest.onerror = function () {
    alert("Proszę zmienić link do zdjęcia. Lub usunąć go.");
  };
}

function downloadInformationFromLocalStorage() {
  document.getElementById("userName").innerText = userInfo.name + " " + userInfo.surname;
  if (userInfo.photoUrl) document.getElementById("userPhotoUrl").src = userInfo.photoUrl;
}

function putInfoInFormPersonalInformation_FullInfo() {
  downloadSpecializationsFromDB()
    .then((specializations) => {
      showSpecializationsInList(specializations, "personalInfoSpecializations");
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
  downloadSpecializationsFromDB()
    .then((specializations) => {
      showSpecializationsInList(specializations, "personalInfoSpecializations");
    })
    .catch((error) => {
      console.log("Error with ", error);
    });
  document.querySelector("input[name='email']").value = userInfo.email;
  document.querySelector("input[name='imageUrl']").value = userInfo.photoUrl;
}

function showSpecializationsInList(specializations, idSelect) {
  const select = document.getElementById(idSelect);
  console.log(select);
  select.innerHTML = "";
  specializations.forEach((spec) => {
    const option = document.createElement("option");
    option.value = spec.number_specialization;
    option.textContent = spec.spec_name;
    select.appendChild(option);
  });
}

function createSubjectInDB() {
  const userId = userInfo.uid;

  var nameSubject = document.getElementById("createSubjectForm").querySelector("input[name='name']").value;
  var descSubject = document.getElementById("createSubjectForm").querySelector("input[name='subject_description']").value;
  var kodPrzedmiotu = document.getElementById("createSubjectForm").querySelector("input[name='kod']").value;

  addDoc(collection(db, "Subjects"), {
    subject_name: nameSubject,
    teacher_id: userId,
    kod_przedmiotu: kodPrzedmiotu,
    subject_desc: descSubject,
  }).then(() => {
    closeInfoPopup("createSubjectPopup");
    document.getElementById("createSubjectForm").querySelector("input[name='name']").value = "";
    document.getElementById("createSubjectForm").querySelector("input[name='subject_description']").value = "";
    document.getElementById("createSubjectForm").querySelector("input[name='kod']").value = "";
  });
}

function addSubjectFromDBToStudent() {
  var kodSubject = document.getElementById("addSubjectForm").querySelector("input[name='kod']").value;

  const q = query(collection(db, "Subjects"), where("kod_przedmiotu", "==", kodSubject));

  getDocs(q)
    .then((snapshot) => {
      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          const checkQuery = query(collection(db, "Student-Subject"), where("student_id", "==", userInfo.uid), where("subject_id", "==", doc.id));
          getDocs(checkQuery).then((checkSnapshot) => {
            if (checkSnapshot.empty) {
              addDoc(collection(db, "Student-Subject"), {
                student_id: userInfo.uid,
                subject_id: doc.id,
              }).then(() => {
                closeInfoPopup("addSubjectPopup");
                document.getElementById("addSubjectForm").querySelector("input[name='kod']").value = "";
              });
            } else {
              alert("You have already added this subject.");
            }
          });
        });
      } else {
        alert("No subjects found with this code.");
      }
    })
    .catch((error) => {
      alert("Error fetching documents: ", error);
    });
}
