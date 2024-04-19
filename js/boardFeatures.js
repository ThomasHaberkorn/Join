/**
 * Toggles the display of an element.
 *
 * @param {string} elementId - The ID of the element to toggle.
 * @param {string} display - The display value to set for the element.
 */
function toggleDisplay(elementId, display) {
    const element = document.getElementById(elementId);
    element.style.display = display;
}

/**
 * Retrieves a task by its ID.
 *
 * @param {string} taskId - The ID of the task to retrieve.
 * @returns {Object|undefined} - The task object if found, otherwise undefined.
 */
async function getTaskById(taskId) {
    const tasks = JSON.parse((await getItem("tasks")).value || []);
    return tasks.find((task) => task.id === taskId);
}

/**
 * Fills the task editor with the provided task details.
 * @param {object} task - The task object containing the task details.
 */
function fillTaskEditor(task) {
    setTaskEditorCategory(task.category);
    document.getElementById("editTitle").value = task.title;
    document.getElementById("editDescription").value = task.description;
    document.getElementById("editDueDate").value = task.taskDate;
    const prioritySelect = document.getElementById("editPriority");
    prioritySelect.value = task.priority;
}

/**
 * Creates checkboxes for each contact and appends them to the dropdownEdit element.
 * @param {Object} task - The task object.
 */
function createContactCheckboxes(task) {
    const dropdownEdit = document.getElementById("dropDownContactsEdit");
    clearDropdownEdit(dropdownEdit);
    contacts.forEach((contact) => {
        const isChecked = task.assignedContacts.includes(contact.userID);
        const checkboxId = `contact-edit-${contact.userID}`;
        const div = createContactDiv(contact, isChecked, checkboxId);
        dropdownEdit.appendChild(div);
    });
}

function clearDropdownEdit(dropdownEdit) {
    dropdownEdit.innerHTML = "";
}

function createContactDiv(contact, isChecked, checkboxId) {
    const div = document.createElement("div");
    div.classList.add("itemAndCheckbox");
    if (isChecked) {
        div.classList.add("checkedItemAndCheckbox");
    }

    const initials = `${contact.firstLetter}${contact.lastLetter}`;
    div.innerHTML = generateContactHtml(contact, initials, checkboxId, isChecked);

    return div;
}

function generateContactHtml(contact, initials, checkboxId, isChecked) {
    return `
        <div class="userInitials" style="background-color: ${contact.color};">${initials}</div>
        <div class="nameWithCheckbox">
            <label for="${checkboxId}">${contact.name}</label>
            <input type="checkbox" class="edit-contact-checkbox" id="${checkboxId}" name="assignedContactsEdit" value="${contact.userID}" ${isChecked ? "checked" : ""} onchange="handleCheckboxChange(this)">
        </div>
    `;
}

/**
 * Displays the assigned contacts for a given task.
 * 
 * @param {Object} task - The task object containing assigned contacts.
 */
function displayAssignedContacts(task) {
    const editCheckedUserInitials = document.getElementById(
        "editCheckedUserInitials"
    );
    editCheckedUserInitials.innerHTML = "";
    task.assignedContacts.forEach((contactId) => {
        const contact = contacts.find((c) => c.userID === contactId);
        if (contact) {
            const initialsDiv = document.createElement("div");
            initialsDiv.className = "userInitilas";
            initialsDiv.textContent = `${contact.firstLetter}${contact.lastLetter}`;
            initialsDiv.style.backgroundColor = contact.color;
            editCheckedUserInitials.appendChild(initialsDiv);
        }
    });
}

/**
* Represents the element that contains all task information.
* @type {HTMLElement}
*/
document
    .getElementById("editTaskButton")
    .addEventListener("click", async function () {
        const allTaskInformation =
            document.getElementById("allTaskInformation");
        toggleDisplay("allTaskInformation", "none");
        toggleDisplay("taskEditorModal", "block");

        const taskId = allTaskInformation.dataset.taskId;
        const task = await getTaskById(taskId);

        if (task) {
            fillTaskEditor(task);
            createContactCheckboxes(task);
            // addDropdownListeners();
            displayAssignedContacts(task);
        }
    });

