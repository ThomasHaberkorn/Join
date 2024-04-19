/**
 * This file contains the implementation of the board functionality.
 * It includes functions for initializing the board, sorting tasks, displaying tasks, and creating task cards.
 * It also defines constants for priority symbols and selects task columns.
 * @file FILEPATH: /c:/Users/Karim/Desktop/DA/Join/Join/js/board.js
 */
document.addEventListener("DOMContentLoaded", async function () {
    await loadContacts();
});

/**
 * Initializes the board by performing various tasks.
 * @returns {Promise<void>} A promise that resolves when the board is initialized.
 */
async function initBoard() {
    await includeW3();
    await sortTasks();
    boardActive();
    showInitials();
    updateTaskColumns();
    clearTaskColumns();
    displayTasks();
}

/**
 * Object containing priority symbols and their corresponding image paths.
 * @type {Object.<string, string>}
 */
const prioritySymbols = {
    Urgent: "./assets/img/urgentSymbol.png",
    Medium: "./assets/img/mediumSymbol.png",
    Low: "./assets/img/lowSymbol.png",
};

/**
 * Represents a collection of task columns.
 * @type {NodeListOf<Element>}
 */
const taskColumns = document.querySelectorAll(".task-column");

/**
 * Sorts the tasks based on the user level.
 * If the user level is "user", it filters the tasks that have a userLevel of "user".
 * If the user level is not "user", it filters the tasks that have a userLevel of "guest" or null.
 * @returns {Promise<void>} A promise that resolves when the tasks are sorted.
 */
async function sortTasks() {
    try {
        const userLevel = sessionStorage.getItem("userLevel");
        let taskTemp = JSON.parse((await getItem("tasks")).value || "[]");
        if (userLevel === "user") {
            const userTasks = taskTemp.filter((t) => t.userLevel === "user");
            tasks = userTasks;
        } else {
            const userTasks = taskTemp.filter(
                (t) => t.userLevel === "guest" || t.userLevel == null
            );
            tasks = userTasks;
        }
    } catch (error) {
        console.error("Fehler beim Laden der Aufgaben:", error);
    }
}

/**
 * Displays tasks on the board.
 */
function displayTasks() {
    tasks.forEach((task) => {
        if (document.getElementById(task.status)) {
            let taskCard = createTaskCard(task);
            document.getElementById(task.status).appendChild(taskCard);
        }
    });
    updateTaskColumns();
}

/**
 * Makes the boardSum element active by adding the "bgfocus" class.
 */
function boardActive() {
    document.getElementById("boardSum").classList.add("bgfocus");
}

/**
 * Retrieves the HTML elements for the assigned contacts.
 * @param {Array} assignedContactIds - The array of assigned contact IDs.
 * @returns {string} - The HTML elements representing the assigned contacts.
 */
function getAssignedContactElements(assignedContactIds) {
    const maxVisibleContacts = 3;
    const additionalContacts = assignedContactIds.length - maxVisibleContacts;
    const contactsHtml = generateContactsHtml(assignedContactIds, maxVisibleContacts);
    if (additionalContacts > 0) {
        return appendAdditionalContacts(contactsHtml, additionalContacts);
    }
    return contactsHtml;
}

function generateContactsHtml(assignedContactIds, maxVisibleContacts) {
    return assignedContactIds
        .slice(0, maxVisibleContacts)
        .map((contactId) => createContactHtml(contactId))
        .join("");
}

function createContactHtml(contactId) {
    const contact = findContact(contactId);
    if (contact) {
        return `<div class="boardContact">
                    <div class="item-img" style="background-color: ${contact.color};">
                        ${contact.firstLetter}${contact.lastLetter}
                    </div>
                </div>`;
    }
    return "";
}

function findContact(contactId) {
    return contacts.find((c) => c.userID === contactId);
}

function appendAdditionalContacts(contactsHtml, additionalContacts) {
    return contactsHtml + `<div class="boardContact additional-contacts">+${additionalContacts}</div>`;
}

/**
 * Returns the HTML markup for displaying assigned contacts.
 *
 * @param {Array} assignedContactIds - An array of contact IDs.
 * @returns {string} - The HTML markup for displaying assigned contacts.
 */
