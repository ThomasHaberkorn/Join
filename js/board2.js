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

// Fügt Event-Listener zu allen Task-Spalten hinzu
taskColumns.forEach((column) => {
    column.addEventListener("dragover", handleDragOver);
    column.addEventListener("dragenter", handleDragEnter);
    column.addEventListener("dragleave", handleDragLeave);
    column.addEventListener("drop", handleDrop);
});

function handleDragOver(e) {
    e.preventDefault(); // Erlaubt das Droppen von Elementen
}

function handleDragEnter(e) {
    e.preventDefault();
    // Fügt die hovered Klasse hinzu, wenn eine Task über die Spalte gezogen wird
    this.classList.add("hovered");
}

function handleDragLeave() {
    // Entfernt die hovered Klasse, wenn die Task die Spalte verlässt
    this.classList.remove("hovered");
}

function handleDrop(e) {
    e.preventDefault();
    // Hier Ihre Logik zum Behandeln des Droppens der Task
    const id = e.dataTransfer.getData("text");
    const draggableElement = document.getElementById(id);
    const newStatus = e.target.closest(".task-column").id;
    draggableElement.dataset.status = newStatus;
    e.target.closest(".task-column").appendChild(draggableElement);
    updateTaskInRemoteStorage(id, newStatus);
    updateTaskColumns();

    // Entfernt die hovered Klasse, nachdem die Task abgelegt wurde
    this.classList.remove("hovered");
}
