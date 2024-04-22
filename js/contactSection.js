let contacts = [];
let previousIndex;
let contactCount = 0;

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
 */
function contactActive() {
    document.getElementById("contactSum").classList.add("bgfocus");
}

/**
 * load the contacts from the remote storage
 */
async function loadContacts() {
    contacts = JSON.parse((await getItem("contacts")).value || "[]");
}

/**
 * Renders a sorted contact list in the specified HTML element. It displays contacts grouped by the first letter of their names, adding unique first letters as headers.
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
 * Sorts the global contacts array alphabetically by contact name using locale comparison.
 */
function sortContacts() {
    contacts.sort((a, b) => a["name"].localeCompare(b["name"]));
}

/**
 * Displays the "Add New Contact" screen by setting its display style to flex and populating it with HTML content.
 */
function addNewContactScreen() {
    let addNewContact = document.getElementById("contactAddArea");
    addNewContact.style.display = "flex";
    addNewContact.innerHTML = "";
    addNewContact.innerHTML += addNewContactHTML();
}

/**
 * Handles the creation of a new contact from form inputs, adds it to the contacts array, and updates the UI.
 * Prevents the default form submission event, extracts and processes the contact data, and saves it.
 * Finally, it re-renders the contact list, closes the form, and displays a success notification.
 * @param {Event} event - The event object from the form submission.
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
 * Generates a unique user ID using the current date and a sequential number, ensuring no duplicates in the contacts array.
 * @returns {string} The unique user ID in the format YYYYMMNN.
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
 * Generates a random color in hexadecimal format.
 * @returns {string} A string representing a hex color code.
 */
function getRandomColor() {
    const getRandomHex = () =>
        Math.floor(Math.random() * 128)
            .toString(16)
            .padStart(2, "0");
    return `#${getRandomHex()}${getRandomHex()}${getRandomHex()}`;
}

/**
 * Deletes a contact at a specified index from the contacts array, updates storage, and refreshes the UI.
 * @param {number} index - The index of the contact to delete in the contacts array.
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
 * Deletes a contact at the specified index from the contacts array, saves the updated list,
 * refreshes the contact display, and slides the contact detail view off the screen.
 * @param {number} index - The index of the contact to be deleted.
 */
function deleteContactBig(index) {
    contacts.splice(index, 1);
    saveContacts();
    renderContactList();
    document.getElementById("contactFull").style.transform = "translateX(100%)";
}

/**
 * Closes the detailed contact view by sliding it out of view and removes the active class from the previously selected contact.
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
 * Applies a CSS transform to a specified HTML element with a smooth transition effect.
 * @param {HTMLElement} element - The DOM element to which the transform will be applied.
 * @param {string} transformValue - The CSS transform value to apply (e.g., "translateX(0)").
 */
function applyTransform(element, transformValue) {
    element.style.transition = "transform 0.4s ease";
    element.style.transform = transformValue;
}

/**
 * Removes an active CSS class from the specified contact element, effectively un-highlighting it in the UI.
 * @param {number} index - The index of the contact in the list, used to identify the specific HTML element.
 */
function removeActiveClassFromPreviousContact(index) {
    document
        .getElementById(`info${index}`)
        .classList.remove("contactListShowActive");
}

/**
 * Adds active class to the current contact element.
 * @param {number} index - The index of the contact element.
 */
function addActiveClassToCurrentContact(index) {
    document
        .getElementById(`info${index}`)
        .classList.add("contactListShowActive");
    document
        .getElementById(`info${index}`)
        .classList.add("contactListShowActive:hover");
}

/**
 * Updates the detailed view of a contact by clearing existing content and inserting new HTML.
 * It also applies a sliding animation and updates the background color based on the contact's specific color.
 * @param {number} index - The index of the contact in the contacts array to display.
 */
function updateFullContact(index) {
    let fullContact = document.getElementById("contactFull");
    fullContact.innerHTML = "";
    fullContact.innerHTML += renderShowContactHTML(index);
    fullContact.style.transform = "translateX(0)";
    document.getElementById(`listContactBig${index}`).style.backgroundColor =
        contacts[index]["color"];
}

