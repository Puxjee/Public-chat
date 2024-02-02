import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  update,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://we-are-the-champions-28a18-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const messageListInDb = ref(database, "messageList");

const inputEl = document.getElementById("input");
const buttonEl = document.getElementById("btn");
const messageListEl = document.getElementById("message-list");
const fromEl = document.getElementById("from");
const toEl = document.getElementById("to");
let likeCounter = 0;

function InsertMessageList(item) {
  let messageID = item[0];
  let messageValue = item[1];
  let li = document.createElement("li");
  li.innerHTML = `<h5>${messageValue.to}</h5>${messageValue.message}<h5>${messageValue.from}<span>❤ ${messageValue.likes}</span></h5> `;
  messageListEl.append(li);
  li.addEventListener("dblclick", function () {
    likeCounter++;
    update(ref(database, `messageList/${messageID}`), {
      likes: likeCounter,
    });
  });
}

function clearField(field) {
  field.value = "";
}

buttonEl.addEventListener("click", function () {
  let inputValue = inputEl.value;
  let fromValue = `From: ${fromEl.value}`;
  let toValue = `To: ${toEl.value}`;

  push(messageListInDb, {
    message: inputValue,
    from: fromValue,
    to: toValue,
    likes: likeCounter,
  });
  clearField(inputEl);
  clearField(fromEl);
  clearField(toEl);
});

onValue(messageListInDb, (snapshot) => {
  messageListEl.innerHTML = "";
  if (snapshot.exists()) {
    let messageListArray = Object.entries(snapshot.val());
    for (let i = messageListArray.length - 1; i >= 0; i--) {
      let currentMessage = messageListArray[i];
      InsertMessageList(currentMessage);
    }
  } else {
    messageListEl.innerHTML = "No messages here yet..";
    messageListEl.style.color = "white";
  }
});
