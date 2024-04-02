async function initBoard() {
    await includeHTML();
    boardActive();
}

function boardActive() {
    document.getElementById("boardSum").classList.add("bgfocus");
}

// Warte, bis das gesamte HTML-Dokument vollständig geladen ist, bevor der Code ausgeführt wird
document.addEventListener("DOMContentLoaded", function () {
    // Erfasse alle Spalten für Aufgaben aus dem HTML-Dokument und speichere sie in der Variable taskColumns
    const taskColumns = document.querySelectorAll(".task-column");

    // Lade die Liste der Aufgaben aus dem Local Storage, falls vorhanden, andernfalls setze tasks auf ein leeres Array
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Eine Funktion, die die Initialen der zugewiesenen Kontakte basierend auf deren IDs zurückgibt
    function getAssignedContactInitials(assignedContactIds) {
        // Die Funktion erhält als Parameter ein Array von zugewiesenen Kontakt-IDs

        // Die map() Methode wird auf das Array der zugewiesenen Kontakt-IDs angewendet,
        // um ein neues Array zu erstellen, das die Initialen der Kontakte enthält
        return assignedContactIds
            .map((contactId) => {
                // Für jede Kontakt-ID wird eine Funktion ausgeführt, die die Initialen berechnet

                // Suche den Kontakt in der Kontaktliste anhand seiner ID
                const contact = contacts.find(
                    (contact) => contact.userID === contactId
                );
                // Die find() Methode wird verwendet, um den Kontakt mit der aktuellen Kontakt-ID zu finden

                // Überprüfe, ob der Kontakt gefunden wurde und einen Namen hat
                if (contact && contact.name) {
                    // Wenn ein Kontakt mit der angegebenen ID gefunden wurde und einen Namen hat

                    // Erstelle die Initialen des Kontakts
                    const initials = contact.name
                        .split(" ")
                        .filter((namePart) => namePart.length > 0) // Entferne leere Teile des Namens
                        .map((namePart) => namePart[0].toUpperCase()) // Wähle den ersten Buchstaben jedes Namens und wandele ihn in Großbuchstaben um
                        .join(""); // Verbinde die Initialen zu einem einzigen String
                    return initials; // Gib die Initialen des Kontakts zurück
                } else {
                    return "??"; // Wenn der Kontakt nicht gefunden wurde oder keinen Namen hat, gib '??' zurück
                }
            })
            .join(", "); // Verbinde die Initialen aller gefundenen Kontakte zu einem einzigen String und gib sie zurück
    }

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
        const assignedContactInitials = getAssignedContactInitials(
            task.assignedContacts
        );

        // Setze den HTML-Inhalt der Aufgabenkarte

        card.innerHTML = `
            <div class="task-card-header">${categoryDiv}</div>
            <div class="task-card-title">${task.title}</div>
            <div class="task-card-description">${task.description}</div>
            ${subtasksHtml}
            <div class="progress">
            <div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <div>Applied to: ${assignedContactInitials}</div>
        `;


        card.addEventListener('dragstart', handleDragStart);
        
        function openAllTaskInformation(task) {
            // Definiere allTaskInformation zuerst, bevor du darauf zugreifst
            const allTaskInformation = document.getElementById('allTaskInformation');
            
            // Jetzt, wo allTaskInformation definiert ist, kannst du darauf zugreifen und dessen Eigenschaften setzen
            allTaskInformation.dataset.taskId = task.id; // Speichere die ID der Aufgabe
        
            // Zeige den "All Task Information" Bereich an
            allTaskInformation.style.display = 'block';
        
            // Setze den Titel, Beschreibung, Priorität, Fälligkeitsdatum, zugewiesene Person, Kategorie, Status und Subtasks
            // basierend auf der übergebenen Aufgabe (task)
            const allTaskInformationTitle = document.getElementById('allTaskInformationTitle');
            allTaskInformationTitle.textContent = task.title;
        
            const allTaskInformationDescription = document.getElementById('allTaskInformationDescription');
            allTaskInformationDescription.textContent = task.description;
        
            const allTaskInformationPriority = document.getElementById('allTaskInformationPriority');
            allTaskInformationPriority.textContent = task.priority;
        
            const allTaskInformationDueDate = document.getElementById('allTaskInformationDueDate');
            allTaskInformationDueDate.textContent = task.taskDate;
        
            const allTaskInformationAssignedTo = document.getElementById('allTaskInformationAssignedTo');
            allTaskInformationAssignedTo.textContent = getAssignedContactInitials(task.assignedContacts);
        
            const allTaskInformationCategory = document.getElementById('allTaskInformationCategory');
            allTaskInformationCategory.textContent = task.category;
        
            const allTaskInformationStatus = document.getElementById('allTaskInformationStatus');
            allTaskInformationStatus.textContent = task.status;
        
            const allTaskInformationSubtasks = document.getElementById('allTaskInformationSubtasks');
            allTaskInformationSubtasks.innerHTML = '';
            task.subtasks.forEach(subtask => {
                const subtaskElement = document.createElement('li');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = subtask;
                subtaskElement.appendChild(checkbox);
                subtaskElement.appendChild(document.createTextNode(subtask));
                allTaskInformationSubtasks.appendChild(subtaskElement);
                subtaskElement.style.listStyleType = 'none'; // Remove bullet points
            });
        }
        

        // Füge einen Event Listener für den Klick auf die Aufgabenkarte hinzu
        card.addEventListener('click', function() {
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
    function updateTaskInLocalStorage(taskId, newStatus) {
        // Finde den Index der Aufgabe in der tasks-Liste basierend auf der taskId
        let taskIndex = tasks.findIndex((task) => task.id === taskId);
        // Falls die Aufgabe gefunden wurde

        if (taskIndex !== -1) {
            // Aktualisiere den Status der Aufgabe
            tasks[taskIndex].status = newStatus;

            // Speichere die aktualisierte Liste der Aufgaben im Local Storage
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    }

});

function closeAllTaskInformation() {
    const allTaskInformation = document.getElementById('allTaskInformation');
    allTaskInformation.style.display = 'none';
}

function deleteTask() {
    const allTaskInformation = document.getElementById('allTaskInformation');
    const taskId = allTaskInformation.dataset.taskId; // Hole die gespeicherte ID der Aufgabe
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskIndex = tasks.findIndex(task => task.id === taskId); // Finde die Aufgabe basierend auf der ID
    if (taskIndex !== -1) { // Wenn die Aufgabe gefunden wurde
        const taskCard = document.getElementById(tasks[taskIndex].id);
        if (taskCard) {
            taskCard.remove(); // Entferne die Karte der Aufgabe aus dem DOM
            tasks.splice(taskIndex, 1); // Entferne die Aufgabe aus der Liste
            localStorage.setItem("tasks", JSON.stringify(tasks)); // Speichere die aktualisierte Liste der Aufgaben
        }
    }
    closeAllTaskInformation(); // Schließe den "All Task Information"-Bereich
}





function closeEditor(){
    const editTaskInformation = document.getElementById('taskEditorModal');
    const allTaskInformation = document.getElementById('allTaskInformation');
    editTaskInformation.style.display = 'none';
    allTaskInformation.style.display = 'block';
};

const editTaskButton = document.getElementById('editTaskButton');

document.getElementById('editTaskButton').addEventListener('click', function() {
    const allTaskInformation = document.getElementById('allTaskInformation');
    const taskEditorModal = document.getElementById('taskEditorModal');
    allTaskInformation.style.display = 'none';
    taskEditorModal.style.display = 'block';

    const taskId = allTaskInformation.dataset.taskId;
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const task = tasks.find(task => task.id === taskId);

    if (task) {
        document.getElementById('editTitle').value = task.title;
        document.getElementById('editDescription').value = task.description;
        document.getElementById('editDueDate').value = task.taskDate;

        // Setze die Priorität in der Bearbeitungsansicht entsprechend der Aufgabe
        const prioritySelect = document.getElementById('editPriority');
        // Korrigiere die Annahme über die Werte der Optionen im Select-Element
        prioritySelect.value = task.priority; // Vorausgesetzt die Werte sind 'Low', 'Medium', 'High'

        // Dropdown mit Kontakten dynamisch befüllen
        const dropdownEdit = document.getElementById('dropDownContactsEdit');
        dropdownEdit.innerHTML = ''; // Vorhandene Inhalte löschen
        contacts.forEach(contact => {
            const isChecked = task.assignedContacts.includes(contact.userID);
            const checkboxId = `contact-edit-${contact.userID}`;
            const div = document.createElement('div');
            div.className = 'checkbox-container';
            div.innerHTML = `
                <input type="checkbox" id="${checkboxId}" name="assignedContactsEdit" value="${contact.userID}" ${isChecked ? 'checked' : ''}>
                <label for="${checkboxId}">${contact.name}</label>
            `;
            dropdownEdit.appendChild(div);
        });

        // Öffnen/Schließen des Dropdowns mit korrektem Event Handling
        const openDropdownEdit = document.getElementById('openDropdownEdit');
        openDropdownEdit.addEventListener('click', function(event) {
            event.stopPropagation(); // Verhindere, dass das Klick-Event weiter nach oben im DOM propagiert wird
            dropdownEdit.style.display = dropdownEdit.style.display === 'block' ? 'none' : 'block';
        });

        // Verhindern, dass das Dropdown schließt, wenn innerhalb des Dropdowns geklickt wird
        dropdownEdit.addEventListener('click', function(event) {
            event.stopPropagation();
        });

        // Füge einen globalen Event Listener hinzu, um das Dropdown zu schließen, wenn außerhalb geklickt wird
        document.addEventListener('click', function(event) {
            if (dropdownEdit.style.display === 'block' && !event.target.matches('#openDropdownEdit')) {
                dropdownEdit.style.display = 'none';
            }
        });
    }
});

// Entferne den direkten onclick-Handler von openDropdownEdit, da ein Event Listener hinzugefügt wurde


// Annahme, openDropdownEdit ist der Pfeil/das Icon, mit dem das Dropdown geöffnet und geschlossen wird.
const openDropdownEdit = document.getElementById('openDropdownEdit');
const dropdownEdit = document.getElementById('dropDownContactsEdit');

openDropdownEdit.addEventListener('click', function(event) {
    const isDropdownOpen = dropdownEdit.style.display === 'block';
    dropdownEdit.style.display = isDropdownOpen ? 'none' : 'block';

    // Verhindert, dass das Klick-Event weiter nach oben im DOM propagiert wird
    event.stopPropagation();
});

// Verhindere, dass das Dropdown schließt, wenn innerhalb des Dropdowns geklickt wird
dropdownEdit.addEventListener('click', function(event) {
    event.stopPropagation();
});

document.getElementById('saveEdit').addEventListener('click', function() {
    const taskId = allTaskInformation.dataset.taskId;
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    

    if(taskIndex !== -1) {
        // Aktualisiere die Task im Array
        tasks[taskIndex].title = document.getElementById('editTitle').value;
        tasks[taskIndex].description = document.getElementById('editDescription').value;
        tasks[taskIndex].taskDate = document.getElementById('editDueDate').value;
        tasks[taskIndex].priority = document.getElementById('editPriority').value;
        tasks[taskIndex].assignedContacts = Array.from(document.querySelectorAll('#dropDownContactsEdit input[type="checkbox"]:checked')).map(el => el.value);

        localStorage.setItem('tasks', JSON.stringify(tasks)); // Speichern des aktualisierten Arrays im Local Storage

        closeEditor(); // Schließen des Editors
        // Füge hier eventuell Code hinzu, um die Anzeige zu aktualisieren
    } else {
        alert('Aufgabe nicht gefunden.');
    }
});


const boardAddTaskButton = document.getElementById('boardAddTaskButton');
const boardAddTask = document.getElementById('boardAddTask');

boardAddTaskButton.addEventListener('click', function() {
    boardAddTask.style.display = 'block';
});

const boardAddTaskCloseButton = document.getElementById('boardAddTaskCloseButton');

boardAddTaskCloseButton.addEventListener('click', function() {
    boardAddTask.style.display = 'none';
});

function searchTasks() {
    const searchValue = document.getElementById("boardSearchbar").value.toLowerCase();
    const taskCards = document.querySelectorAll(".task-card");

    taskCards.forEach((card) => {
        const title = card.querySelector(".task-card-title").textContent.toLowerCase();
        const description = card.querySelector(".task-card-description").textContent.toLowerCase();

        if (title.includes(searchValue) || description.includes(searchValue)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

document.getElementById("boardSearchbar").addEventListener("input", searchTasks);
