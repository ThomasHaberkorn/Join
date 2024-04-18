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
                editCheckedUserInitials.appendChild(initialsDiv);
            }
        });
}

/**
 * Resets the buttons and their classes for priority selection.
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
 * @param {string} selectedPriority - The selected priority ("Urgent", "Medium", or "Low").
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
            break;
    }
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
 * Sets the priority level for the task.
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

/**
 * Updates the subtask list in the DOM based on the subtasks array.
 */
function updateSubtaskList() {
    subtaskList.innerHTML = "";

    subtasks.forEach((subtask, index) => {
        let li = document.createElement("li");
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = subtask.completed;
        checkbox.onchange = function () {
            subtasks[index].completed = this.checked;
        };

        let textInput = document.createElement("input");
        textInput.type = "text";
        textInput.value = subtask.name;
        textInput.disabled = true;

        let editButton = document.createElement("button");
        editButton.type = "button";
        editButton.classList.add("subtaskEditBtn");
        let editIcon = document.createElement("img");
        editIcon.src = "assets/img/edit.png";
        editIcon.alt = "Edit";
        editButton.appendChild(editIcon);

        editButton.onclick = function () {
            if (textInput.disabled) {
                textInput.disabled = false;
                textInput.focus();
                editIcon.src = "assets/img/check (2).png";
            } else {
                subtasks[index].name = textInput.value.trim();
                textInput.disabled = true;
                editIcon.src = "assets/img/edit.png";
                updateSubtaskList();
            }
        };

        let deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.classList.add("subtaskDeleteBtn");
        let deleteIcon = document.createElement("img");
        deleteIcon.src = "assets/img/delete.png";
        deleteIcon.alt = "Delete";
        deleteButton.appendChild(deleteIcon);
        deleteButton.onclick = function () {
            removeSubtask(index);
        };

        li.appendChild(checkbox);
        li.appendChild(textInput);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        subtaskList.appendChild(li);
    });
}

/**
 * Event listener for the DOMContentLoaded event.
 * This function waits for the HTML document to be completely loaded and parsed.
 * Once the document is loaded, it adds an event listener to the subtaskAddButton.
 * When the button is clicked, it gets the value of the subtaskInput, trims it, and if it's not empty, adds it as a subtask.
 */
document.addEventListener("DOMContentLoaded", function () {
    subtaskAddButton.addEventListener("click", addSubtaskIfNotEmpty);

    subtaskInput.addEventListener("keydown", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            event.preventDefault(); // Cancel the default action, if needed
            addSubtaskIfNotEmpty();
        }
    });

    function addSubtaskIfNotEmpty() {
        let subtaskValue = subtaskInput.value.trim();
        if (subtaskValue) {
            addSubtask(subtaskValue);
            subtaskInput.value = "";
        }
    }
});

/**
 * Adds a new task to the task list.
 */
async function addTask(event) {
    event.preventDefault();
    let category = document.getElementById("category").value;

    if (!category) {
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
        return;
    } else {
        let errorMsg = document.getElementById("categoryError");
        if (errorMsg) {
            errorMsg.style.display = "none";
        }
    }
    let title = document.getElementById("titleInput").value;
    let description = document.getElementById("descriptionInput").value;
    let taskDate = document.getElementById("taskDate").value;
    let assignedContacts = [
        ...document.querySelectorAll(".contact-checkbox:checked"),
    ].map((input) => input.value);
    let userLevel = sessionStorage.getItem("userLevel");
    let newTaskId = "task-" + Math.random().toString(36).substr(2, 9);

    tasks.push({
        id: newTaskId,
        title,
        description,
        taskDate,
        category,
        priority,
        subtasks,
        userLevel,
        status: currentTaskStatus,
        assignedContacts,
    });
    await setItem("tasks", tasks);
    window.location.href = "board.html";
}

/**
 * Fills the dropdown list and toggles the visibility of the dropdown and checked user initials.
 */
function fillDropdownList() {
    let dropdown = document.getElementById("dropDownContacts");
    let checkedUserInitials = document.getElementById("checkedUserInitials");

    if (dropdown.style.display === "none" || dropdown.style.display === "") {
        dropdown.style.display = "block";
        checkedUserInitials.style.display = "none";
    } else {
        dropdown.style.display = "none";
        checkedUserInitials.style.display = "flex";
        loadCheckedUserInitials();
    }
}

/**
 * Clears the input values and resets the state of the task form.
 */
