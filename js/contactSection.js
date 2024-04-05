async function initContact() {

  await includeW3();
  contactActive();
  showInitials();

}

function contactActive() {
  document.getElementById("contactSum").classList.add("bgfocus");
}

let uniqueFirstLetters = new Set();
let previousIndex;

function rendercontactList() {
  let list = document.getElementById("listArea");
  contacts.sort((a, b) => a["name"].localeCompare(b["name"]));
  for (i = 0; i < contacts.length; i++) {
    let firstLetter = contacts[i]["name"].charAt(0);
    if (!uniqueFirstLetters.has(firstLetter)) {
      uniqueFirstLetters.add(firstLetter);
      list.innerHTML += `
          <div class="firstLetterContact">${firstLetter}</div>
          <div class="spaceContactList"></div>`;
    }
    list.innerHTML += rendercontactListHTML(i);
    document.getElementById(`listContact${i}`).style.backgroundColor =
      contacts[i]["color"];
  }
}

function addNewContact() { }

function showContact(index) {
  let fullContact = document.getElementById("contactFull");
  fullContact.style.transition = "transform 0.4s ease";
  fullContact.style.transform = "translateX(100%)";
  if (previousIndex == index) {
    fullContact.style.transform = "translateX(100%)";
    previousIndex = -1;
    document
      .getElementById(`info${index}`)
      .classList.remove("contactListShowActive");
  } else {
    removeMark();
    document
      .getElementById(`info${index}`)
      .classList.add("contactListShowActive");
    document
      .getElementById(`info${index}`)
      .classList.add("contactListShowActive:hover");
    setTimeout(() => {
      fullContact.innerHTML = "";
      fullContact.innerHTML += renderShowContactHTML(index);
      fullContact.style.transform = "translateX(0)";
      document.getElementById(
        `listContactBig${index}`
      ).style.backgroundColor = contacts[index]["color"];
    }, 400);
    if (window.innerWidth >= 950) {
    } else {
      showContactResponsive(index);
    }
    previousIndex = index;
  }
}

function removeMark() {
  for (let i = 0; i < contacts.length; i++) {
    document
      .getElementById(`info${i}`)
      .classList.remove("contactListShowActive");
  }
}

function showContactResponsive(index) {
  let contactFullResponsive = document.getElementById(
    "contactFullResponsive"
  );
  contactFullResponsive.style.display = "flex";
  contactFullResponsive.classList.remove("slide-out-left");
  contactFullResponsive.classList.add("slide-in-left");
  contactFullResponsive.innerHTML = "";
  contactFullResponsive.innerHTML += rendercontactFullResponsive(index);
  document.getElementById(
    `listContactBigResponsive${index}`
  ).style.backgroundColor = contacts[index]["color"];
}

function editContact(index) {
  let contactEdit = document.getElementById("contactEditArea");
  contactEdit.style.display = "flex";
  contactEdit.innerHTML = ``;
  contactEdit.innerHTML += editContactHTML(index);
  document.getElementById("contactEditName").defaultValue = contacts[index]["name"];
  document.getElementById("contactEditEmail").defaultValue = contacts[index]["email"];
  document.getElementById("contactEditPhone").defaultValue = contacts[index]["phone"];
  document.getElementById(`contactEditImage${index}`).style.backgroundColor = contacts[index]["color"];
}

function patchEdit(index) {
  let newName = document.getElementById('contactEditName').value;
  let newMail = document.getElementById('contactEditEmail').value;
  let newPhone = document.getElementById('contactEditPhone').value;
  let updatedContact = {
    name: newName,
    email: newMail,
    phone: newPhone,
  };

  // Suchen des Kontakts anhand der ID
  const contactToUpdate = contacts.find((contact) => contact.userID === "20240301");

  // Aktualisieren des Kontakts im Array (falls gefunden)
  if (contactToUpdate) {
    Object.assign(contactToUpdate, updatedContact);
  } else {
    console.error("Kein Kontakt mit der ID '20240301' gefunden");
  }

  // Lokalen JSON-Store aktualisieren
  setItem("contacts", contacts);

  rendercontactList();
}

function closeEditContact() {
  let contactEditVisible = document.getElementById("contactEditVisible");
  contactEditVisible.classList.add("slide-out-right");
  setTimeout(() => {
    document.getElementById("contactEditArea").style.display = "none";
    contactEditVisible.innerHTML = "";
  }, 400);
}

function closeContactFullResponsive() {
  let contactFullResponsive = document.getElementById(
    "contactFullResponsive"
  );
  contactFullResponsive.classList.add("slide-out-left");
  removeMark();
  setTimeout(() => {
    contactFullResponsive.style.display = "flex";
    contactFullResponsive.innerHTML = "";
  }, 400);
}

function hideContactResponsive() {
  const container = document.getElementById("contactFullResponsive");
  if (window.innerWidth >= 950) {
    container.style.display = "none";
  } else {
    container.style.display = "flex";
  }
}

window.addEventListener("resize", hideContactResponsive);

function showcontactPopupEditDelete() {
  let popupContactSmal = document.getElementById('contactPopupEditDelete');
  popupContactSmal.style.display = "block";
  popupContactSmal.classList.add(`slide-in-right-popup`);
}

function pushJSON() {
  setItem("contacts", contacts).then((response) => {
    // Verarbeitung der Serverantwort
    console.log("Serverantwort:", response);
  });
}

function pullJSON() {
  getItem("contacts").then((contacts) => {
    // Verarbeitung der geladenen Kontaktdaten
    console.log("Geladene Kontakte:", contacts);
  });
}


/* function patchEdit(index){
  let newName = document.getElementById('contactEditName').value;
  let newMail = document.getElementById('contactEditEmail').value;
  let newPhone = document.getElementById('contactEditPhone').value;
  console.log(contacts[index][userID])
  setItem("contacts", (contacts) => {
    const contactToUpdate = contacts.find((contact) => contact.userID === contacts[index]['userID']);
    contacts[index]['name'] = newName;
    contacts[index]['email'] = newMail;
    contacts[index]['phone'] = newPhone;
    return contacts;
  });
} */