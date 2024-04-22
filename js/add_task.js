/**
 * This file contains the code for adding a task in the application.
 * It includes functions for initializing the add task sidebar, handling checkbox changes,
 * setting priority levels, adding and removing subtasks, updating the subtask list,
 * and adding a task to the task list.
 */
let createBtn = document.getElementById("create-btn");
let urgentBtn = document.getElementById("urgentBtn");
let mediumBtn = document.getElementById("mediumBtn");
let lowBtn = document.getElementById("lowBtn");
let subtaskInput = document.getElementById("subtask");
let subtaskAddButton = document.getElementById("subtask-img");
let subtaskList = document.getElementById("list");
let openDropdown = document.getElementById("openDropdown");
let priorityButtons = {Urgent: urgentBtn, Medium: mediumBtn, Low: lowBtn};
let priority = "";
let subtasks = [];
let tasks = [];
let currentTaskStatus = "todo";

/**
 * Initializes the add sidebar.
 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
 */
async function initAddSidebar() {
    await includeW3();
    addTaskActive();
    showInitials();
}

/**
 * Adds the "bgfocus" class to the "addTasksum" element.
 */
function addTaskActive() {
    document.getElementById("addTasksum").classList.add("bgfocus");
}

document.addEventListener("DOMContentLoaded", async function () {
    await loadContacts();
    await loadTasks();
    fillContactDropdown();
    setPriorityLevel();
    setPriority("Medium");
});

/**
 * Loads contacts from storage and parses them into an array.
 * @returns {Promise<void>} A promise that resolves when the contacts are loaded.
 */
async function loadContacts() {
    contacts = JSON.parse((await getItem("contacts")).value || "[]");
}

/**
 * Loads tasks from storage and parses them into an array.
 * @returns {Promise<void>} A promise that resolves when the tasks are loaded.
 */
async function loadTasks() {
    tasks = JSON.parse((await getItem("tasks")).value || "[]");
}

/**
 * Fills the contact dropdown with contact options.
 */
function fillContactDropdown() {
    const dropdown = document.getElementById("dropDownContacts");
    contacts.forEach((contact) => {
        const div = document.createElement("div");
        div.classList.add("itemAndCheckbox");
        const initials = `${contact.firstLetter}${contact.lastLetter}`;
        div.innerHTML = `
            <div class="userInitials" style="background-color: ${contact.color};">${initials}</div>
            <div class="nameWithCheckbox">
                <label for="contact-${contact.userID}">${contact.name}</label>
                <input type="checkbox" class="contact-checkbox" id="contact-${contact.userID}" name="assignedContacts" value="${contact.userID}" onchange="handleCheckboxChange(this)">
            </div>
        `;
        dropdown.appendChild(div);
    });
}

/**
 * Handles the change event of a checkbox.
 * @param {HTMLInputElement} checkbox - The checkbox element that triggered the event.
 */
function handleCheckboxChange(checkbox) {
    const itemAndCheckbox = checkbox.closest(".itemAndCheckbox");
    if (checkbox.checked) {
        itemAndCheckbox.classList.add("checkedItemAndCheckbox");
    } else {
        itemAndCheckbox.classList.remove("checkedItemAndCheckbox");
    }
}

/**
 * Loads the checked user initials into the specified element.
 */
function loadCheckedUserInitials() {
    const editCheckedUserInitials = document.getElementById(
        "checkedUserInitials"
    );
    clearElement(editCheckedUserInitials);
    let initialsCount = 0;
    document
        .querySelectorAll(".contact-checkbox:checked")
        .forEach((checkbox) => {
            const contact = findContact(checkbox.value);
            if (contact && initialsCount < 3) {
                appendInitials(editCheckedUserInitials, contact);
                initialsCount++;
            } else if (contact) {
                updateRemaining(editCheckedUserInitials);
            }
        });
}

/**
 * Clears the HTML content of the specified element.
 * @param {HTMLElement} element - The DOM element to be cleared.
 */
function clearElement(element) {
    element.innerHTML = "";
}

/**
 * Searches for a contact by user ID within the contacts array.
 * @param {string} id - The user ID of the contact to find.
 * @returns {Object|null} The contact object if found, or null if no contact matches the ID.
 */
function findContact(id) {
    return contacts.find((c) => c.userID === id);
}