function removeCurrentInputValues() {
    document.getElementById("titleInput").value = "";
    document.getElementById("descriptionInput").value = "";
    document.getElementById("taskDate").value = "";
    document.getElementById("category").value = "";
    document
        .querySelectorAll(".contact-checkbox:checked")
        .forEach((checkbox) => {
            checkbox.checked = false;
        });
    subtaskInput.value = "";
    subtasks = [];
    setPriority("Medium");
    loadCheckedUserInitials();
    updateSubtaskList();
}

/**
 * Shows or hides the clear button based on the given value.
 * @param {boolean} value - The value indicating whether to show or hide the clear button.
 */
function showClearButton(value) {
    document.getElementById("clear-subtask").style.display = value
        ? "inline"
        : "none";
}

/**
 * Clears the subtask input field and hides the clear button.
 */
function clearSubtaskInput() {
    document.getElementById("subtask").value = "";
    document.getElementById("clear-subtask").style.display = "none";
}

document
    .querySelectorAll('.custom-checkbox input[type="checkbox"]')
    .forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
            const imgElement = this.nextElementSibling;
            if (this.checked) {
                imgElement.src = "./assets/img/checkboxChecked.png";
            } else {
                imgElement.src = "./assets/img/checkbox.png";
            }
        });
    });

/**
 * Toggles the visibility of the dropdown menu and updates the arrow icon accordingly.
 * @param {Event} event - The event object triggered by the user action.
 */
function toggleDropdown(event) {
    const options = document.querySelector(".dropdown-options");
    const arrow = document.querySelector(".dropdown-arrow");
    const isOpen = options.style.display === "block";

    options.style.display = isOpen ? "none" : "block";
    arrow.src = isOpen
        ? "./assets/img/custom-arrow.png"
        : "./assets/img/custom-arrow-up.png";

    event.stopPropagation();
}

/**
 * Handles the selection of an option in the dropdown menu.
 * 
 * @param {Event} event - The event object triggered by the selection.
 */
function selectOption(event) {
    const selectedText = event.target.textContent;
    const selectedValue = event.target.getAttribute("data-value");
    const arrow = document.querySelector(".dropdown-arrow");

    document.querySelector(".dropdown-selected").textContent = selectedText;
    document.querySelector(".dropdown-options").style.display = "none";
    document.getElementById("category").value = selectedValue;
    arrow.src = "./assets/img/custom-arrow.png";
}

/**
 * Sets up event listeners for the dropdown menu.
 */
function setupDropdownListeners() {
    const dropdownSelected = document.querySelector(".dropdown-selected");
    const dropdownArrow = document.querySelector(".dropdown-arrow");
    const dropdownOptions = document.querySelectorAll(".dropdown-option");

    dropdownSelected.addEventListener("click", toggleDropdown);
    dropdownArrow.addEventListener("click", toggleDropdown);

    dropdownOptions.forEach((option) => {
        option.addEventListener("click", selectOption);
    });

    window.addEventListener("click", function () {
        const options = document.querySelector(".dropdown-options");
        const arrow = document.querySelector(".dropdown-arrow");
        if (options.style.display === "block") {
            options.style.display = "none";
            arrow.src = "./assets/img/custom-arrow.png";
        }
    });
}

document.addEventListener("DOMContentLoaded", setupDropdownListeners);

/**
 * Handles the click event outside of the dropdown-selected element.
 * If the clicked element does not match the dropdown-selected class, it hides the dropdown-options element.
 * @param {Event} event - The click event object.
 */
function handleClickOutside(event) {
    if (!event.target.matches(".dropdown-selected")) {
        document.querySelector(".dropdown-options").style.display = "none";
    }
}

/**
 * Handles keyboard accessibility for the event.
 * @param {KeyboardEvent} event - The keyboard event object.
 */
function handleKeyboardAccessibility(event) {
    if (event.key === "Enter") {
        toggleDropdown();
    }
}

/**
 * Initializes the dropdown functionality.
 * Sets up event listeners for the dropdown and handles keyboard accessibility.
 */
function initializeDropdown() {
    setupDropdownListeners();
    window.addEventListener("click", handleClickOutside, true);
    document
        .querySelector(".dropdown-selected")
        .addEventListener("keydown", handleKeyboardAccessibility);
}

document.addEventListener("DOMContentLoaded", initializeDropdown);

/**
 * Closes the dropdown and fills the dropdown list.
 */
function closeDropdown() {
    fillDropdownList();
    document.getElementById("dropDownContacts").style.display = "none";
}
