document.addEventListener("DOMContentLoaded", async function () {
    await loadContacts();
});

async function initBoard() {
    await includeW3();
    await sortTasks();
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
        <div class="progress" >
            <div class="progress-bar" style="width: ${progressPercentage}%"></div>
        </div>
        <div class="subtaskNextToProgressBar";">${completedSubtasks}/${totalSubtasks} Subtasks</div>
        </div>
    `;
}

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
        column.innerHTML = "";
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