const openDropdownEdit = document.getElementById("openDropdownEdit");
const dropdownEdit = document.getElementById("dropDownContactsEdit");

dropdownEdit.addEventListener("click", function (event) {
    event.stopPropagation();
});

async function getTasks() {
    return JSON.parse((await getItem("tasks")).value || []);
}

function getTaskIndex(tasks, taskId) {
    return tasks.findIndex((task) => task.id === taskId);
}

/**
 * Updates the properties of a task object based on the values entered in the edit form.
 * @param {Object} task - The task object to be updated.
 */
function updateTask(task) {
    task.title = document.getElementById("editTitle").value;
    task.description = document.getElementById("editDescription").value;
    task.taskDate = document.getElementById("editDueDate").value;
    task.priority = document.getElementById("editPriority").value;
    task.assignedContacts = Array.from(
        document.querySelectorAll(
            '#dropDownContactsEdit input[type="checkbox"]:checked'
        )
    ).map((el) => el.value);
}

async function saveTasks(tasks) {
    await setItem("tasks", JSON.stringify(tasks));
}

/**
 * Adds a click event listener to the "saveEdit" button.
 * When the button is clicked, it gets the task ID from the allTaskInformation dataset, retrieves the tasks, and finds the index of the task with the given ID.
 * If the task is found, it updates the task, saves the tasks, and closes the editor.
 * If the task is not found, it alerts the user.
 * After all this, it initializes the board.
 */
document
    .getElementById("saveEdit")
    .addEventListener("click", async function () {
        const taskId = allTaskInformation.dataset.taskId;
        const tasks = await getTasks();
        const taskIndex = getTaskIndex(tasks, taskId);

        if (taskIndex !== -1) {
            updateTask(tasks[taskIndex]);
            await saveTasks(tasks);
            closeEditor();
        } else {
            alert("Aufgabe nicht gefunden.");
        }
        await initBoard();
    });

const boardAddTaskButton = document.getElementById("boardAddTaskButton");
const boardAddTask = document.getElementById("boardAddTask");

boardAddTaskButton.addEventListener("click", function () {
    boardAddTask.style.display = "block";
});

const boardAddTaskCloseButton = document.getElementById(
    "boardAddTaskCloseButton"
);

document.getElementById("searchTask").addEventListener("input", function () {
    searchTasks();
});

/**
 * Searches for tasks based on the value entered in the search input field.
 */
