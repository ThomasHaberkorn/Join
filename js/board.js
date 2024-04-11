async function initBoard() {
    await includeW3();
    boardActive();
    showInitials();
    await loadTasks();
}

function boardActive() {
    document.getElementById("boardSum").classList.add("bgfocus");
}
let tasks = [];

async function loadTasks() {
    tasks = JSON.parse((await getItem("tasks")).value || []);
}

async function toggleSubtaskCompletion(taskId, subtaskIndex, completedStatus) {
    // let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
        let subtask = tasks[taskIndex].subtasks[subtaskIndex];
        if (subtask) {
            subtask.completed = completedStatus; // Aktualisiere den Erledigungsstatus
            // localStorage.setItem("tasks", JSON.stringify(tasks)); // Speichere die aktualisierten Tasks
            await setItem("task", tasks);
        }
    }
}

// Eine Funktion, die die Initialen der zugewiesenen Kontakte basierend auf deren IDs zurückgibt
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
            return ""; // Für den Fall, dass kein Kontakt gefunden wird
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
            return ""; // Falls kein Kontakt gefunden wird
        })
        .join("");
}

// Warte, bis das gesamte HTML-Dokument vollständig geladen ist, bevor der Code ausgeführt wird
document.addEventListener("DOMContentLoaded", function () {
    // Erfasse alle Spalten für Aufgaben aus dem HTML-Dokument und speichere sie in der Variable taskColumns
    const taskColumns = document.querySelectorAll(".task-column");

    // Lade die Liste der Aufgaben aus dem Local Storage, falls vorhanden, andernfalls setze tasks auf ein leeres Array
    // let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Eine Funktion, die eine Karte für eine Aufgabe erstellt, basierend auf den Aufgabeninformationen
    function createTaskCard(task) {
        // Erstelle ein neues Artikel-Element für die Aufgabenkarte
        let card = document.createElement("article");
        card.className = "task-card";
        // Setze die ID der Karte auf die ID der Aufgabe oder eine zufällig generierte ID
        card.id = task.id || "task-" + Math.random().toString(36).substr(2, 9);
        card.setAttribute("draggable", true);
        card.dataset.status = task.status;

        // Bestimme die CSS-Klasse basierend auf der Kategorie der Aufgabe
        let categoryClass =
            task.category === "Technical Task"
                ? "category-technical"
                : "category-userstory";
        let categoryDiv = `<div class="${categoryClass}">${task.category}</div>`;

        // Erstelle HTML für die Subtask-Liste

        let subtasksHtml = '<ul class="task-card-subtasks">';
        task.subtasks.forEach((subtask) => {
            subtasksHtml += `<li>${subtask}</li>`;
        });

        subtasksHtml += "</ul>";

        // Erfasse die Initialen der zugewiesenen Kontakte
        const assignedContactElements = getAssignedContactElements(
            task.assignedContacts
        );

        // Zuordnung von Prioritäten zu Bildern
        const prioritySymbols = {
            Urgent: "./assets/img/urgentSymbol.png", // Pfad zum Bild für hohe Priorität
            Medium: "./assets/img/mediumSymbol.png", // Pfad zum Bild für mittlere Priorität
            Low: "./assets/img/lowSymbol.png", // Pfad zum Bild für niedrige Priorität
        };

        // Wählen Sie das entsprechende Symbol basierend auf der Task-Priorität
        const prioritySymbol = prioritySymbols[task.priority];

        // HTML für das Prioritätssymbol, wenn eine Priorität gesetzt ist
        const prioritySymbolHtml = prioritySymbol
            ? `<img src="${prioritySymbol}" class="priority-symbol" alt="${task.priority}" style="margin-left: 10px;">`
            : "";

        const totalSubtasks = task.subtasks.length;
        const completedSubtasks = task.subtasks.filter(
            (subtask) => subtask.completed
        ).length;
        const progressPercentage =
            totalSubtasks === 0 ? 0 : (completedSubtasks / totalSubtasks) * 100;
        const progressHtml = `
            <div class="subtaskWithProgressBar">
            <div class="progress" style="background-color: #e0e0e0; border-radius: 2px; margin-top: 10px;">
                <div class="progress-bar" style="width: ${progressPercentage}%"></div>
            </div>
            <div class="subtaskNextToProgressBar";">${completedSubtasks}/${totalSubtasks} Subtasks</div>
            </div>
        `;

        // Setze den HTML-Inhalt der Aufgabenkarte
        card.innerHTML = `
            <div class="task-card-header">${categoryDiv}</div>
            <div class="task-card-title">${task.title}</div>
            <div class="task-card-description">${task.description}</div>
            </div>${progressHtml} <!-- Progress-Bar und Subtasks-Anzeige einfügen -->
            <div class="prioAndContact">
                <div style="display: flex;">${assignedContactElements}</div>
                ${prioritySymbolHtml} <!-- Füge das Prioritätssymbol hinzu -->
            </div>
        `;

        card.addEventListener("dragstart", handleDragStart);

        function openAllTaskInformation(task) {
            // Definiere allTaskInformation zuerst, bevor du darauf zugreifst
            const allTaskInformation =
                document.getElementById("allTaskInformation");

            // Jetzt, wo allTaskInformation definiert ist, kannst du darauf zugreifen und dessen Eigenschaften setzen
            allTaskInformation.dataset.taskId = task.id; // Speichere die ID der Aufgabe

            // Zeige den "All Task Information" Bereich an
            allTaskInformation.style.display = "flex";

            // Zuordnung von Prioritäten zu Bildern
            const prioritySymbols = {
                Urgent: "./assets/img/urgentSymbol.png", // Pfad zum Bild für hohe Priorität
                Medium: "./assets/img/mediumSymbol.png", // Pfad zum Bild für mittlere Priorität
                Low: "./assets/img/lowSymbol.png", // Pfad zum Bild für niedrige Priorität
            };

            // Wählen Sie das entsprechende Symbol basierend auf der Task-Priorität
            const prioritySymbol = prioritySymbols[task.priority];

            // HTML für das Prioritätssymbol, wenn eine Priorität gesetzt ist
            const prioritySymbolHtml = prioritySymbol
                ? `<img src="${prioritySymbol}" class="priority-symbol" alt="${task.priority}" style="vertical-align: middle; margin-left: 5px;">`
                : "";

            const allTaskInformationPriority = document.getElementById(
                "allTaskInformationPriority"
            );
            // Stellen Sie sicher, dass Sie sowohl den Prioritätstext als auch das Bild (wenn vorhanden) anzeigen
            allTaskInformationPriority.innerHTML =
                task.priority + prioritySymbolHtml;

            // Setze den Titel, Beschreibung, Priorität, Fälligkeitsdatum, zugewiesene Person, Kategorie, Status und Subtasks
            // basierend auf der übergebenen Aufgabe (task)
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

            const allTaskInformationCategory = document.getElementById(
                "allTaskInformationCategory"
            );

            if (task.category === "Technical Task") {
                allTaskInformationCategory.textContent = "Technical Task";
                allTaskInformationCategory.className = "category-technical";
            } else {
                allTaskInformationCategory.textContent = "User Story";
                allTaskInformationCategory.className = "category-userstory";
            }

            const allTaskInformationSubtasks = document.getElementById(
                "allTaskInformationSubtasks"
            );
            allTaskInformationSubtasks.innerHTML = "";
            allTaskInformationSubtasks.style.listStyle = "none"; // Add this line to set the list style to none
            task.subtasks.forEach((subtask, index) => {
                const subtaskElement = document.createElement("li");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = subtask.completed; // Achte darauf, dass dies korrekt auf das completed-Attribut des Subtask-Objekts zugreift
                checkbox.dataset.index = index; // Speichere den Index für den Zugriff im Event Listener

                // Event Listener für die Änderungen der Checkbox
                checkbox.addEventListener("change", function () {
                    toggleSubtaskCompletion(task.id, index, this.checked);
                });

                subtaskElement.appendChild(checkbox);
                subtaskElement.appendChild(
                    document.createTextNode(subtask.name)
                );
                allTaskInformationSubtasks.appendChild(subtaskElement);
            });
        }

        // Füge einen Event Listener für den Klick auf die Aufgabenkarte hinzu
        card.addEventListener("click", function () {
            // Angenommen, 'task' ist die Aufgabe, die die Karte repräsentiert
            openAllTaskInformation(task);
        });

        return card;
    }

    // Iteriere über die vorhandenen Aufgaben und füge sie den entsprechenden Spalten im Board hinzu
    tasks.forEach((task) => {
        if (document.getElementById(task.status)) {
            let taskCard = createTaskCard(task);
            document.getElementById(task.status).appendChild(taskCard);
        }
    });

    // Eine Funktion, die die Anzeige der Spalten aktualisiert, um anzuzeigen, ob sie Aufgaben enthalten oder nicht
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

    // Aktualisiere die Anzeige der Spalten
    updateTaskColumns();

    // Füge Event Listener für Drag-and-Drop-Operationen zu den Spalten hinzu
    taskColumns.forEach((column) => {
        column.addEventListener("dragover", handleDragOver);
        column.addEventListener("drop", handleDrop);
    });

    // Eine Funktion, die aufgerufen wird, wenn ein Drag-and-Drop-Vorgang gestartet wird
    function handleDragStart(e) {
        e.dataTransfer.setData("text/plain", e.target.id);
    }

    // Eine Funktion, die aufgerufen wird, wenn eine Element über eine Drop-Zone bewegt wird
    function handleDragOver(e) {
        e.preventDefault();
    }

    // Eine Funktion, die aufgerufen wird, wenn ein Element in eine Drop-Zone gezogen wird
    function handleDrop(e) {
        e.preventDefault();
        const id = e.dataTransfer.getData("text");
        const draggableElement = document.getElementById(id);

        const newStatus = e.target.closest(".task-column").id;
        draggableElement.dataset.status = newStatus;

        e.target.closest(".task-column").appendChild(draggableElement);
        updateTaskInLocalStorage(id, newStatus);
        updateTaskColumns();
    }

    // Eine Funktion, die den Status einer Aufgabe im Local Storage aktualisiert
    async function updateTaskInLocalStorage(taskId, newStatus) {
        // Finde den Index der Aufgabe in der tasks-Liste basierend auf der taskId
        let taskIndex = tasks.findIndex((task) => task.id === taskId);
        // Falls die Aufgabe gefunden wurde

        if (taskIndex !== -1) {
            // Aktualisiere den Status der Aufgabe
            tasks[taskIndex].status = newStatus;

            // Speichere die aktualisierte Liste der Aufgaben im Local Storage
            // localStorage.setItem("tasks", JSON.stringify(tasks));
            await setItem("task", tasks);
        }
    }

    document.querySelectorAll(".edit-prio").forEach((button) => {
        button.addEventListener("click", function () {
            // Entferne zunächst die spezifischen Farbklassen von allen Buttons
            document.querySelectorAll(".edit-prio").forEach((btn) => {
                btn.classList.remove(
                    "priority-urgent",
                    "priority-medium",
                    "priority-low"
                );
            });

            // Füge die entsprechende Farbklasse basierend auf dem data-prio Attribut hinzu
            switch (this.dataset.prio) {
                case "Urgent":
                    this.classList.add("priority-urgent");
                    break;
                case "Medium":
                    this.classList.add("priority-medium");
                    break;
                case "Low":
                    this.classList.add("priority-low");
                    break;
            }

            // Aktualisiere den Wert des versteckten Inputs mit der gewählten Priorität
            document.getElementById("editPriority").value = this.dataset.prio;
        });
    });
});

