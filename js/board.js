document.addEventListener("DOMContentLoaded", async function () {
    await loadContacts();
});

async function initBoard() {
    await includeW3();
    await loadTasks();
    boardActive();
    showInitials();

    updateTaskColumns();
    clearTaskColumns();
    displayTasks();
}

const prioritySymbols = {
    Urgent: "./assets/img/urgentSymbol.png",
    Medium: "./assets/img/mediumSymbol.png",
    Low: "./assets/img/lowSymbol.png",
};

const taskColumns = document.querySelectorAll(".task-column");

async function loadTasks() {
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

function displayTasks() {
    tasks.forEach((task) => {
        if (document.getElementById(task.status)) {
            let taskCard = createTaskCard(task);
            document.getElementById(task.status).appendChild(taskCard);
        }
    });
    updateTaskColumns();
}

function boardActive() {
    document.getElementById("boardSum").classList.add("bgfocus");
}

function getAssignedContactElements(assignedContactIds) {
    return assignedContactIds
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
}

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

function createSubtasksHtml(subtasks) {
    let subtasksHtml = '<ul class="task-card-subtasks">';
    subtasks.forEach((subtask) => {
        subtasksHtml += `<li>${subtask}</li>`;
    });
    subtasksHtml += "</ul>";
    return subtasksHtml;
}

function createCategoryDiv(task) {
    const {className, text} = getCategoryDetails(task.category);
    return `<div class="${className}">${text}</div>`;
}

function createAssignedContactElements(assignedContacts) {
    return getAssignedContactElements(assignedContacts);
}

function getPrioritySymbolHtml(task, prioritySymbols) {
    const prioritySymbol = prioritySymbols[task.priority];
    return prioritySymbol
        ? `<img src="${prioritySymbol}" class="priority-symbol" alt="${task.priority}" style="margin-left: 10px;">`
        : "";
}

function calculateProgress(task) {
    const totalSubtasks = task.subtasks.length;
    const completedSubtasks = task.subtasks.filter(
        (subtask) => subtask.completed
    ).length;
    const progressPercentage =
        totalSubtasks === 0 ? 0 : (completedSubtasks / totalSubtasks) * 100;

    return `
        <div class="subtaskWithProgressBar">
        <div class="progress" style="background-color: #e0e0e0; border-radius: 2px; margin-top: 10px;">
            <div class="progress-bar" style="width: ${progressPercentage}%"></div>
        </div>
        <div class="subtaskNextToProgressBar";">${completedSubtasks}/${totalSubtasks} Subtasks</div>
        </div>
    `;
}

// <div class="subtaskWithProgressBar">
//  <div class="progress" style="background-color: #e0e0e0; border-radius: 2px; margin-top: 10px;">
//  <div class="progress-bar" style="width: ${progressPercentage}%"></div>
// </div>
// <div class="subtaskNextToProgressBar";">${completedSubtasks}/${totalSubtasks} Subtasks</div>
// </div>

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
        </div>${progressHtml} <!-- Progress-Bar und Subtasks-Anzeige einfügen -->
        <div class="prioAndContact">
            <div style="display: flex;">${assignedContactElements}</div>
            ${prioritySymbolHtml} <!-- Füge das Prioritätssymbol hinzu -->
        </div>
    `;
}

function setTaskInformation(task) {
    const allTaskInformation = document.getElementById("allTaskInformation");
    allTaskInformation.dataset.taskId = task.id;
    allTaskInformation.style.display = "flex";
}

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

function openAllTaskInformation(task) {
    setTaskInformation(task);
    setPriorityInformation(task);
    setTaskDetails(task);
    setSubtasks(task);
}

function createCardElement(task) {
    let card = document.createElement("article");
    card.className = "task-card";
    card.id = task.id || "task-" + Math.random().toString(36).substr(2, 9);
    card.setAttribute("draggable", true);
    card.dataset.status = task.status;
    return card;
}

function addEventListenersToCard(card, task) {
    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("click", function () {
        openAllTaskInformation(task);
    });
}

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

function clearTaskColumns() {
    document.querySelectorAll(".task-column").forEach((column) => {
        column.innerHTML = ""; // Entfernt alle Kinder-Elemente der Spalte
    });
}

taskColumns.forEach((column) => {
    column.addEventListener("dragover", handleDragOver);
    column.addEventListener("drop", handleDrop);
});

function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
}

function handleDragOver(e) {
    e.preventDefault();
}

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

async function updateTaskInRemoteStorage(taskId, newStatus) {
    let tasks = JSON.parse((await getItem("tasks")).value || "[]");
    let taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].status = newStatus;
        await setItemFromJson("tasks", tasks);
    }
}

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

function setPriorityValue(element, priority) {
    element.value = priority;
}

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

function closeAllTaskInformation() {
    const allTaskInformation = document.getElementById("allTaskInformation");
    allTaskInformation.style.display = "none";
    initBoard();
}

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

function closeEditor() {
    const editTaskInformation = document.getElementById("taskEditorModal");
    const allTaskInformation = document.getElementById("allTaskInformation");
    editTaskInformation.style.display = "none";
}

function setTaskEditorCategory(category) {
    const {className, text} = getCategoryDetails(category);
    const taskEditorCategory = document.getElementById("taskEditorCategory");
    taskEditorCategory.textContent = text;
    taskEditorCategory.className = className;
}

// function toggleDisplay(elementId, display) {
//     const element = document.getElementById(elementId);
//     element.style.display = display;
// }

// async function getTaskById(taskId) {
//     const tasks = JSON.parse((await getItem("tasks")).value || []);
//     return tasks.find((task) => task.id === taskId);
// }

// function fillTaskEditor(task) {
//     setTaskEditorCategory(task.category);
//     document.getElementById("editTitle").value = task.title;
//     document.getElementById("editDescription").value = task.description;
//     document.getElementById("editDueDate").value = task.taskDate;
//     const prioritySelect = document.getElementById("editPriority");
//     prioritySelect.value = task.priority;
// }

// function createContactCheckboxes(task) {
//     const dropdownEdit = document.getElementById("dropDownContactsEdit");
//     dropdownEdit.innerHTML = "";
//     contacts.forEach((contact) => {
//         const isChecked = task.assignedContacts.includes(contact.userID);
//         const checkboxId = `contact-edit-${contact.userID}`;
//         const div = document.createElement("div");
//         div.className = "checkbox-container";
//         div.innerHTML = `
//             <input class="cursorPointer" type="checkbox" id="${checkboxId}" name="assignedContactsEdit" value="${contact.userID}" ${isChecked ? "checked" : ""}>
//             <label for="${checkboxId}">${contact.name}</label>
//         `;
//         dropdownEdit.appendChild(div);
//     });
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

// function displayAssignedContacts(task) {
//     const editCheckedUserInitials = document.getElementById('editCheckedUserInitials');
//     editCheckedUserInitials.innerHTML = '';
//     task.assignedContacts.forEach(contactId => {
//         const contact = contacts.find(c => c.userID === contactId);
//         if (contact) {
//             const initialsDiv = document.createElement('div');
//             initialsDiv.className = 'userInitilas';
//             initialsDiv.textContent = `${contact.firstLetter}${contact.lastLetter}`;
//             initialsDiv.style.backgroundColor = contact.color;
//             editCheckedUserInitials.appendChild(initialsDiv);
//         }
//     });
// }

// document.getElementById("editTaskButton").addEventListener("click", async function () {
//     const allTaskInformation = document.getElementById("allTaskInformation");
//     toggleDisplay("allTaskInformation", "none");
//     toggleDisplay("taskEditorModal", "block");

//     const taskId = allTaskInformation.dataset.taskId;
//     const task = await getTaskById(taskId);

//     if (task) {
//         fillTaskEditor(task);
//         createContactCheckboxes(task);
//         addDropdownListeners();
//         displayAssignedContacts(task);
//     }
// });

// const openDropdownEdit = document.getElementById("openDropdownEdit");
// const dropdownEdit = document.getElementById("dropDownContactsEdit");

// openDropdownEdit.addEventListener("click", function (event) {
//     const isDropdownOpen = dropdownEdit.style.display === "block";
//     dropdownEdit.style.display = isDropdownOpen ? "none" : "block";

//     event.stopPropagation();
// });

// dropdownEdit.addEventListener("click", function (event) {
//     event.stopPropagation();
// });

// async function getTasks() {
//     return JSON.parse((await getItem("tasks")).value || []);
// }

// function getTaskIndex(tasks, taskId) {
//     return tasks.findIndex((task) => task.id === taskId);
// }

// function updateTask(task) {
//     task.title = document.getElementById("editTitle").value;
//     task.description = document.getElementById("editDescription").value;
//     task.taskDate = document.getElementById("editDueDate").value;
//     task.priority = document.getElementById("editPriority").value;
//     task.assignedContacts = Array.from(
//         document.querySelectorAll('#dropDownContactsEdit input[type="checkbox"]:checked')
//     ).map((el) => el.value);
// }

// async function saveTasks(tasks) {
//     await setItem("tasks", JSON.stringify(tasks));
// }

// document.getElementById("saveEdit").addEventListener("click", async function () {
//     const taskId = allTaskInformation.dataset.taskId;
//     const tasks = await getTasks();
//     const taskIndex = getTaskIndex(tasks, taskId);

//     if (taskIndex !== -1) {
//         updateTask(tasks[taskIndex]);
//         await saveTasks(tasks);
//         closeEditor();
//     } else {
//         alert("Aufgabe nicht gefunden.");
//     }
//     await initBoard();
// });

// const boardAddTaskButton = document.getElementById("boardAddTaskButton");
// const boardAddTask = document.getElementById("boardAddTask");

// boardAddTaskButton.addEventListener("click", function () {
//     boardAddTask.style.display = "block";
// });

// const boardAddTaskCloseButton = document.getElementById(
//     "boardAddTaskCloseButton"
// );

// boardAddTaskCloseButton.addEventListener("click", function () {
//     boardAddTask.style.display = "none";
// });

// document.getElementById("searchTask").addEventListener("input", function () {
//     searchTasks();
// });

// function searchTasks() {
//     const searchValue = document
//         .getElementById("searchTask")
//         .value.toLowerCase();
//     const taskCards = document.querySelectorAll(".task-card");

//     taskCards.forEach((card) => {
//         const title = card
//             .querySelector(".task-card-title")
//             .textContent.toLowerCase();
//         const description = card
//             .querySelector(".task-card-description")
//             .textContent.toLowerCase();

//         if (title.includes(searchValue) || description.includes(searchValue)) {
//             card.style.display = "";
//         } else {
//             card.style.display = "none";
//         }
//     });
// }

// const moveTaskButton = document.getElementById("moveTaskButton");

// moveTaskButton.addEventListener("click", function () {
//     const moveOption = document.getElementById("moveOption");
//     moveOption.style.display = "block";
// });

// const allTaskInformation = document.getElementById("allTaskInformation");
// allTaskInformation.addEventListener("click", function () {
//     allTaskInformation.style.display = "none";
// });

// const cardOptionsCloseButton = document.getElementById("cardOptionsCloseButton");

// cardOptionsCloseButton.addEventListener("click", function () {
//     const moveOption = document.getElementById("moveOption");
//     const allTaskInformation = document.getElementById("allTaskInformation");
//     moveOption.style.display = "none";
// });

// async function addEditSubtask() {
//     const subtaskInput = document.getElementById('editSubtaskInput');
//     const subtaskValue = subtaskInput.value.trim();
//     if (subtaskValue) {
//         const taskId = document.getElementById("allTaskInformation").dataset.taskId;
//         let tasks = JSON.parse((await getItem("tasks")).value || "[]");
//         let taskIndex = tasks.findIndex(task => task.id === taskId);
//         if (taskIndex !== -1) {
//             let task = tasks[taskIndex];
//             if (!task.subtasks) {
//                 task.subtasks = [];
//             }
//             task.subtasks.push({ name: subtaskValue, completed: false });
//             updateEditSubtaskList(task.subtasks);
//             await setItemFromJson('tasks', tasks);
//             subtaskInput.value = '';
//         }
//     }
// }

// async function removeEditSubtask(index) {
//     const taskId = document.getElementById("allTaskInformation").dataset.taskId;
//     let tasks = JSON.parse((await getItem("tasks")).value || "[]");
//     let taskIndex = tasks.findIndex(task => task.id === taskId);

//     if (taskIndex !== -1) {
//         let task = tasks[taskIndex];
//         if (task.subtasks && index >= 0 && index < task.subtasks.length) {
//             task.subtasks.splice(index, 1);
//             updateEditSubtaskList(task.subtasks);
//             await setItemFromJson('tasks', tasks);
//         }
//     }
// }

// function updateEditSubtaskList(subtasks) {
//     const list = document.getElementById('editSubtaskList');
//     list.innerHTML = '';
//     subtasks.forEach((subtask, index) => {
//         const li = document.createElement('li');
//         li.textContent = subtask.name;
//         const deleteButton = document.createElement('button');
//         deleteButton.textContent = 'Delete';
//         deleteButton.onclick = () => removeEditSubtask(index);
//         li.appendChild(deleteButton);
//         list.appendChild(li);
//     });
// }

// document.getElementById('editSubtaskAddButton').addEventListener('click', addEditSubtask);

// function loadEditSubtasks(task) {
//     updateEditSubtaskList(task.subtasks);
// }

// document.getElementById("editTaskButton").addEventListener("click", async function () {
//     const taskId = document.getElementById("allTaskInformation").dataset.taskId;
//     const tasks = JSON.parse((await getItem("tasks")).value || []);
//     const task = tasks.find((task) => task.id === taskId);

//     loadEditSubtasks(task);
// });

// document.querySelectorAll('.optionsContainerOption').forEach(option => {
//     option.addEventListener('click', async function () {
//         const taskId = document.getElementById("allTaskInformation").dataset.taskId;
//         let newStatus = this.id.replace('optionsContainer', '');
//         newStatus = convertIdToStatus(newStatus);
//         await updateTaskStatusAndMove(taskId, newStatus);
//         await initBoard();
//         const moveOption = document.getElementById("moveOption");
//         if (moveOption) {
//             moveOption.style.display = "none";
//         }
//     });
// });

// function convertIdToStatus(id) {
//     switch (id) {
//         case 'ToDo':
//             return 'todo';
//         case 'InProgress':
//             return 'inProgress';
//         case 'Done':
//             return 'done';
//         case 'AwaitFeedback':
//             return 'awaitFeedback';
//         default:
//             return '';
//     }
// }

// async function updateTaskStatusAndMove(taskId, newStatus) {
//     try {
//         let tasks = JSON.parse((await getItem("tasks")).value || "[]");
//         let taskIndex = tasks.findIndex(task => task.id === taskId);
//         if (taskIndex !== -1) {
//             tasks[taskIndex].status = newStatus;
//             await setItemFromJson('tasks', tasks);
//         }
//     } catch (error) {
//         console.error("Fehler beim Aktualisieren des Task-Status:", error);
//     }
// }

// async function toggleSubtaskCompletion(taskId, subtaskIndex, completedStatus) {
//     try {
//         let tasks = JSON.parse((await getItem("tasks")).value || "[]");
//         let taskIndex = tasks.findIndex(task => task.id === taskId);
//         if (taskIndex !== -1) {
//             let subtask = tasks[taskIndex].subtasks[subtaskIndex];
//             if (subtask) {
//                 subtask.completed = completedStatus;
//                 await setItemFromJson('tasks', tasks);
//             }
//         }
//     } catch (error) {
//         console.error("Fehler beim Aktualisieren des Subtask-Erledigungsstatus:", error);
//     }
// }
