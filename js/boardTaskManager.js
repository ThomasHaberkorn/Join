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

async function loadContacts() {
    contacts = JSON.parse((await getItem("contacts")).value || "[]");
}

async function loadTasks() {
    tasks = JSON.parse((await getItem("tasks")).value || "[]");
}

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

function handleCheckboxChange(checkbox) {
    const itemAndCheckbox = checkbox.closest(".itemAndCheckbox");
    if (checkbox.checked) {
        itemAndCheckbox.classList.add("checkedItemAndCheckbox");
    } else {
        itemAndCheckbox.classList.remove("checkedItemAndCheckbox");
    }
}

function loadCheckedUserInitials() {
    const editCheckedUserInitials = document.getElementById(
        "boardCheckedUserInitials"
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

function setPriority(selectedPriority) {
    priority = selectedPriority;
    resetButtons();
    updateSelectedButton(selectedPriority);
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
    let categoryElement = document.querySelector(".dropdown-selected");
    let category = categoryElement ? categoryElement.textContent.trim() : null;

    if (!category || category === "Select task Category") {
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

function fillDropdownList() {
    let dropdown = document.getElementById("boardDropDownContacts");
    let checkedUserInitials = document.getElementById(
        "boardCheckedUserInitials"
    );

    if (dropdown.style.display === "none" || dropdown.style.display === "") {
        dropdown.style.display = "block";
        checkedUserInitials.style.display = "none";
    } else {
        dropdown.style.display = "none";
        checkedUserInitials.style.display = "flex";
        loadCheckedUserInitials();
    }
}

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

function showClearButton(value) {
    document.getElementById("clear-subtask").style.display = value
        ? "inline"
        : "none";
}

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
                imgElement.src = "assets/img/checkboxChecked.png";
            } else {
                imgElement.src = "assets/img/checkbox.png";
            }
        });
    });

function closeBoardAddTask() {
    document.getElementById("boardAddTask").style.display = "none";
}

function openAddTaskWithStatus(status) {
    currentTaskStatus = status;
    document.getElementById("boardAddTask").style.display = "block";
    document.getElementById("boardCheckedUserInitials").innerHTML = "";
}

document.addEventListener(
    "mousedown",
    function (event) {
        var dropdown = document.getElementById("boardDropDownContacts");
        var inputDropDown = document.getElementById("inputDropDown");
        var openDropdown = document.getElementById("openDropdown");
        var boardCheckedUserInitials = document.getElementById(
            "boardCheckedUserInitials"
        );

        if (dropdown) {
            var isClickInsideDropdown = dropdown.contains(event.target);
            var isClickInsideInputDropDown =
                inputDropDown && inputDropDown.contains(event.target);
            var isClickInsideOpenDropdown =
                openDropdown && openDropdown.contains(event.target);
            var dropdownDisplay = window.getComputedStyle(dropdown).display;

            if (
                !isClickInsideDropdown &&
                !isClickInsideInputDropDown &&
                !isClickInsideOpenDropdown &&
                dropdownDisplay === "block"
            ) {
                dropdown.style.display = "none";
                boardCheckedUserInitials.style.display = "flex";
                loadCheckedUserInitials();
            }
        }
    },
    true
);

document.addEventListener(
    "mousedown",
    function (event) {
        var dropdown = document.getElementById("dropDownContactsEdit");
        var contactDropdownEdit = document.getElementById(
            "contact-dropdown-edit"
        );
        var inputDropdownEdit = document.getElementById("input-dropdown-edit");
        var openDropdownEdit = document.getElementById("openDropdownEdit");
        var editInputDropdown = document.getElementById("editInputDropdown");

        if (dropdown) {
            var isClickInsideDropdown = dropdown.contains(event.target);
            var isClickInsideContactDropdownEdit =
                contactDropdownEdit &&
                contactDropdownEdit.contains(event.target);
            var isClickInsideInputDropdownEdit =
                inputDropdownEdit && inputDropdownEdit.contains(event.target);
            var isClickInsideOpenDropdownEdit =
                openDropdownEdit && openDropdownEdit.contains(event.target);
            var isClickInsideEditInputDropdown =
                editInputDropdown && editInputDropdown.contains(event.target);
            var dropdownDisplay = window.getComputedStyle(dropdown).display;

            if (
                !isClickInsideDropdown &&
                !isClickInsideContactDropdownEdit &&
                !isClickInsideInputDropdownEdit &&
                !isClickInsideOpenDropdownEdit &&
                !isClickInsideEditInputDropdown &&
                dropdownDisplay === "block"
            ) {
                dropdown.style.display = "none";
                updateEditCheckedUserInitials();
            }
        }
    },
    true
);

function updateEditCheckedUserInitials() {
    const dropdownEdit = document.getElementById("dropDownContactsEdit");
    const editCheckedUserInitials = document.getElementById(
        "editCheckedUserInitials"
    );
    editCheckedUserInitials.innerHTML = "";

    const checkboxes = dropdownEdit.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            const contactId = checkbox.value;
            const contact = contacts.find((c) => c.userID === contactId);
            if (contact) {
                const initialsDiv = document.createElement("div");
                initialsDiv.className = "userInitials";
                initialsDiv.textContent = `${contact.firstLetter}${contact.lastLetter}`;
                initialsDiv.style.backgroundColor = contact.color;
                editCheckedUserInitials.appendChild(initialsDiv);
            }
        }
    });
}