/**
 * Displays a contact's full details in a designated panel. If the contact is already selected, it hides the panel.
 * For smaller screens, it invokes a responsive display method. This function manages UI transitions
 * and ensures the active contact is highlighted, while previous selections are unmarked.
 * @param {number} index - The index of the contact in the contacts array to display or hide.
 */
function showContact(index) {
    let fullContact = document.getElementById("contactFull");
    applyTransform(fullContact, "translateX(100%)");
    if (previousIndex === index) {
        previousIndex = -1;
        removeActiveClassFromPreviousContact(index);
    } else {
        removeMark();
        addActiveClassToCurrentContact(index);
        setTimeout(() => updateFullContact(index), 400);
        if (window.innerWidth < 950) {
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
 * Displays the contact information in a responsive view for a given index. It handles UI transitions for entering
 * the contact view and updates the display content accordingly.
 * @param {number} index - The index of the contact in the contacts array to be displayed.
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
 * Displays the editing interface for a specific contact from the contacts array. It populates form fields with the contact's existing values and allows for modifications.
 * @param {number} index - The index of the contact to edit in the contacts array.
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
 * Closes the edit contact area by applying a slide-out animation and then hiding the element. It also clears the content after the animation completes.
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
 * Closes the responsive view of a contact by applying a slide-out animation to the left. It also clears the content of the view after the animation and resets display properties.
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
 * Conditionally hides or shows the responsive contact view based on the window's width. It sets the display to 'none' for wider screens and 'flex' for narrower screens.
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
 * Displays a popup for editing or deleting a contact by applying a slide-in animation. It makes the popup visible and adjusts CSS classes for the animation.
 */
function showContactPopupEditDelete() {
    let popupContactSmal = document.getElementById("contactPopupEditDelete");
    let popupAuxContainer = document.getElementById("popupAuxContainer");
    popupAuxContainer.style.display = "block";
    popupContactSmal.style.display = "flex";
    popupContactSmal.classList.remove(`slide-out-right-popup`);
    popupContactSmal.classList.add(`slide-in-right-popup`);
}

/** Hides the popup for editing or deleting a contact by applying a slide-out animation.
 * The popup and its auxiliary container are set to invisible after the animation completes.
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
 * Updates a contact at a specific index with new data collected from input fields. Validates the index, retrieves updated contact data, merges it with existing data, saves the updated contacts array, and refreshes the contact list display.
 * @param {number} index - The index of the contact to be edited in the contacts array.
 */
function patchEdit(index) {
    index = parseInt(index);
    if (isNaN(index) || index < 0 || index >= contacts.length) {
        console.error("Invalid index");
        return;
    }

    const updatedContact = getUpdatedContactFromInput();
    contacts[index] = Object.assign(contacts[index], updatedContact);
    saveContacts();
    renderContactList();
    showContact(index);
}

/**
 * Constructs and returns a contact object based on user input from form fields. This includes the contact's name, email, phone number, and the initials derived from the name.
 * @returns {Object} An object containing the contact's details: name, email, phone, and capitalized initials (first and last letters).
 */
function getUpdatedContactFromInput() {
    let name = document.getElementById("contactEditName").value;
    let email = document.getElementById("contactEditEmail").value;
    let phone = document.getElementById("contactEditPhone").value;
    let firstLetter = name.charAt(0).toUpperCase();
    let lastLetter = name.split(" ").pop().charAt(0).toUpperCase();
    return {
        name: name,
        email: email,
        phone: phone,
        firstLetter: firstLetter,
        lastLetter: lastLetter,
    };
}

/**
 * save the contacts in the remote storage
 */
async function saveContacts() {
    await setItem("contacts", contacts);
}

/**
 * Closes the add contact area with a slide-out-right animation, then hides and clears the content after the animation completes.
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
 * Displays a success notification for a newly created contact using an animation. The notification appears with a slide-up-and-down effect and then disappears after 2 seconds.
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
