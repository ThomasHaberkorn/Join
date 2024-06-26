let createBtn = document.getElementById("create-btn");
let urgentBtn = document.getElementById("urgentBtn");
let mediumBtn = document.getElementById("mediumBtn");
let lowBtn = document.getElementById("lowBtn");
let subtaskInput = document.getElementById("subtask");
let subtaskAddButton = document.getElementById("subtask-img");
let subtaskList = document.getElementById("list");
let openDropdown = document.getElementById("openDropdown");
/**
 * Object representing priority buttons.
 * @type {Object.<string, HTMLElement>}
 */
let priorityButtons = {Urgent: urgentBtn, Medium: mediumBtn, Low: lowBtn};
let priority = "";
let subtasks = [];
let tasks = [];
let currentTaskStatus = "todo";

/**
 * Initializes the add sidebar.
 * @returns {Promise<void>} A promise that resolves when the add sidebar is initialized.
 */
async function initAddSidebar() {
    await includeW3();
    showInitials();
}

document.addEventListener("DOMContentLoaded", async function () {
    await loadContacts();
    await loadTasks();
    fillContactDropdown();
    setPriorityLevel();
    setPriority("Medium");
});

/**
 * Loads contacts from storage and assigns them to the 'contacts' variable.
 * @returns {Promise<void>} A promise that resolves once the contacts are loaded.
 */
async function loadContacts() {
    contacts = JSON.parse((await getItem("contacts")).value || "[]");
}

/**
 * Loads tasks from storage and assigns them to the 'tasks' variable.
 * @returns {Promise<void>} A promise that resolves once the tasks are loaded.
 */
async function loadTasks() {
    tasks = JSON.parse((await getItem("tasks")).value || "[]");
}

/**
 * Fills the contact dropdown with contact items.
 */
function fillContactDropdown() {
    const dropdown = document.getElementById("boardDropDownContacts");
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
 * @param {HTMLInputElement} checkbox - The checkbox element.
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
        "boardCheckedUserInitials");
    editCheckedUserInitials.innerHTML = "";
    document
        .querySelectorAll(".contact-checkbox:checked")
        .forEach((checkbox) => {
            const contact = contacts.find((c) => c.userID === checkbox.value);
            if (contact) {
                const initialsDiv = document.createElement("div");
                initialsDiv.className = "userInitials";
                initialsDiv.textContent = `${contact.firstLetter}${contact.lastLetter}`;
                initialsDiv.style.backgroundColor = contact.color;
                editCheckedUserInitials.appendChild(initialsDiv);}
        });
}

/**
 * Resets the buttons by removing the selected classes and resetting the button images.
 */
function resetButtons() {
    Object.values(priorityButtons).forEach((button) => {
        button.classList.remove(
            "priority-urgent-selected",
            "priority-medium-selected",
            "priority-low-selected"
        );
        resetButtonImage(button);
    });
}

/**
 * Resets the image of a button based on its priority.
 * @param {HTMLElement} button - The button element to reset the image for.
 */
function resetButtonImage(button) {
    const imgElement = button.querySelector("img");
    if (imgElement) {
        if (button === urgentBtn) {
            imgElement.src = "assets/img/addTask/Prio alta.png";
        } else if (button === mediumBtn) {
            imgElement.src = "assets/img/addTask/Prio media.png";
        } else if (button === lowBtn) {
            imgElement.src = "assets/img/addTask/Capa 2 (4).png";
        }
    }
}

/**
 * Updates the selected button based on the given priority.
 * @param {string} selectedPriority - The selected priority.
 */
function updateSelectedButton(selectedPriority) {
    switch (selectedPriority) {
        case "Urgent":
            urgentBtn.classList.add("priority-urgent-selected");
            urgentBtn.querySelector("img").src =
                "assets/img/selectedUrgent.png";
            break;
        case "Medium":
            mediumBtn.classList.add("priority-medium-selected");
            mediumBtn.querySelector("img").src =
                "assets/img/selectedMedium.png";
            break;
        case "Low":
            lowBtn.classList.add("priority-low-selected");
            lowBtn.querySelector("img").src = "assets/img/selectedLow.png";
            break;}
}

/**
 * Sets the priority of the task.
 *
 * @param {string} selectedPriority - The selected priority for the task.
 * @returns {void}
 */
function setPriority(selectedPriority) {
    priority = selectedPriority;
    resetButtons();
    updateSelectedButton(selectedPriority);
}

/**
 * Sets the priority level for the task based on the button clicked.
 */
