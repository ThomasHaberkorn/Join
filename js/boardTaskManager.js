let createBtn = document.getElementById("boardCreate-btn");
let urgentBtn = document.getElementById("boardUrgentBtn");
let mediumBtn = document.getElementById("boardMediumBtn");
let lowBtn = document.getElementById("boardLowBtn");
let subtaskInput = document.getElementById("boardSubtask");
let subtaskAddButton = document.getElementById("boardSubtask-img");
let subtaskList = document.getElementById("boardList");
let openDropdown = document.getElementById("boardOpenDropdown");
let priorityButtons = {Urgent: urgentBtn, Medium: mediumBtn, Low: lowBtn};
let priority = "";
let subtasks = [];
let tasks = [];

function fillContactDropdown() {
    const dropdown = document.getElementById("dropDownContacts");
    contacts.forEach((contact) => {
        const div = document.createElement("div");
        div.innerHTML = `
                        <input type="checkbox" class="contact-checkbox" id="contact-${contact.userID}" name="assignedContacts" value="${contact.userID}">
                        <label for="contact-${contact.userID}">${contact.name}</label>
                    `;
        dropdown.appendChild(div);
    });
}

function fillDropdownList() {
        let dropdown = document.getElementById("dropDownContacts");

        if (
            dropdown.style.display === "none" ||
            dropdown.style.display === ""
        ) {
            dropdown.style.display = "block";
        } else {
            dropdown.style.display = "none";
        }
}

function setPriority(selectedPriority) {
    priority = selectedPriority;

    Object.values(priorityButtons).forEach((button) => {
        button.classList.remove("selected-priority");
    });
    priorityButtons[selectedPriority].classList.add("selected-priority");
}

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

function addSubtask(subtaskName) {
    let subtask = {
        name: subtaskName,
        completed: false,
    };
    subtasks.push(subtask);

    updateSubtaskList();
}

function removeSubtask(index) {
    subtasks.splice(index, 1);
    updateSubtaskList();
}

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

        let text = document.createTextNode(" " + subtask.name);
        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("subtaskDeleteBtn");
        deleteButton.onclick = function () {
            removeSubtask(index);
        };

        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(deleteButton);
        subtaskList.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    subtaskAddButton.addEventListener("click", function () {
        let subtaskValue = subtaskInput.value.trim();
        if (subtaskValue) {
            addSubtask(subtaskValue);
            subtaskInput.value = "";
        }
    });
});

async function addTask(event) {
    event.preventDefault();

    let title = document.getElementById("titleInput").value;
    let description = document.getElementById("descriptionInput").value;
    let taskDate = document.getElementById("taskDate").value;
    let category = document.getElementById("category").value;
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
        status: "todo",
        assignedContacts,
    });

    await setItem("tasks", tasks);

    var clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
    });
    boardAddTaskCloseButton.dispatchEvent(clickEvent);
}
