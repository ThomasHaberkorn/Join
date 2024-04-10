async function initContact() {
    await includeW3();
    contactActive();
    showInitials();
    hideContactResponsive();
    renderContactList();
    initContactLS();
    checkLoggedUser();
}

function contactActive() {
    document.getElementById("contactSum").classList.add("bgfocus");
}

let previousIndex;
let contactCount = 0;

function renderContactList() {
    let list = document.getElementById("listArea");
    list.innerHTML = "";
    let uniqueFirstLetters = new Set();
    sortContacts();
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

function sortContacts() {
    initContactLS();
    contacts.sort((a, b) => a["name"].localeCompare(b["name"])); 
}

function addNewContactScreen() {
    let addNewContact = document.getElementById('contactAddArea');
    addNewContact.style.display = "flex";
    addNewContact.innerHTML = "";
    addNewContact.innerHTML += addNewContactHTML();
}

function createNewContact() {
    let name = document.getElementById("contactAddName").value;
    let lastName = name.split(' ').pop();
    let newContact = {
        color: getRandomColor(),
        name: name,
        email: document.getElementById("contactAddEmail").value,
        phone: document.getElementById("contactAddPhone").value,
        firstLetter: name.charAt(0),
        lastLetter: lastName.charAt(0),
        id: generateUserId(),
    };
    contacts.push(newContact);
    sortContacts();
   
    renderContactList();
    closeAddContact();
}

function generateUserId() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    let id;
    let unique = false;
    while (!unique) {
        contactCount += 1;
        const contactNumber = String(contactCount).padStart(2, '0');
        id = `${year}${month}${contactNumber}`;
        if (!contacts.some(contact => contact.id === id)) {
            unique = true;
        }
    }
    return id;
}

function getRandomColor() {
    const getRandomHex = () => Math.floor(Math.random() * 128).toString(16).padStart(2, '0');
    return `#${getRandomHex()}${getRandomHex()}${getRandomHex()}`;
}

function deleteContact(index) {
    contacts.splice(index, 1);
    saveLocalstorage();
    renderContactList();
    hideContactPopupEditDelete();
    closeContactFullResponsive();
}

function deleteContactBig(index) {
    contacts.splice(index, 1);
    saveLocalstorage();
    renderContactList();
    document.getElementById("contactFull").style.transform = "translateX(100%)";
}

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
            document.getElementById(`listContactBig${index}`).style.backgroundColor = contacts[index]["color"];
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
        let element = document.getElementById(`info${i}`);
        if (element) {
            element.classList.remove("contactListShowActive");
        }
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

function closeEditContact() {
    let contactEditVisible = document.getElementById("contactEditVisible");
    contactEditVisible.classList.add("slide-out-right");
    setTimeout(() => {
        document.getElementById("contactEditArea").style.display = "none";
        contactEditVisible.innerHTML = "";
    }, 400);
}

function closeContactFullResponsive() {
    let contactFullResponsive = document.getElementById("contactFullResponsive");
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

function showContactPopupEditDelete() {
    let popupContactSmal = document.getElementById("contactPopupEditDelete");
    let popupAuxContainer = document.getElementById("popupAuxContainer");
    popupAuxContainer.style.display = "block";
    popupContactSmal.style.display = "flex";
    popupContactSmal.classList.remove(`slide-out-right-popup`);
    popupContactSmal.classList.add(`slide-in-right-popup`);
}

function hideContactPopupEditDelete() {
    let popupContactSmal = document.getElementById("contactPopupEditDelete");
    let popupAuxContainer = document.getElementById("popupAuxContainer");
    popupContactSmal.classList.remove(`slide-in-right-popup`);
    popupContactSmal.classList.add(`slide-out-right-popup`);
    setTimeout(() => {
        popupContactSmal.style.display = "none";
        popupAuxContainer.style.display = "none";
    }, 400);
}

function patchEdit(index) {
    index = parseInt(index);
    if (isNaN(index) || index < 0 || index >= contacts.length) {
        console.error("Invalid index");
        return;
    }
    let newName = document.getElementById("contactEditName").value;
    let newMail = document.getElementById("contactEditEmail").value;
    let newPhone = document.getElementById("contactEditPhone").value;
    const updatedContact = {
        name: newName,
        email: newMail,
        phone: newPhone,
    };
    contacts[index] = Object.assign(contacts[index], updatedContact);
    saveLocalstorage();
    renderContactList();
    showContact(index);
}

function loadLocalstorage() {
    contacts = JSON.parse(localStorage.getItem("contacts"));
}

function saveLocalstorage() {
    let contactsJSON = JSON.stringify(contacts);
    localStorage.setItem('contacts', contactsJSON);
}
function initContactLS() {
    if (localStorage.getItem("contacts")) {
        loadLocalstorage();
    } else {
        saveLocalstorage();
    }
}

function closeAddContact() {
    let contactAddVisible = document.getElementById("contactAddVisible");
    contactAddVisible.classList.add("slide-out-right");
    setTimeout(() => {
        document.getElementById("contactAddArea").style.display = "none";
        contactAddVisible.innerHTML = "";
    }, 400);
}