function closeAllTaskInformation() {
    const allTaskInformation = document.getElementById("allTaskInformation");
    allTaskInformation.style.display = "none";
}

async function deleteTask() {
    const allTaskInformation = document.getElementById("allTaskInformation");
    const taskId = allTaskInformation.dataset.taskId; // Hole die gespeicherte ID der Aufgabe
    // const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskIndex = tasks.findIndex((task) => task.id === taskId); // Finde die Aufgabe basierend auf der ID
    if (taskIndex !== -1) {
        // Wenn die Aufgabe gefunden wurde
        const taskCard = document.getElementById(tasks[taskIndex].id);
        if (taskCard) {
            taskCard.remove(); // Entferne die Karte der Aufgabe aus dem DOM
            tasks.splice(taskIndex, 1); // Entferne die Aufgabe aus der Liste
            // localStorage.setItem("tasks", JSON.stringify(tasks)); // Speichere die aktualisierte Liste der Aufgaben
            await setItem("task", tasks);
        }
    }
    closeAllTaskInformation(); // Schließe den "All Task Information"-Bereich
}

function closeEditor() {
    const editTaskInformation = document.getElementById("taskEditorModal");
    const allTaskInformation = document.getElementById("allTaskInformation");
    editTaskInformation.style.display = "none";
}

