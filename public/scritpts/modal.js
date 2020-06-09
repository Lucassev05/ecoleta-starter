const buttonSearchModal = document.querySelector("#modal form button");
const inputSearchModal = document.querySelector("#modal form input");

buttonSearchModal.addEventListener("click", () => {
  let textOnInput = inputSearchModal.value.trim();
  let isEmpty = checkEmpty(textOnInput);
  if (isEmpty) {
    inputSearchModal.required = true;
    return false;
  }
});

function checkEmpty(field) {
  if (field == "" || field == null || field == "undefinied") {
    return true;
  } else if (/^\s*$/.test(field)) {
    return true;
  } else {
    return false;
  }
}