/**
 * Appends the initials of a contact to a parent element.
 * @param {HTMLElement} parentElement - The parent element to append the initials to.
 * @param {string} contact - The contact's initials.
 */
function appendInitials(parentElement, contact) {
    const initialsDiv = createInitialsDiv(contact);
    parentElement.appendChild(initialsDiv);
}

/**
 * Creates a div element with user initials.
 * @param {Object} contact - The contact object.
 * @param {string} contact.firstLetter - The first letter of the contact's name.
 * @param {string} contact.lastLetter - The last letter of the contact's name.
 * @param {string} contact.color - The background color for the initials div.
 * @returns {HTMLDivElement} The created initials div element.
 */
function createInitialsDiv(contact) {
    const initialsDiv = document.createElement("div");
    initialsDiv.className = "userInitials";
    initialsDiv.textContent = `${contact.firstLetter}${contact.lastLetter}`;
    initialsDiv.style.backgroundColor = contact.color;
    return initialsDiv;
}

/**
 * Updates the remaining task count by either incrementing the existing count or appending a new count element.
 * @param {HTMLElement} parentElement - The parent element to which the remaining count element will be appended if it doesn't exist.
 */
function updateRemaining(parentElement) {
    const remaining = document.querySelector(".userInitials.remaining");
    if (remaining) {
        incrementRemaining(remaining);
    } else {
        appendRemaining(parentElement);
    }
}

/**
 * Increments the value of the remainingElement by 1.
 * @param {HTMLElement} remainingElement - The element that displays the remaining value.
 */
function incrementRemaining(remainingElement) {
    remainingElement.textContent = `+${
        parseInt(remainingElement.textContent.slice(1)) + 1
    }`;
}

/**
 * Appends a remaining div element to the specified parent element.
 * @param {HTMLElement} parentElement - The parent element to which the remaining div will be appended.
 * @returns {void}
 */
function appendRemaining(parentElement) {
    const remainingDiv = createRemainingDiv();
    parentElement.appendChild(remainingDiv);
}

/**
 * Creates a div element representing the remaining tasks.
 * @returns {HTMLDivElement} The created div element.
 */
function createRemainingDiv() {
    const remainingDiv = document.createElement("div");
    remainingDiv.className = "userInitials remaining";
    remainingDiv.textContent = "+1";
    remainingDiv.style.backgroundColor = "lightblue";
    return remainingDiv;
}

/**
 * Sets the priority of a task.
 * @param {string} selectedPriority - The selected priority for the task.
 * @returns {void}
 */
function setPriority(selectedPriority) {
    priority = selectedPriority;
    resetButtons();
    updateSelectedButton(selectedPriority);
}

/**
 * Adds a subtask to the subtasks array and updates the subtask list.
 * @param {string} subtaskName - The name of the subtask to be added.
 */
function addSubtask(subtaskName) {
    let subtask = {
        name: subtaskName,
        completed: false,
    };
    subtasks.push(subtask);
    updateSubtaskList();
}

/**
 * Removes a subtask from the subtasks array at the specified index.
 * @param {number} index - The index of the subtask to remove.
 */
function removeSubtask(index) {
    subtasks.splice(index, 1);
    updateSubtaskList();
}

/**
 * Loads the checked user initials into the specified element.
 */
function loadCheckedUserInitials() {
    const editCheckedUserInitials = document.getElementById(
        "checkedUserInitials"
    );
    clearElement(editCheckedUserInitials);
    let initialsCount = 0;
    document
        .querySelectorAll(".contact-checkbox:checked")
        .forEach((checkbox) => {
            const contact = findContact(checkbox.value);
            if (contact && initialsCount < 3) {
                appendInitials(editCheckedUserInitials, contact);
                initialsCount++;
            } else if (contact) {
                updateRemaining(editCheckedUserInitials);
            }
        });
}

/**
 * Clears the HTML content of the specified element.
 * @param {HTMLElement} element - The DOM element to be cleared.
 */
function clearElement(element) {
    element.innerHTML = "";
}

/**
 * Searches for a contact by user ID within the contacts array.
 * @param {string} id - The user ID of the contact to find.
 * @returns {Object|null} The contact object if found, or null if no contact matches the ID.
 */
function findContact(id) {
    return contacts.find((c) => c.userID === id);
}