const editTaskButton = document.getElementById("editTaskButton");

function setTaskEditorCategory(category) {
    const taskEditorCategory = document.getElementById("taskEditorCategory");
    if (category === "Technical Task") {
        taskEditorCategory.textContent = "Technical Task";
        taskEditorCategory.className = "category-technical"; // Setzen Sie hier die richtige Klasse für das Design
    } else if (category === "User Story") {
        taskEditorCategory.textContent = "User Story";
        taskEditorCategory.className = "category-userstory"; // Setzen Sie hier die richtige Klasse für das Design
    } else {
        // Standard oder Fehlerbehandlung, falls notwendig
        taskEditorCategory.textContent = "Category not set";
        taskEditorCategory.className = "category-default"; // Eine Standardklasse, falls die Kategorie unbekannt ist
    }
}

document
    .getElementById("editTaskButton")
    .addEventListener("click", function () {
        const allTaskInformation =
            document.getElementById("allTaskInformation");
        const taskEditorModal = document.getElementById("taskEditorModal");
        allTaskInformation.style.display = "none";
        taskEditorModal.style.display = "block";

        const taskId = allTaskInformation.dataset.taskId;
        // const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const task = tasks.find((task) => task.id === taskId);

        if (task) {
            setTaskEditorCategory(task.category); // Aufruf der neuen Funktion mit der aktuellen Kategorie der Aufgabe
            document.getElementById("editTitle").value = task.title;
            document.getElementById("editDescription").value = task.description;
            document.getElementById("editDueDate").value = task.taskDate;

            // Setze die Priorität in der Bearbeitungsansicht entsprechend der Aufgabe
            const prioritySelect = document.getElementById("editPriority");
            // Korrigiere die Annahme über die Werte der Optionen im Select-Element
            prioritySelect.value = task.priority; // Vorausgesetzt die Werte sind 'Low', 'Medium', 'High'

            // Dropdown mit Kontakten dynamisch befüllen
            const dropdownEdit = document.getElementById(
                "dropDownContactsEdit"
            );
            dropdownEdit.innerHTML = ""; // Vorhandene Inhalte löschen
            contacts.forEach((contact) => {
                const isChecked = task.assignedContacts.includes(
                    contact.userID
                );
                const checkboxId = `contact-edit-${contact.userID}`;
                const div = document.createElement("div");
                div.className = "checkbox-container";
                div.innerHTML = `
                <input class="cursorPointer" type="checkbox" id="${checkboxId} " name="assignedContactsEdit" value="${
                    contact.userID
                }" ${isChecked ? "checked" : ""}>
                <label for="${checkboxId}">${contact.name}</label>
            `;
                dropdownEdit.appendChild(div);
            });

            // Öffnen/Schließen des Dropdowns mit korrektem Event Handling
            const openDropdownEdit =
                document.getElementById("openDropdownEdit");
            openDropdownEdit.addEventListener("click", function (event) {
                event.stopPropagation(); // Verhindere, dass das Klick-Event weiter nach oben im DOM propagiert wird
                dropdownEdit.style.display =
                    dropdownEdit.style.display === "block" ? "none" : "block";
            });

            // Verhindern, dass das Dropdown schließt, wenn innerhalb des Dropdowns geklickt wird
            dropdownEdit.addEventListener("click", function (event) {
                event.stopPropagation();
            });

            // Füge einen globalen Event Listener hinzu, um das Dropdown zu schließen, wenn außerhalb geklickt wird
            document.addEventListener("click", function (event) {
                if (
                    dropdownEdit.style.display === "block" &&
                    !event.target.matches("#openDropdownEdit")
                ) {
                    dropdownEdit.style.display = "none";
                }
            });

            // Lösche vorhandene Initialen
            const editCheckedUserInitials = document.getElementById(
                "editCheckedUserInitials"
            );
            editCheckedUserInitials.innerHTML = "";

            task.assignedContacts.forEach((contactId) => {
                const contact = contacts.find((c) => c.userID === contactId);
                if (contact) {
                    const initialsDiv = document.createElement("div");
                    initialsDiv.className = "userInitilas"; // Stellen Sie sicher, dass diese Klasse Ihren CSS-Styles entspricht
                    initialsDiv.textContent = `${contact.firstLetter}${contact.lastLetter}`;
                    initialsDiv.style.backgroundColor = contact.color; // Setze die Hintergrundfarbe des Divs auf die Farbe des Kontakts
                    editCheckedUserInitials.appendChild(initialsDiv);
                }
            });
        }
    });