function searchTasks() {
    const searchValue = document
        .getElementById("searchTask")
        .value.toLowerCase();
    const taskCards = document.querySelectorAll(".task-card");

    taskCards.forEach((card) => {
        const title = card
            .querySelector(".task-card-title")
            .textContent.toLowerCase();
        const description = card
            .querySelector(".task-card-description")
            .textContent.toLowerCase();

        if (title.includes(searchValue) || description.includes(searchValue)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}

const moveTaskButton = document.getElementById("moveTaskButton");

moveTaskButton.addEventListener("click", function () {
    const moveOption = document.getElementById("moveOption");
    moveOption.style.display = "block";
});

function moveOptionClose() {
    document.getElementById("moveOption").style.display = "none";
}

/**
 * Adds a new subtask to the task and updates the subtask list.
 * @async
 * @function addEditSubtask
 * @returns {Promise<void>} A Promise that resolves when the subtask is added and the subtask list is updated.
 */
async function addEditSubtask() {
    const subtaskInput = document.getElementById("editSubtaskInput");
    const subtaskValue = subtaskInput.value.trim();
    if (subtaskValue) {
        const taskId =
            document.getElementById("allTaskInformation").dataset.taskId;
        let tasks = JSON.parse((await getItem("tasks")).value || "[]");
        let taskIndex = tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
            let task = tasks[taskIndex];
            if (!task.subtasks) {
                task.subtasks = [];
            }
            task.subtasks.push({ name: subtaskValue, completed: false });
            updateEditSubtaskList(task.subtasks);
            await setItemFromJson("tasks", tasks);
            subtaskInput.value = "";
        }
    }
}

/**
 * Removes a subtask from the task's subtask list.
 */
async function removeEditSubtask(index) {
    const taskId = document.getElementById("allTaskInformation").dataset.taskId;
    let tasks = JSON.parse((await getItem("tasks")).value || "[]");
    let taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex !== -1) {
        let task = tasks[taskIndex];
        if (task.subtasks && index >= 0 && index < task.subtasks.length) {
            task.subtasks.splice(index, 1);
            updateEditSubtaskList(task.subtasks);
            await setItemFromJson("tasks", tasks);
        }
    }
}

/**
 * Updates the edit subtask list in the DOM based on the provided subtasks array.
 *
 * @param {Array} subtasks - The array of subtasks to be displayed in the edit subtask list.
 * @returns {void}
 */
function updateEditSubtaskList(subtasks) {
    const list = document.getElementById("editSubtaskList");
    list.innerHTML = "";
    subtasks.forEach((subtask, index) => {
        const li = document.createElement("li");
        li.textContent = subtask.name;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => removeEditSubtask(index);
        li.appendChild(deleteButton);
        list.appendChild(li);
    });
}

document
    .getElementById("editSubtaskAddButton")
    .addEventListener("click", addEditSubtask);

function loadEditSubtasks(task) {
    updateEditSubtaskList(task.subtasks);
}

document
    .getElementById("editTaskButton")
    .addEventListener("click", async function () {
        const taskId =
            document.getElementById("allTaskInformation").dataset.taskId;
        const tasks = JSON.parse((await getItem("tasks")).value || []);
        const task = tasks.find((task) => task.id === taskId);

        loadEditSubtasks(task);
    });

document.querySelectorAll(".optionsContainerOption").forEach((option) => {
    option.addEventListener("click", async function () {
        const taskId =
            document.getElementById("allTaskInformation").dataset.taskId;
        let newStatus = this.id.replace("optionsContainer", "");
        newStatus = convertIdToStatus(newStatus);
        await updateTaskStatusAndMove(taskId, newStatus);
        await initBoard();
        const moveOption = document.getElementById("moveOption");
        if (moveOption) {
            moveOption.style.display = "none";
            allTaskInformation.style.display = "none";
        }
    });
});

/**
 * Converts an ID to a corresponding status.
 * @param {string} id - The ID to be converted.
 * @returns {string} The corresponding status.
 */
function convertIdToStatus(id) {
    switch (id) {
        case "ToDo":
            return "todo";
        case "InProgress":
            return "inProgress";
        case "Done":
            return "done";
        case "AwaitFeedback":
            return "awaitFeedback";
        default:
            return "";
    }
}

/**
 * Updates the status of a task and moves it to a new status.
 * @param {string} taskId - The ID of the task to update.
 * @param {string} newStatus - The new status to assign to the task.
 * @returns {Promise<void>} - A promise that resolves when the task status is updated.
 */
async function updateTaskStatusAndMove(taskId, newStatus) {
    try {
        let tasks = JSON.parse((await getItem("tasks")).value || "[]");
        let taskIndex = tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].status = newStatus;
            await setItemFromJson("tasks", tasks);
        }
    } catch (error) {
        console.error("Fehler beim Aktualisieren des Task-Status:", error);
    }
}

/**
 * Toggles the completion status of a subtask.
 * 
 * @param {string} taskId - The ID of the task.
 * @param {number} subtaskIndex - The index of the subtask.
 * @param {boolean} completedStatus - The new completion status of the subtask.
 * @returns {Promise<void>} - A promise that resolves when the subtask completion status is toggled.
 * @throws {Error} - If there is an error updating the subtask completion status.
 */
async function toggleSubtaskCompletion(taskId, subtaskIndex, completedStatus) {
    try {
        let tasks = JSON.parse((await getItem("tasks")).value || "[]");
        let taskIndex = tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
            let subtask = tasks[taskIndex].subtasks[subtaskIndex];
            if (subtask) {
                subtask.completed = completedStatus;
                await setItemFromJson("tasks", tasks);
            }
        }
    } catch (error) {
        console.error(
            "Fehler beim Aktualisieren des Subtask-Erledigungsstatus:",
            error
        );
    }
}