/**
 * Appends a div containing the initials of a contact to a parent element.
 * @param {HTMLElement} parentElement - The parent DOM element to which the initials div will be appended.
 * @param {Object} contact - The contact whose initials are to be displayed.
 */
function appendInitials(parentElement, contact) {
    const initialsDiv = createInitialsDiv(contact);
    parentElement.appendChild(initialsDiv);
}

/**
 * Creates a div element displaying the initials of a contact.
 * @param {Object} contact - The contact whose initials are to be displayed. Expects 'firstLetter', 'lastLetter', and 'color' properties.
 * @returns {HTMLElement} A div element with the contact's initials styled with their associated color.
 */
function createInitialsDiv(contact) {
    const initialsDiv = document.createElement("div");
    initialsDiv.className = "userInitials";
    initialsDiv.textContent = `${contact.firstLetter}${contact.lastLetter}`;
    initialsDiv.style.backgroundColor = contact.color;
    return initialsDiv;
}

/**
 * Updates or appends a "remaining" count of user initials if it already exists, otherwise creates a new one.
 * @param {HTMLElement} parentElement - The parent element where the "remaining" initials counter may be appended if it doesn't exist.
 */
function updateRemaining(parentElement) {
    const remaining = document.querySelector(".userInitials.remaining");
    if (remaining) {
        incrementRemaining(remaining);
    } else {
        appendRemaining(parentElement);
    }
}

/**
 * Increments the number displayed in the "remaining" element, typically used to indicate how many more items or initials are left to show.
 * @param {HTMLElement} remainingElement - The element containing the current remaining count to be incremented.
 */
function incrementRemaining(remainingElement) {
    remainingElement.textContent = `+${
        parseInt(remainingElement.textContent.slice(1)) + 1
    }`;
}

/**
 * Appends a newly created "remaining" div to a specified parent element. This div indicates additional items or initials not directly displayed.
 * @param {HTMLElement} parentElement - The parent DOM element to which the "remaining" div will be appended.
 */
function appendRemaining(parentElement) {
    const remainingDiv = createRemainingDiv();
    parentElement.appendChild(remainingDiv);
}

/**
 * Creates a div element that represents additional items or initials not shown. Initializes with a count of "+1".
 * @returns {HTMLElement} A div with the class "userInitials remaining", styled and initialized to indicate additional items.
 */
function createRemainingDiv() {
    const remainingDiv = document.createElement("div");
    remainingDiv.className = "userInitials remaining";
    remainingDiv.textContent = "+1";
    remainingDiv.style.backgroundColor = "lightblue";
    return remainingDiv;
}

/**
 * Handles the form submission to add a new task to the tasks list. Validates the category,
 * collects form data, creates a new task ID, and stores the task. Redirects to the task board upon successful addition.
 * @param {Event} event - The form submission event, used to prevent the default form submission behavior.
 */
async function addTask(event) {
    event.preventDefault();
    let category = document.getElementById("category").value;
    if (!validateCategory(category)) {
        return;
    }
    let title = document.getElementById("titleInput").value;
    let description = document.getElementById("descriptionInput").value;
    let taskDate = document.getElementById("taskDate").value;
    let assignedContacts = getAssignedContacts();
    let userLevel = sessionStorage.getItem("userLevel");
    let newTaskId = generateTaskId();
    addTaskToTasks(
        newTaskId,
        title,
        description,
        taskDate,
        category,
        userLevel,
        assignedContacts
    );
    await setItem("tasks", tasks);
    window.location.href = "board.html";
}

/**
 * Validates if a category is selected. Displays an error message if no category is chosen.
 * @param {string} category - The category to validate.
 * @returns {boolean} True if a category is selected, false otherwise.
 */
function validateCategory(category) {
    if (!category) {
        displayCategoryError();
        return false;
    } else {
        hideCategoryError();
        return true;
    }
}

/**
 * Displays an error message related to category selection. Creates an error message element if it does not already exist.
 */
function displayCategoryError() {
    let errorMsg = document.getElementById("categoryError");
    if (!errorMsg) {
        errorMsg = createCategoryErrorElement();
        document
            .getElementById("category")
            .parentElement.parentElement.appendChild(errorMsg);
    }
    errorMsg.textContent = "Please choose a Category.";
    errorMsg.style.display = "block";
}