function getAssignedContactDisplay(assignedContactIds) {
    return assignedContactIds
        .map((contactId) => {
            const contact = contacts.find((c) => c.userID === contactId);
            if (contact) {
                return `
                    <div class="contact-display" style="padding-left: 15px; margin-top: 10px; display: flex; align-items: center; gap: 15px;">
                        <div class="contact-avatar" style="background-color: ${contact.color};">
                            ${contact.firstLetter}${contact.lastLetter}
                        </div>
                        <div class="contact-name">${contact.name}</div>
                    </div>
                `;
            }
            return "";
        })
        .join("");
}

/**
 * Creates HTML markup for a list of subtasks.
 *
 * @param {Array} subtasks - An array of subtasks.
 * @returns {string} - The HTML markup for the subtasks.
 */
function createSubtasksHtml(subtasks) {
    let subtasksHtml = '<ul class="task-card-subtasks">';
    subtasks.forEach((subtask) => {
        subtasksHtml += `<li>${subtask}</li>`;
    });
    subtasksHtml += "</ul>";
    return subtasksHtml;
}

/**
 * Creates a category div based on the given task.
 * @param {object} task - The task object.
 * @returns {string} The HTML string representing the category div.
 */
function createCategoryDiv(task) {
    const {className, text} = getCategoryDetails(task.category);
    return `<div class="${className}">${text}</div>`;
}

/**
 * Creates assigned contact elements based on the given assigned contacts.
 *
 * @param {Array} assignedContacts - The array of assigned contacts.
 * @returns {Array} - The array of assigned contact elements.
 */
function createAssignedContactElements(assignedContacts) {
    return getAssignedContactElements(assignedContacts);
}

/**
 * Returns the HTML representation of the priority symbol for a task.
 *
 * @param {object} task - The task object.
 * @param {object} prioritySymbols - The priority symbols object.
 * @returns {string} The HTML representation of the priority symbol.
 */
function getPrioritySymbolHtml(task, prioritySymbols) {
    const prioritySymbol = prioritySymbols[task.priority];
    return prioritySymbol
        ? `<img src="${prioritySymbol}" class="priority-symbol" alt="${task.priority}" style="margin-left: 10px;">`
        : "";
}

/**
 * Calculates the progress of a task based on its subtasks.
 * @param {Object} task - The task object.
 * @param {Array} task.subtasks - An array of subtasks.
 * @param {boolean} task.subtasks.completed - Indicates whether the subtask is completed or not.
 * @returns {string} - The HTML representation of the progress bar and subtask count.
 */
function calculateProgress(task) {
    const totalSubtasks = task.subtasks.length;
    const completedSubtasks = task.subtasks.filter(
        (subtask) => subtask.completed
    ).length;
    const progressPercentage =
        totalSubtasks === 0 ? 0 : (completedSubtasks / totalSubtasks) * 100;

    return `
        <div class="subtaskWithProgressBar">
        <div class="progress" >
            <div class="progress-bar" style="width: ${progressPercentage}%"></div>
        </div>
        <div class="subtaskNextToProgressBar";">${completedSubtasks}/${totalSubtasks} Subtasks</div>
        </div>
    `;
}

/**
 * Creates the HTML markup for a task card.
 *
 * @param {Object} task - The task object.
 * @param {string} categoryDiv - The category div HTML.
 * @param {string} progressHtml - The progress HTML.
 * @param {string} assignedContactElements - The assigned contact elements HTML.
 * @param {string} prioritySymbolHtml - The priority symbol HTML.
 * @returns {string} - The HTML markup for the task card.
 */
function createCardHtml(
    task,
    categoryDiv,
    progressHtml,
    assignedContactElements,
    prioritySymbolHtml
) {
    return `
        <div class="task-card-header">${categoryDiv}</div>
        <div class="task-card-title">${task.title}</div>
        <div class="task-card-description">${task.description}</div>
        </div><div class="boardProgrContainer">${progressHtml}</div> <!-- Progress-Bar und Subtasks-Anzeige einfügen -->
        <div class="prioAndContact">
            <div style="display: flex;">${assignedContactElements}</div>
            ${prioritySymbolHtml} <!-- Füge das Prioritätssymbol hinzu -->
        </div>
    `;
}

