const electron = require("electron");
const { ipcRenderer } = electron;

let textarea = document.querySelector("textarea");
let defaultFontSize = 20;
function increaseFont() {
  textarea.style.fontSize = `${++defaultFontSize}px`;
}

function decreaseFont() {
  textarea.style.fontSize = `${--defaultFontSize}px`;
}

function saveText() {
  let text = textarea.value;
  console.log(text);
  ipcRenderer.send("save", text);
}
function saveasText() {
  let text = textarea.value;
  console.log(text);
  ipcRenderer.send("saveas", text);
}

ipcRenderer.on("saved", (event, result) => {
  if (result == "success") {
    console.log("note saved successfully");
    textarea.style.backgroundColor = "#b2ff99";
  } else {
    console.log("error while saving text");
    textarea.style.backgroundColor = "#ff8989";
  }
  // console.log(document.getElementById(search));
  setTimeout(function () {
    textarea.style.backgroundColor = "";
  }, 100);
});

ipcRenderer.on("save-clicked", () => {
  saveText();
});

ipcRenderer.on("saveas-clicked", () => {
  saveasText();
});

// window.onload = function () {
//   if (window.jQuery) {
//     // jQuery is loaded
//     alert("Yeah!");
//   } else {
//     // jQuery is not loaded
//     alert("Doesn't Work");
//   }
// };

// $("h1").hide;

// $("#search").on("change keyup paste input", function () {
//   console.log("here");
//   $("h1").hide;
//   console.log("search called");
//   let searched = document.getElementById("search").value.trim();
//   if (searched !== "") {
//     let text = document.getElementById("text").innerHTML;
//     let re = new RegExp(searched, "g"); // search for all instances
//     let newText = text.replace(re, `<mark>${searched}</mark>`);
//     document.getElementById("text").innerHTML = newText;

//   }
// });

// let only_text = document.getElementById("text").value;
function replaceWord() {
  //   console.log("search called");
  let search = document.getElementById("search").value.trim();
  let replace = document.getElementById("replace").value.trim();
  //   console.log(search);
  if (search !== "") {
    let text = document.getElementById("text").value;
    let re = new RegExp(search, "g"); // search for all instances
    // if (re == "") alert("Word not found");
    console.log(text);
    let newText = text.replace(re, replace);
    // console.log(newText);
    document.getElementById("text").value = newText;
    document.getElementById("search").value = "";
    document.getElementById("replace").value = "";
  }
}

// setInterval(function () {
//   search();
// }, 100);
