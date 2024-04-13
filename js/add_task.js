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

async function initAddSidebar() {
    await includeW3();
    addTaskActive();
    showInitials();
}
function addTaskActive() {
    document.getElementById("addTasksum").classList.add("bgfocus");
}

document.addEventListener("DOMContentLoaded", async function () {
    await loadContacts();
    await loadTasks();
    fillContactDropdown();
    fillDropdownList();
    setPriorityLevel();
});

async function loadContacts() {
    contacts = JSON.parse((await getItem("contacts")).value || "[]");
}

async function loadTasks() {
    tasks = JSON.parse((await getItem("tasks")).value || "[]");
}

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
    openDropdown.addEventListener("click", function () {
        let dropdown = document.getElementById("dropDownContacts");

        if (
            dropdown.style.display === "none" ||
            dropdown.style.display === ""
        ) {
            dropdown.style.display = "block";
        } else {
            dropdown.style.display = "none";
        }
    });
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


document.addEventListener("DOMContentLoaded", function() {
    let form = document.querySelector(".addTaskContentContainer");

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            let title = document.getElementById("titleInput").value;
            let description = document.getElementById("descriptionInput").value;
            let taskDate = document.getElementById("taskDate").value;
            let category = document.getElementById("category").value;
            let assignedContacts = [...document.querySelectorAll(".contact-checkbox:checked")].map(input => input.value);
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

            setItem("tasks", tasks);

            window.location.href = "board.html";
        });
    }

});