function setPriorityLevel() {
    urgentBtn.addEventListener("click", function () {
        setPriority("Urgent");
    });
    mediumBtn.addEventListener("click", function () {
        setPriority("Medium");
    });
    lowBtn.addEventListener("click", function () {
        setPriority("Low");
    });
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

function createSubtaskCheckbox(subtask, index) {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = subtask.completed;
    checkbox.onchange = function () {
        subtasks[index].completed = this.checked;
    };
    return checkbox;
}

function createSubtaskTextInput(subtask) {
    let textInput = document.createElement("input");
    textInput.type = "text";
    textInput.value = subtask.name;
    textInput.disabled = true;
    return textInput;
}

function createSubtaskEditButton(textInput, editIcon, index) {
    let editButton = document.createElement("button");
    editButton.type = "button";
    editButton.classList.add("subtaskEditBtn");
    editButton.appendChild(editIcon);
    editButton.onclick = function () {
        if (textInput.disabled) {
            textInput.disabled = false;
            textInput.focus();
            editIcon.src = "assets/img/check (2).png";} else {
            subtasks[index].name = textInput.value.trim();
            textInput.disabled = true;
            editIcon.src = "assets/img/edit.png";
            updateSubtaskList();}};
    return editButton;
}

function createSubtaskDeleteButton(index) {
    let deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList.add("subtaskDeleteBtn");
    let deleteIcon = document.createElement("img");
    deleteIcon.src = "assets/img/delete.png";
    deleteIcon.alt = "Delete";
    deleteButton.appendChild(deleteIcon);
    deleteButton.onclick = function () {
        removeSubtask(index);};
    return deleteButton;
}

function updateSubtaskList() {
    subtaskList.innerHTML = "";
    subtasks.forEach((subtask, index) => {
        let li = document.createElement("li");
        let checkbox = createSubtaskCheckbox(subtask, index);
        let textInput = createSubtaskTextInput(subtask);
        let editIcon = document.createElement("img");
        editIcon.src = "assets/img/edit.png";
        editIcon.alt = "Edit";
        let editButton = createSubtaskEditButton(textInput, editIcon, index);
        let deleteButton = createSubtaskDeleteButton(index);
        li.appendChild(checkbox);
        li.appendChild(textInput);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        subtaskList.appendChild(li);});
}

/**
 * Represents the value of a subtask.
 * @type {string}
 */
document.addEventListener("DOMContentLoaded", function () {
    subtaskAddButton.addEventListener("click", function () {
        let subtaskValue = subtaskInput.value.trim();
        if (subtaskValue) {
            addSubtask(subtaskValue);
            subtaskInput.value = "";
        }
    });
});

/**
 * Adds a new task to the task list.
 *
 * @param {Event} event - The event object triggered by the form submission.
 * @returns {Promise<void>} - A promise that resolves when the task is added successfully.
 */
function getTaskInputs() {
    let title = document.getElementById("titleInput").value;
    let description = document.getElementById("descriptionInput").value;
    let taskDate = document.getElementById("taskDate").value;
    let categoryElement = document.querySelector(".dropdown-selected");
    let category = categoryElement ? categoryElement.textContent.trim() : null;
    return { title, description, taskDate, category };
}

function showErrorMsg() {
    let errorMsg = document.getElementById("categoryError");
    if (!errorMsg) {
        errorMsg = document.createElement("div");
        errorMsg.id = "categoryError";
        errorMsg.style.color = "red";
        document
            .getElementById("category")
            .parentElement.parentElement.appendChild(errorMsg);
    }
    errorMsg.textContent = "Please choose a Category.";
    errorMsg.style.display = "block";
}

function hideErrorMsg() {
    let errorMsg = document.getElementById("categoryError");
    if (errorMsg) {
        errorMsg.style.display = "none";
    }
}

function getAssignedContacts() {
    return [...document.querySelectorAll(".contact-checkbox:checked")].map(
        (input) => input.value
    );
}

async function addTask(event) {
    event.preventDefault();
    let { title, description, taskDate, category } = getTaskInputs();
    if (!category || category === "Select task Category") {
        showErrorMsg();
        return;
    } else {
        hideErrorMsg();}
    let assignedContacts = getAssignedContacts();
    let userLevel = sessionStorage.getItem("userLevel");
    let newTaskId = "task-" + Math.random().toString(36).substr(2, 9);
    tasks.push({
        id: newTaskId,title,description,taskDate,category,priority,subtasks,userLevel,status: currentTaskStatus,assignedContacts,});
    await setItem("tasks", tasks);
    window.location.href = "board.html";
}

/**
 * Fills the dropdown list with options and toggles the visibility of the dropdown and checked user initials.
 */
function fillDropdownList() {
    let dropdown = document.getElementById("boardDropDownContacts");
    let checkedUserInitials = document.getElementById(
        "boardCheckedUserInitials");
    if (dropdown.style.display === "none" || dropdown.style.display === "") {
        dropdown.style.display = "block";
        checkedUserInitials.style.display = "none";} else {
        dropdown.style.display = "none";
        checkedUserInitials.style.display = "flex";
        loadCheckedUserInitials();}
}

/**
 * Removes the current input values from the form.
 */
function removeCurrentInputValues() {
    document.getElementById("titleInput").value = "";
    document.getElementById("descriptionInput").value = "";
    document.getElementById("taskDate").value = "";
    document.getElementById("category").value = "";
    document
        .querySelectorAll(".contact-checkbox:checked")
        .forEach((checkbox) => {
            const itemAndCheckbox = checkbox.closest(".itemAndCheckbox");
            if (checkbox.checked) {
                itemAndCheckbox.classList.remove("checkedItemAndCheckbox");}
            checkbox.checked = false;});
    subtaskInput.value = "";
    subtasks = [];
    setPriority("Medium");
    loadCheckedUserInitials();
    updateSubtaskList();
}

/**
 * Shows or hides the clear button based on the given value.
 *
 * @param {boolean} value - The value indicating whether to show or hide the clear button.
 */
function showClearButton(value) {
    document.getElementById("clear-subtask").style.display = value
        ? "inline"
        : "none";
}
