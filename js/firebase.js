import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyDfmRjikRJCC5Mz-heQ_s37IbpYot_-b-M",
  authDomain: "ucast-school.firebaseapp.com",
  projectId: "ucast-school",
  storageBucket: "ucast-school.appspot.com",
  messagingSenderId: "904433107628",
  appId: "1:904433107628:web:bae81739e6d24b975fd509",
  measurementId: "G-H0KTVHMKL0",
};

export const app = initializeApp(firebaseConfig);