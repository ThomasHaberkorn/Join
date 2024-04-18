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

    const contactsHtml = assignedContactIds
        .slice(0, maxVisibleContacts)
        .map((contactId) => {
            const contact = contacts.find((c) => c.userID === contactId);
            if (contact) {
                return `<div class="boardContact">
                            <div class="item-img" style="background-color: ${contact.color};">
                                ${contact.firstLetter}${contact.lastLetter}
                            </div>
                        </div>`;
            }
            return "";
        })
        .join("");

    if (additionalContacts > 0) {
        return (
            contactsHtml +
            `<div class="boardContact additional-contacts">+${additionalContacts}</div>`
        );
    }

    return contactsHtml;
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
 *
 * @param {Object} task - The task object containing the details.
 * @param {string} task.title - The title of the task.
 * @param {string} task.description - The description of the task.
 * @param {string} task.taskDate - The due date of the task.
 * @param {Array} task.assignedContacts - The contacts assigned to the task.
 * @param {string} task.category - The category of the task.
 * @returns {void}
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
 * 
 * @param {Object} task - The task object.
 * @param {string} task.id - The ID of the task.
 * @param {Array} task.subtasks - An array of subtasks.
 * @param {string} task.subtasks.name - The name of the subtask.
 * @param {boolean} task.subtasks.completed - Indicates whether the subtask is completed or not.
 * 
 * @returns {void}
 */
function setSubtasks(task) {
    const allTaskInformationSubtasks = document.getElementById(
        "allTaskInformationSubtasks"
    );
    allTaskInformationSubtasks.innerHTML = "";
    allTaskInformationSubtasks.style.listStyle = "none";
    task.subtasks.forEach((subtask, index) => {
        const subtaskElement = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = subtask.completed;
        checkbox.dataset.index = index;

        checkbox.addEventListener("change", function () {
            toggleSubtaskCompletion(task.id, index, this.checked);
        });

        subtaskElement.appendChild(checkbox);
        subtaskElement.appendChild(document.createTextNode(subtask.name));
        allTaskInformationSubtasks.appendChild(subtaskElement);
    });
}

/**
 * Opens all task information.
 * @param {Object} task - The task object.
 */
function openAllTaskInformation(task) {
    setTaskInformation(task);
    setPriorityInformation(task);
    setTaskDetails(task);
    setSubtasks(task);
}

/**
 * Creates a card element for a task.
 * @param {Object} task - The task object.
 * @param {string} task.id - The unique identifier for the task.
 * @param {string} task.status - The status of the task.
 * @returns {HTMLElement} The created card element.
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

/**
 * Creates a task card element based on the given task object.
 * 
 * @param {Object} task - The task object containing the necessary information.
 * @returns {HTMLElement} - The created task card element.
 */
function createTaskCard(task) {
    let card = createCardElement(task);
    let categoryDiv = createCategoryDiv(task);
    let progressHtml =
        task.subtasks && task.subtasks.length > 0
            ? calculateProgress(task)
            : "";
    const assignedContactElements = createAssignedContactElements(
        task.assignedContacts
    );
    const prioritySymbolHtml = getPrioritySymbolHtml(task, prioritySymbols);
    card.innerHTML = createCardHtml(
        task,
        categoryDiv,
        progressHtml,
        assignedContactElements,
        prioritySymbolHtml
    );
    addEventListenersToCard(card, task);
    return card;
}

/**
 * Updates the task columns by checking if there are any tasks in each column.
 * If there are no tasks in a column, a "No task available" message is displayed.
 * If there are tasks in a column and a "No task available" message is displayed, the message is removed.
 */
function updateTaskColumns() {
    document.querySelectorAll(".task-column").forEach((column) => {
        const hasTasks = Array.from(column.children).some((child) =>
            child.classList.contains("task-card")
        );
        const hasNoTaskMessage = !!column.querySelector(".no-task-message");

        if (!hasTasks && !hasNoTaskMessage) {
            let noTaskMessage = document.createElement("div");
            noTaskMessage.className = "no-task-message";
            noTaskMessage.textContent = "No task available";
            column.appendChild(noTaskMessage);
        } else if (hasTasks && hasNoTaskMessage) {
            let noTaskMessage = column.querySelector(".no-task-message");
            column.removeChild(noTaskMessage);
        }
    });
}

/**
 * Clears the task columns by removing all the HTML content inside each column.
 */
function clearTaskColumns() {
    document.querySelectorAll(".task-column").forEach((column) => {
        column.innerHTML = "";
    });
}

/**
 * Iterates over each task column and adds event listeners for dragover and drop events.
 * The dragover event is fired when an element or text selection is being dragged over a valid drop target (every few hundred milliseconds).
 * The drop event is fired when an element or text selection is dropped on a valid drop target.
 * @function
 */
taskColumns.forEach((column) => {
    column.addEventListener("dragover", handleDragOver);
    column.addEventListener("drop", handleDrop);
});

/**
 * Handles the drag start event.
 * 
 * @param {DragEvent} e - The drag start event object.
 */
function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
}

/**
 * Handles the drag over event.
 * @param {Event} e - The drag over event object.
 */
function handleDragOver(e) {
    e.preventDefault();
}