// Entferne den direkten onclick-Handler von openDropdownEdit, da ein Event Listener hinzugefügt wurde

// Annahme, openDropdownEdit ist der Pfeil/das Icon, mit dem das Dropdown geöffnet und geschlossen wird.
const openDropdownEdit = document.getElementById("openDropdownEdit");
const dropdownEdit = document.getElementById("dropDownContactsEdit");

openDropdownEdit.addEventListener("click", function (event) {
    const isDropdownOpen = dropdownEdit.style.display === "block";
    dropdownEdit.style.display = isDropdownOpen ? "none" : "block";

    // Verhindert, dass das Klick-Event weiter nach oben im DOM propagiert wird
    event.stopPropagation();
});

// Verhindere, dass das Dropdown schließt, wenn innerhalb des Dropdowns geklickt wird
dropdownEdit.addEventListener("click", function (event) {
    event.stopPropagation();
});

document
    .getElementById("saveEdit")
    .addEventListener("click", async function () {
        const taskId = allTaskInformation.dataset.taskId;
        // let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const taskIndex = tasks.findIndex((task) => task.id === taskId);

        if (taskIndex !== -1) {
            // Aktualisiere die Task im Array
            tasks[taskIndex].title = document.getElementById("editTitle").value;
            tasks[taskIndex].description =
                document.getElementById("editDescription").value;
            tasks[taskIndex].taskDate =
                document.getElementById("editDueDate").value;
            tasks[taskIndex].priority =
                document.getElementById("editPriority").value;
            tasks[taskIndex].assignedContacts = Array.from(
                document.querySelectorAll(
                    '#dropDownContactsEdit input[type="checkbox"]:checked'
                )
            ).map((el) => el.value);

            // localStorage.setItem("tasks", JSON.stringify(tasks)); // Speichern des aktualisierten Arrays im Local Storage
            await setItem("task", tasks);

            closeEditor(); // Schließen des Editors
            // Füge hier eventuell Code hinzu, um die Anzeige zu aktualisieren
        } else {
            alert("Aufgabe nicht gefunden.");
        }
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

function searchTasks() {
    const searchValue = document
        .getElementById("boardSearchbar")
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
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

document.getElementById("searchTask").addEventListener("input", function () {
    searchTasks();
});

function searchTasks() {
    // Hole den aktuellen Wert des Suchfelds und wandele ihn in Kleinbuchstaben um
    const searchValue = document
        .getElementById("searchTask")
        .value.toLowerCase();

    // Wähle alle Aufgabenkarten aus
    const taskCards = document.querySelectorAll(".task-card");

    // Durchlaufe jede Karte und prüfe, ob der Titel oder die Beschreibung den Suchbegriff enthält
    taskCards.forEach((card) => {
        // Hole den Text des Titels und der Beschreibung und wandele sie in Kleinbuchstaben um
        const title = card
            .querySelector(".task-card-title")
            .textContent.toLowerCase();
        const description = card
            .querySelector(".task-card-description")
            .textContent.toLowerCase();

        // Prüfe, ob der Titel oder die Beschreibung den Suchbegriff enthält
        if (title.includes(searchValue) || description.includes(searchValue)) {
            card.style.display = ""; // Zeige die Karte an, wenn sie den Suchbegriff enthält
        } else {
            card.style.display = "none"; // Verberge die Karte, wenn sie den Suchbegriff nicht enthält
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

const cardOptionsCloseButton = document.getElementById(
    "cardOptionsCloseButton"
);

cardOptionsCloseButton.addEventListener("click", function () {
    const moveOption = document.getElementById("moveOption");
    const allTaskInformation = document.getElementById("allTaskInformation");
    moveOption.style.display = "none";
});

async function addEditSubtask() {
    const subtaskInput = document.getElementById("editSubtaskInput");
    const subtaskValue = subtaskInput.value.trim();
    if (subtaskValue) {
        // Holt die aktuelle Task aus dem Local Storage
        const taskId =
            document.getElementById("allTaskInformation").dataset.taskId;
        // let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        let task = tasks.find((task) => task.id === taskId);
        if (!task.subtasks) {
            task.subtasks = [];
        }
        task.subtasks.push({name: subtaskValue, completed: false});
        updateEditSubtaskList(task.subtasks);
        // localStorage.setItem("tasks", JSON.stringify(tasks)); // Aktualisiere die Task im Local Storage
        await setItem("task", tasks);
        subtaskInput.value = "";
    }
}

async function removeEditSubtask(index) {
    const taskId = document.getElementById("allTaskInformation").dataset.taskId;
    // let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let task = tasks.find((task) => task.id === taskId);
    task.subtasks.splice(index, 1);
    updateEditSubtaskList(task.subtasks);
    // localStorage.setItem("tasks", JSON.stringify(tasks)); // Aktualisiere die Task im Local Storage
    await setItem("task", tasks);
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

// Diese Funktion wird aufgerufen, wenn der Task Editor geöffnet wird, um die bestehenden Subtasks zu laden.
function loadEditSubtasks(task) {
    updateEditSubtaskList(task.subtasks);
}

// Aktualisieren Sie die Funktion, die das Task-Editor-Modal öffnet, um die Subtasks zu laden:
document
    .getElementById("editTaskButton")
    .addEventListener("click", function () {
        // Ihr bestehender Code, um das Modal zu öffnen und Task-Details zu laden...

        const taskId =
            document.getElementById("allTaskInformation").dataset.taskId;
        // const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const task = tasks.find((task) => task.id === taskId);

        loadEditSubtasks(task); // Laden Sie die Subtasks der ausgewählten Task
    });

document.addEventListener("DOMContentLoaded", function () {
    // Zuweisung der Event Listener zu den "Move to"-Optionen
    document.querySelectorAll(".optionsContainerOption").forEach((option) => {
        option.addEventListener("click", function () {
            const taskId =
                document.getElementById("allTaskInformation").dataset.taskId;
            let newStatus = this.id.replace("optionsContainer", ""); // Entfernt "optionsContainer" aus der ID
            // Konvertiert die ID in den entsprechenden Statuswert
            newStatus = convertIdToStatus(newStatus);
            updateTaskStatusAndMove(taskId, newStatus);
        });
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
            return ""; // oder werfen Sie einen Fehler, falls kein passender Status gefunden wurde
    }
}

async function updateTaskStatusAndMove(taskId, newStatus) {
    // let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].status = newStatus;
        // localStorage.setItem("tasks", JSON.stringify(tasks));
        await setItem("task", tasks);
        window.location.reload(); // Seite neu laden, um Änderungen zu reflektieren
    }
}
