/**
 * init the contact section
 */
async function initContact() {
    await includeW3();
    await loadContacts();
    contactActive();
    showInitials();
    hideContactResponsive();
    renderContactList();
    checkLoggedUser();
}

/**
 * show the initials of the contact
 * @returns
 */
function contactActive() {
    document.getElementById("contactSum").classList.add("bgfocus");
}

let contacts = [];
let previousIndex;
let contactCount = 0;

/**
 * load the contacts from the remote storage
 * @returns
 */
async function loadContacts() {
    // contacts = await JSON.parse(localStorage.getItem("contacts"));
    contacts = JSON.parse((await getItem("contacts")).value || "[]");
}

/**
 * render the contact list
 */
async function renderContactList() {
    let list = document.getElementById("listArea");
    list.innerHTML = "";
    let uniqueFirstLetters = new Set();
    sortContacts();
    for (i = 0; i < contacts.length; i++) {
        let firstLetter = contacts[i]["name"].charAt(0).toUpperCase();
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

/**
 * sort the contacts by name
 */
function sortContacts() {
    contacts.sort((a, b) => a["name"].localeCompare(b["name"]));
}

/**
 * show the add new contact screen
 */

function addNewContactScreen() {
    let addNewContact = document.getElementById("contactAddArea");
    addNewContact.style.display = "flex";
    addNewContact.innerHTML = "";
    addNewContact.innerHTML += addNewContactHTML();
}

/**
 * Create a new contact
 */
async function createNewContact(event) {
    event.preventDefault();
    let name = document.getElementById("contactAddName").value;
    let lastName = name.split(" ").pop();
    let newContact = {
        color: getRandomColor(),
        name: name,
        email: document.getElementById("contactAddEmail").value,
        phone: document.getElementById("contactAddPhone").value,
        firstLetter: name.charAt(0).toUpperCase(),
        lastLetter: lastName.charAt(0).toUpperCase(),
        userID: generateUserId(),
    };
    contacts.push(newContact);
    await saveContacts();
    await renderContactList();
    closeAddContact();
    contactSuccessfullCreated();
}

/**
 * User ID generation
 * @returns {string} id
 */
function generateUserId() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    let id;
    let unique = false;
    while (!unique) {
        contactCount += 1;
        const contactNumber = String(contactCount).padStart(2, "0");
        id = `${year}${month}${contactNumber}`;
        if (!contacts.some((contact) => contact.id === id)) {
            unique = true;
        }
    }
    return id;
}

/**
 * Create a random color
 */
function getRandomColor() {
    const getRandomHex = () =>
        Math.floor(Math.random() * 128)
            .toString(16)
            .padStart(2, "0");
    return `#${getRandomHex()}${getRandomHex()}${getRandomHex()}`;
}

/**
 * Delete the contact with the given index
 */
function deleteContact(index) {
    contacts.splice(index, 1);
    saveContacts();
    renderContactList();
    hideContactPopupEditDelete();
    closeContactFullResponsive();
    closeContact();
}

/**
 * Delete the contact with the given index
 */
function deleteContactBig(index) {
    contacts.splice(index, 1);
    saveContacts();
    renderContactList();
    document.getElementById("contactFull").style.transform = "translateX(100%)";
}

/**
 * close the BIG-contact view
 */
function closeContact() {
    let fullContact = document.getElementById("contactFull");
    if (fullContact) {
        fullContact.style.transform = "translateX(100%)";
        if (previousIndex !== -1) {
            document
                .getElementById(`info${previousIndex}`)
                .classList.remove("contactListShowActive");
            document
                .getElementById(`info${previousIndex}`)
                .classList.remove("contactListShowActive:hover");
            previousIndex = -1;
        }
    }
}
/**
 * Show the contact with the given index
 */
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

/**
 * remove the mark from the contact list
 */
function removeMark() {
    for (let i = 0; i < contacts.length; i++) {
        let element = document.getElementById(`info${i}`);
        if (element) {
            element.classList.remove("contactListShowActive");
        }
    }
}

/**
 * show the contact with the given index in the responsive view
 */
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

/**
 * show the value of the contact from remotestoarge
 */
function editContact(index) {
    let contactEdit = document.getElementById("contactEditArea");
    contactEdit.style.display = "flex";
    contactEdit.innerHTML = ``;
    contactEdit.innerHTML += editContactHTML(index);
    document.getElementById("contactEditName").defaultValue =
        contacts[index]["name"];
    document.getElementById("contactEditEmail").defaultValue =
        contacts[index]["email"];
    document.getElementById("contactEditPhone").defaultValue =
        contacts[index]["phone"];
    document.getElementById(`contactEditImage${index}`).style.backgroundColor =
        contacts[index]["color"];
    saveContacts();
}

/**
 * close the edit contact area
 */
function closeEditContact() {
    let contactEditVisible = document.getElementById("contactEditVisible");
    contactEditVisible.classList.add("slide-out-right");
    setTimeout(() => {
        document.getElementById("contactEditArea").style.display = "none";
        contactEditVisible.innerHTML = "";
    }, 400);
}

/**
 * close the contact responsive view
 */
function closeContactFullResponsive() {
    let contactFullResponsive = document.getElementById(
        "contactFullResponsive"
    );
    contactFullResponsive.classList.add("slide-out-left");
    removeMark();
    setTimeout(() => {
        contactFullResponsive.style.display = "flex";
        contactFullResponsive.innerHTML = "";
        contactFullResponsive.style.display = "none";
    }, 400);

}

/**
 * auxiliar function to hide the contact responsive view
 */
function hideContactResponsive() {
    const container = document.getElementById("contactFullResponsive");
    if (container) {
        if (window.innerWidth >= 950) {
            container.style.display = "none";
        } else {
            container.style.display = "flex";
        }
    }
}

/**
 *  auxiliar addEventListener to observe the window size
 */
window.addEventListener("resize", hideContactResponsive);

/**
 * show the initials of the contact
 */
function showContactPopupEditDelete() {
    let popupContactSmal = document.getElementById("contactPopupEditDelete");
    let popupAuxContainer = document.getElementById("popupAuxContainer");
    popupAuxContainer.style.display = "block";
    popupContactSmal.style.display = "flex";
    popupContactSmal.classList.remove(`slide-out-right-popup`);
    popupContactSmal.classList.add(`slide-in-right-popup`);
}

/**
 * hide the initials of the contact
 */
function hideContactPopupEditDelete() {
    let popupContactSmal = document.getElementById("contactPopupEditDelete");
    let popupAuxContainer = document.getElementById("popupAuxContainer");
    if (popupContactSmal && popupAuxContainer) {
        popupContactSmal.classList.remove(`slide-in-right-popup`);
        popupContactSmal.classList.add(`slide-out-right-popup`);
        setTimeout(() => {
            popupContactSmal.style.display = "none";
            popupAuxContainer.style.display = "none";
        }, 400);
    }
}

/**
 * @param {*} index Edit the contact with the given index
 * @returns
 */
function patchEdit(index) {
    index = parseInt(index);

    if (isNaN(index) || index < 0 || index >= contacts.length) {
        console.error("Invalid index");
        return;
    }
    let newName = document.getElementById("contactEditName").value;
    let newMail = document.getElementById("contactEditEmail").value;
    let newPhone = document.getElementById("contactEditPhone").value;
    let newFirstLetter = newName.charAt(0).toUpperCase();
    let newLastLetter = newName.split(" ").pop().charAt(0).toUpperCase();
    const updatedContact = {
        name: newName,
        email: newMail,
        phone: newPhone,
        firstLetter: newFirstLetter,
        lastLetter: newLastLetter,
    };
    contacts[index] = Object.assign(contacts[index], updatedContact);
    saveContacts();
    renderContactList();
    showContact(index);
}

/**
 * save the contacts in the remote storage
 */
async function saveContacts() {
    await setItem("contacts", contacts);
}

/**
 *  close the add contact area
 */
function closeAddContact() {
    let contactAddVisible = document.getElementById("contactAddVisible");
    contactAddVisible.classList.add("slide-out-right");
    setTimeout(() => {
        document.getElementById("contactAddArea").style.display = "none";
        contactAddVisible.innerHTML = "";
    }, 400);
}

/**
 * show the status of the new contact
 */
function contactSuccessfullCreated() {
    let contactSuccess = document.getElementById("contactSuccess");
    contactSuccess.style.display = "flex";
    contactSuccess.style.animation = "slideUpAndDown 2s ease-in-out";

    setTimeout(() => {
        contactSuccess.style.display = "none";
        contactSuccess.style.animation = "";
    }, 2000);
}