/**
 * Handles the drop event when a draggable element is dropped onto a task column.
 * 
 * @param {DragEvent} e - The drop event object.
 */
function handleDrop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text");
    const draggableElement = document.getElementById(id);

    const newStatus = e.target.closest(".task-column").id;
    draggableElement.dataset.status = newStatus;

    e.target.closest(".task-column").appendChild(draggableElement);
    updateTaskInRemoteStorage(id, newStatus);
    updateTaskColumns();
}

/**
 * Updates the status of a task in the remote storage.
 * @param {string} taskId - The ID of the task to update.
 * @param {string} newStatus - The new status of the task.
 * @returns {Promise<void>} - A Promise that resolves when the task is updated in the remote storage.
 */
async function updateTaskInRemoteStorage(taskId, newStatus) {
    let tasks = JSON.parse((await getItem("tasks")).value || "[]");
    let taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].status = newStatus;
        await setItemFromJson("tasks", tasks);
    }
}

/**
 * Removes priority classes from an element and updates the corresponding images.
 * @param {HTMLElement} element - The element from which to remove priority classes.
 */
function removePriorityClasses(element) {
    element.classList.remove(
        "priority-urgent",
        "priority-medium",
        "priority-low"
    );
    document.querySelector(`.edit-prio[data-prio='Urgent'] img`).src =
        "./assets/img/addTask/Prio alta.png";
    document.querySelector(`.edit-prio[data-prio='Medium'] img`).src =
        "./assets/img/addTask/Prio media.png";
    document.querySelector(`.edit-prio[data-prio='Low'] img`).src =
        "./assets/img/addTask/Capa 2 (4).png";
}

/**
 * Adds a priority class to the specified element based on the given priority.
 * Also updates the image source based on the priority.
 *
 * @param {HTMLElement} element - The element to add the priority class to.
 * @param {string} priority - The priority value ("Urgent", "Medium", or "Low").
 */
function addPriorityClass(element, priority) {
    switch (priority) {
        case "Urgent":
            element.classList.add("priority-urgent");
            element.querySelector("img").src =
                "./assets/img/selectedUrgent.png";
            break;
        case "Medium":
            element.classList.add("priority-medium");
            element.querySelector("img").src =
                "./assets/img/selectedMedium.png";
            break;
        case "Low":
            element.classList.add("priority-low");
            element.querySelector("img").src = "./assets/img/selectedLow.png";
            break;
    }
}

/**
 * Sets the priority value of an element.
 *
 * @param {HTMLElement} element - The element to set the priority value for.
 * @param {number} priority - The priority value to set.
 * @returns {void}
 */
function setPriorityValue(element, priority) {
    element.value = priority;
}

/**
 * Iterates over each button with the class "edit-prio" and adds a click event listener.
 * When the button is clicked, it removes the priority classes from all buttons, adds the priority class to the clicked button, and sets the priority value.
 * @function
 */
document.querySelectorAll(".edit-prio").forEach((button) => {
    button.addEventListener("click", function () {
        document.querySelectorAll(".edit-prio").forEach(removePriorityClasses);
        addPriorityClass(this, this.dataset.prio);
        setPriorityValue(
            document.getElementById("editPriority"),
            this.dataset.prio
        );
    });
});

/**
 * Closes all task information and initializes the board.
 */
function closeAllTaskInformation() {
    const allTaskInformation = document.getElementById("allTaskInformation");
    allTaskInformation.style.display = "none";
    initBoard();
}

/**
 * Deletes a task from the board.
 * @async
 * @function deleteTask
 * @returns {Promise<void>} A Promise that resolves when the task is deleted.
 */
async function deleteTask() {
    const allTaskInformation = document.getElementById("allTaskInformation");

    const taskId = allTaskInformation.dataset.taskId;
    let tasks = JSON.parse((await getItem("tasks")).value || "[]");
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex !== -1) {
        const taskCard = document.getElementById(tasks[taskIndex].id);
        if (taskCard) {
            taskCard.remove();
            tasks.splice(taskIndex, 1);
            await setItemFromJson("tasks", tasks);
        }
    }
    closeAllTaskInformation();
    await initBoard();
}

/**
 * Retrieves the details of a task category.
 * @param {string} taskCategory - The category of the task.
 * @returns {Object} - An object containing the text and className of the category.
 */
function getCategoryDetails(taskCategory) {
    if (taskCategory === "Technical Task") {
        return {
            text: "Technical Task",
            className: "category-technical",
        };
    } else if (taskCategory === "User Story") {
        return {
            text: "User Story",
            className: "category-userstory",
        };
    } else {
        return {
            text: "Category not set",
            className: "category-default",
        };
    }
}

/**
 * Closes the task editor modal by hiding it.
 */
function closeEditor() {
    const editTaskInformation = document.getElementById("taskEditorModal");
    const allTaskInformation = document.getElementById("allTaskInformation");
    editTaskInformation.style.display = "none";
}

/**
 * Sets the task editor category based on the provided category.
 * @param {string} category - The category to set for the task editor.
 */
function setTaskEditorCategory(category) {
    const {className, text} = getCategoryDetails(category);
    const taskEditorCategory = document.getElementById("taskEditorCategory");
    taskEditorCategory.textContent = text;
    taskEditorCategory.className = className;
}
