function toggleDisplay(elementId, display) {
    const element = document.getElementById(elementId);
    element.style.display = display;
}

async function getTaskById(taskId) {
    const tasks = JSON.parse((await getItem("tasks")).value || []);
    return tasks.find((task) => task.id === taskId);
}

function fillTaskEditor(task) {
    setTaskEditorCategory(task.category);
    document.getElementById("editTitle").value = task.title;
    document.getElementById("editDescription").value = task.description;
    document.getElementById("editDueDate").value = task.taskDate;
    const prioritySelect = document.getElementById("editPriority");
    prioritySelect.value = task.priority;
}

function createContactCheckboxes(task) {
    const dropdownEdit = document.getElementById("dropDownContactsEdit");
    dropdownEdit.innerHTML = "";
    contacts.forEach((contact) => {
        const isChecked = task.assignedContacts.includes(contact.userID);
        const checkboxId = `contact-edit-${contact.userID}`;

        const div = document.createElement("div");
        div.classList.add("itemAndCheckbox");
        if (isChecked) {
            div.classList.add("checkedItemAndCheckbox");
        }

        const initials = `${contact.firstLetter}${contact.lastLetter}`;
        div.innerHTML = `
            <div class="userInitials" style="background-color: ${
                contact.color
            };">${initials}</div>
            <div class="nameWithCheckbox">
                <label for="${checkboxId}">${contact.name}</label>
                <input type="checkbox" class="edit-contact-checkbox" id="${checkboxId}" name="assignedContactsEdit" value="${
            contact.userID
        }" ${isChecked ? "checked" : ""} onchange="handleCheckboxChange(this)">
            </div>
        `;

        dropdownEdit.appendChild(div);
    });
}

// function toggleDropdownEdit() {
//     const dropdownEdit = document.getElementById("dropDownContactsEdit");

//     if (
//         dropdownEdit.style.display === "none" ||
//         dropdownEdit.style.display === ""
//     ) {
//         dropdownEdit.style.display = "block";
//     } else {
//         dropdownEdit.style.display = "none";
//     }
// }

// function addDropdownListeners() {
//     const dropdownEdit = document.getElementById("dropDownContactsEdit");
//     const openDropdownEdit = document.getElementById("openDropdownEdit");
//     openDropdownEdit.addEventListener("click", function (event) {
//         event.stopPropagation();
//         dropdownEdit.style.display = dropdownEdit.style.display === "block" ? "none" : "block";
//     });
//     dropdownEdit.addEventListener("click", function (event) {
//         event.stopPropagation();
//     });
//     document.addEventListener("click", function (event) {
//         if (dropdownEdit.style.display === "block" && !event.target.matches("#openDropdownEdit")) {
//             dropdownEdit.style.display = "none";
//         }
//     });
// }

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

// openDropdownEdit.addEventListener("click", function (event) {
//     const isDropdownOpen = dropdownEdit.style.display === "block";
//     dropdownEdit.style.display = isDropdownOpen ? "none" : "block";

//     event.stopPropagation();
// });

dropdownEdit.addEventListener("click", function (event) {
    event.stopPropagation();
});

async function getTasks() {
    return JSON.parse((await getItem("tasks")).value || []);
}

function getTaskIndex(tasks, taskId) {
    return tasks.findIndex((task) => task.id === taskId);
}

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

// const allTaskInformation = document.getElementById("allTaskInformation");
// allTaskInformation.addEventListener("click", function () {
//     allTaskInformation.style.display = "none";
// });

// const cardOptionsCloseButton = document.getElementById(
//     "cardOptionsCloseButton"
// );

// cardOptionsCloseButton.addEventListener("click", function () {
//     const moveOption = document.getElementById("moveOption");
//     const allTaskInformation = document.getElementById("allTaskInformation");
//     moveOption.style.display = "none";
// });

function moveOptionClose() {
    document.getElementById("moveOption").style.display = "none";
}

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
            task.subtasks.push({name: subtaskValue, completed: false});
            updateEditSubtaskList(task.subtasks);
            await setItemFromJson("tasks", tasks);
            subtaskInput.value = "";
        }
    }
}

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

// document.addEventListener("DOMContentLoaded", () => {
//     const taskCards = document.querySelectorAll(".task-card");

//     taskCards.forEach((card) => {
//         card.addEventListener("mouseenter", () => {
//             console.log("Mouse entered:", card);
//         });

//         card.addEventListener("mouseleave", () => {
//             console.log("Mouse left:", card);
//         });
//     });
// });

function toggleDropdown(event) {
    const options = document.querySelector(".dropdown-options");
    const arrow = document.querySelector(".dropdown-arrow");
    const isOpen = options.style.display === "block";

    options.style.display = isOpen ? "none" : "block";
    arrow.src = isOpen
        ? "/assets/img/custom-arrow.png"
        : "/assets/img/custom-arrow-up.png";

    // Stoppt die Propagation des Events, um Doppeltrigger zu verhindern
    event.stopPropagation();
}

function selectOption(event) {
    const selectedText = event.target.textContent;
    const selectedValue = event.target.getAttribute("data-value");
    const arrow = document.querySelector(".dropdown-arrow");

    document.querySelector(".dropdown-selected").textContent = selectedText;
    document.querySelector(".dropdown-options").style.display = "none";
    document.getElementById("category").value = selectedValue;
    arrow.src = "/assets/img/custom-arrow.png";
}

function setupDropdownListeners() {
    const dropdownSelected = document.querySelector(".dropdown-selected");
    const dropdownArrow = document.querySelector(".dropdown-arrow");
    const dropdownOptions = document.querySelectorAll(".dropdown-option");

    dropdownSelected.addEventListener("click", toggleDropdown);
    dropdownArrow.addEventListener("click", toggleDropdown);

    dropdownOptions.forEach((option) => {
        option.addEventListener("click", selectOption);
    });

    // Fügt einen Listener zum Fenster hinzu, um das Dropdown zu schließen, wenn außerhalb geklickt wird
    window.addEventListener("click", function () {
        const options = document.querySelector(".dropdown-options");
        const arrow = document.querySelector(".dropdown-arrow");
        if (options.style.display === "block") {
            options.style.display = "none";
            arrow.src = "/assets/img/custom-arrow.png";
        }
    });
}

document.addEventListener("DOMContentLoaded", setupDropdownListeners);

function handleClickOutside(event) {
    if (!event.target.matches(".dropdown-selected")) {
        document.querySelector(".dropdown-options").style.display = "none";
    }
}

function handleKeyboardAccessibility(event) {
    if (event.key === "Enter") {
        toggleDropdown();
    }
}

function initializeDropdown() {
    setupDropdownListeners();
    window.addEventListener("click", handleClickOutside, true);
    document
        .querySelector(".dropdown-selected")
        .addEventListener("keydown", handleKeyboardAccessibility);
}

// Initialize the dropdown once the document is fully loaded
// document.addEventListener("DOMContentLoaded", initializeDropdown);
document.addEventListener("DOMContentLoaded", initializeDropdown);
