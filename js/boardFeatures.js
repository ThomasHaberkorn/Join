

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
        div.className = "checkbox-container";
        div.innerHTML = `
            <input class="cursorPointer" type="checkbox" id="${checkboxId}" name="assignedContactsEdit" value="${contact.userID}" ${isChecked ? "checked" : ""}>
            <label for="${checkboxId}">${contact.name}</label>
        `;
        dropdownEdit.appendChild(div);
    });
}

function addDropdownListeners() {
    const dropdownEdit = document.getElementById("dropDownContactsEdit");
    const openDropdownEdit = document.getElementById("openDropdownEdit");
    openDropdownEdit.addEventListener("click", function (event) {
        event.stopPropagation();
        dropdownEdit.style.display = dropdownEdit.style.display === "block" ? "none" : "block";
    });
    dropdownEdit.addEventListener("click", function (event) {
        event.stopPropagation();
    });
    document.addEventListener("click", function (event) {
        if (dropdownEdit.style.display === "block" && !event.target.matches("#openDropdownEdit")) {
            dropdownEdit.style.display = "none";
        }
    });
}

function displayAssignedContacts(task) {
    const editCheckedUserInitials = document.getElementById('editCheckedUserInitials');
    editCheckedUserInitials.innerHTML = '';
    task.assignedContacts.forEach(contactId => {
        const contact = contacts.find(c => c.userID === contactId);
        if (contact) {
            const initialsDiv = document.createElement('div');
            initialsDiv.className = 'userInitilas';
            initialsDiv.textContent = `${contact.firstLetter}${contact.lastLetter}`;
            initialsDiv.style.backgroundColor = contact.color;
            editCheckedUserInitials.appendChild(initialsDiv);
        }
    });
}

document.getElementById("editTaskButton").addEventListener("click", async function () {
    const allTaskInformation = document.getElementById("allTaskInformation");
    toggleDisplay("allTaskInformation", "none");
    toggleDisplay("taskEditorModal", "block");

    const taskId = allTaskInformation.dataset.taskId;
    const task = await getTaskById(taskId);

    if (task) {
        fillTaskEditor(task);
        createContactCheckboxes(task);
        addDropdownListeners();
        displayAssignedContacts(task);
    }
});

const openDropdownEdit = document.getElementById("openDropdownEdit");
const dropdownEdit = document.getElementById("dropDownContactsEdit");

openDropdownEdit.addEventListener("click", function (event) {
    const isDropdownOpen = dropdownEdit.style.display === "block";
    dropdownEdit.style.display = isDropdownOpen ? "none" : "block";

    event.stopPropagation();
});

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
        document.querySelectorAll('#dropDownContactsEdit input[type="checkbox"]:checked')
    ).map((el) => el.value);
}

async function saveTasks(tasks) {
    await setItem("tasks", JSON.stringify(tasks));
}

document.getElementById("saveEdit").addEventListener("click", async function () {
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

boardAddTaskCloseButton.addEventListener("click", function () {
    boardAddTask.style.display = "none";
});

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

const allTaskInformation = document.getElementById("allTaskInformation");
allTaskInformation.addEventListener("click", function () {
    allTaskInformation.style.display = "none";
});

const cardOptionsCloseButton = document.getElementById("cardOptionsCloseButton");

cardOptionsCloseButton.addEventListener("click", function () {
    const moveOption = document.getElementById("moveOption");
    const allTaskInformation = document.getElementById("allTaskInformation");
    moveOption.style.display = "none";
});

async function addEditSubtask() {
    const subtaskInput = document.getElementById('editSubtaskInput');
    const subtaskValue = subtaskInput.value.trim();
    if (subtaskValue) {
        const taskId = document.getElementById("allTaskInformation").dataset.taskId;
        let tasks = JSON.parse((await getItem("tasks")).value || "[]");
        let taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            let task = tasks[taskIndex];
            if (!task.subtasks) {
                task.subtasks = [];
            }
            task.subtasks.push({ name: subtaskValue, completed: false });
            updateEditSubtaskList(task.subtasks);
            await setItemFromJson('tasks', tasks);
            subtaskInput.value = '';
        }
    }
}


async function removeEditSubtask(index) {
    const taskId = document.getElementById("allTaskInformation").dataset.taskId;
    let tasks = JSON.parse((await getItem("tasks")).value || "[]");
    let taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        let task = tasks[taskIndex];
        if (task.subtasks && index >= 0 && index < task.subtasks.length) {
            task.subtasks.splice(index, 1);
            updateEditSubtaskList(task.subtasks);
            await setItemFromJson('tasks', tasks);
        }
    }
}


function updateEditSubtaskList(subtasks) {
    const list = document.getElementById('editSubtaskList');
    list.innerHTML = '';
    subtasks.forEach((subtask, index) => {
        const li = document.createElement('li');
        li.textContent = subtask.name;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => removeEditSubtask(index);
        li.appendChild(deleteButton);
        list.appendChild(li);
    });
}

document.getElementById('editSubtaskAddButton').addEventListener('click', addEditSubtask);

function loadEditSubtasks(task) {
    updateEditSubtaskList(task.subtasks);
}

document.getElementById("editTaskButton").addEventListener("click", async function () {
    const taskId = document.getElementById("allTaskInformation").dataset.taskId;
    const tasks = JSON.parse((await getItem("tasks")).value || []);
    const task = tasks.find((task) => task.id === taskId);

    loadEditSubtasks(task);
});


document.querySelectorAll('.optionsContainerOption').forEach(option => {
    option.addEventListener('click', async function () {
        const taskId = document.getElementById("allTaskInformation").dataset.taskId;
        let newStatus = this.id.replace('optionsContainer', '');
        newStatus = convertIdToStatus(newStatus);
        await updateTaskStatusAndMove(taskId, newStatus);
        await initBoard();
        const moveOption = document.getElementById("moveOption");
        if (moveOption) {
            moveOption.style.display = "none";
        }
    });
});


function convertIdToStatus(id) {
    switch (id) {
        case 'ToDo':
            return 'todo';
        case 'InProgress':
            return 'inProgress';
        case 'Done':
            return 'done';
        case 'AwaitFeedback':
            return 'awaitFeedback';
        default:
            return '';
    }
}

async function updateTaskStatusAndMove(taskId, newStatus) {
    try {
        let tasks = JSON.parse((await getItem("tasks")).value || "[]");
        let taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].status = newStatus;
            await setItemFromJson('tasks', tasks);
        }
    } catch (error) {
        console.error("Fehler beim Aktualisieren des Task-Status:", error);
    }
}

async function toggleSubtaskCompletion(taskId, subtaskIndex, completedStatus) {
    try {
        let tasks = JSON.parse((await getItem("tasks")).value || "[]");
        let taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            let subtask = tasks[taskIndex].subtasks[subtaskIndex];
            if (subtask) {
                subtask.completed = completedStatus;
                await setItemFromJson('tasks', tasks);
            }
        }
    } catch (error) {
        console.error("Fehler beim Aktualisieren des Subtask-Erledigungsstatus:", error);
    }
}
