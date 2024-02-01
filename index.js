import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://we-are-the-champions-28a18-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endListInDb = ref(database, "endList");

const inputEl = document.getElementById("input");
const buttonEl = document.getElementById("btn");
const endListEl = document.getElementById("end-list");
const fromEl = document.getElementById("from");
const toEl = document.getElementById("to");

function InsertEndList(item) {
  let endID = item[0];
  let endValue = item[1];
  let li = document.createElement("li");
  li.textContent = endValue;
  endListEl.append(li);
}

function clearField(field) {
  field.value = "";
}

buttonEl.addEventListener("click", function () {
  let inputValue = inputEl.value;
  push(endListInDb, inputValue);
  clearField(inputEl);
  clearField(fromEl);
  clearField(toEl);
});

onValue(endListInDb, (snapshot) => {
  endListEl.innerHTML = "";
  if (snapshot.exists()) {
    let endListArray = Object.entries(snapshot.val());
    for (let i = endListArray.length - 1; i >= 0; i--) {
      let currentEnd = endListArray[i];
      InsertEndList(currentEnd);
    }
  } else {
    endListEl.innerHTML = "No messages here yet..";
    endListEl.style.color = "white";
  }
});