/**
 * Sets the task information in the DOM.
 * 
 * @param {Object} task - The task object containing the task information.
 */
function setTaskInformation(task) {
    const allTaskInformation = document.getElementById("allTaskInformation");
    allTaskInformation.dataset.taskId = task.id;
    allTaskInformation.style.display = "flex";
}

/**
 * Sets the priority information for a task.
 *
 * @param {object} task - The task object containing the priority information.
 */
function setPriorityInformation(task) {
    const prioritySymbol = prioritySymbols[task.priority];
    const prioritySymbolHtml = prioritySymbol
        ? `<img src="${prioritySymbol}" class="priority-symbol" alt="${task.priority}" style="vertical-align: middle; margin-left: 5px;">`
        : "";
    const allTaskInformationPriority = document.getElementById(
        "allTaskInformationPriority"
    );
    allTaskInformationPriority.innerHTML = task.priority + prioritySymbolHtml;
}

/**
 * Sets the task details on the UI.
 */
function setTaskDetails(task) {
    const allTaskInformationTitle = document.getElementById(
        "allTaskInformationTitle"
    );
    allTaskInformationTitle.textContent = task.title;

    const allTaskInformationDescription = document.getElementById(
        "allTaskInformationDescription"
    );
    allTaskInformationDescription.textContent = task.description;

    const allTaskInformationDueDate = document.getElementById(
        "allTaskInformationDueDate"
    );
    allTaskInformationDueDate.textContent = task.taskDate;

    const allTaskInformationAssignedTo = document.getElementById(
        "allTaskInformationAssignedTo"
    );
    allTaskInformationAssignedTo.innerHTML = getAssignedContactDisplay(
        task.assignedContacts
    );

    const {className, text} = getCategoryDetails(task.category);
    const allTaskInformationCategory = document.getElementById(
        "allTaskInformationCategory"
    );
    allTaskInformationCategory.textContent = text;
    allTaskInformationCategory.className = className;
}

/**
 * Sets the subtasks for a given task.
 * @returns {void}
 */
function setSubtasks(task) {
    const allTaskInformationSubtasks = document.getElementById("allTaskInformationSubtasks");
    clearSubtasks(allTaskInformationSubtasks);
    task.subtasks.forEach((subtask, index) => {
        const subtaskElement = createSubtaskElement(subtask, index, task.id);
        allTaskInformationSubtasks.appendChild(subtaskElement);
    });
}

function clearSubtasks(allTaskInformationSubtasks) {
    allTaskInformationSubtasks.innerHTML = "";
    allTaskInformationSubtasks.style.listStyle = "none";
}

function createSubtaskElement(subtask, index, taskId) {
    const subtaskElement = document.createElement("li");
    const checkbox = createCheckbox(subtask, index, taskId);
    subtaskElement.appendChild(checkbox);
    subtaskElement.appendChild(document.createTextNode(subtask.name));
    return subtaskElement;
}

function createCheckbox(subtask, index, taskId) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = subtask.completed;
    checkbox.dataset.index = index;
    checkbox.addEventListener("change", function () {
        toggleSubtaskCompletion(taskId, index, this.checked);
    });
    return checkbox;
}

/**
 * Opens all task information.
 */
function openAllTaskInformation(task) {
    setTaskInformation(task);
    setPriorityInformation(task);
    setTaskDetails(task);
    setSubtasks(task);
}

/**
 * Creates a card element for a task.
 */
function createCardElement(task) {
    let card = document.createElement("article");
    card.className = "task-card";
    card.id = task.id || "task-" + Math.random().toString(36).substr(2, 9);
    card.setAttribute("draggable", true);
    card.dataset.status = task.status;
    return card;
}

/**
 * Adds event listeners to a card element.
 *
 * @param {HTMLElement} card - The card element to attach event listeners to.
 * @param {Task} task - The task associated with the card.
 */
function addEventListenersToCard(card, task) {
    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("click", function () {
        openAllTaskInformation(task);
    });
}

