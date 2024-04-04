async function initAddSidebar() {
    await includeW3();
    addTaskActive();
    showInitials();
}
function addTaskActive() {
    document.getElementById("addTasksum").classList.add("bgfocus");
}

// Der gesamte Code wird erst ausgeführt, wenn das gesamte HTML-Dokument geladen ist.
// Dies stellt sicher, dass alle Elemente, auf die wir zugreifen möchten, bereits existieren.
document.addEventListener("DOMContentLoaded", function () {
    // Hier holen wir uns Referenzen auf verschiedene Elemente aus dem HTML-Dokument, die wir später im Code verwenden werden.
    // Mit document.getElementById('id') können wir ein Element mit einer bestimmten ID aus dem HTML-Dokument holen.
    var createBtn = document.getElementById("create-btn"); // Der Button zum Erstellen einer Aufgabe
    var urgentBtn = document.getElementById("urgentBtn"); // Der Button für hohe Priorität
    var mediumBtn = document.getElementById("mediumBtn"); // Der Button für mittlere Priorität
    var lowBtn = document.getElementById("lowBtn"); // Der Button für niedrige Priorität
    var subtaskInput = document.getElementById("subtask"); // Das Eingabefeld für Subtasks
    var subtaskAddButton = document.getElementById("subtask-img"); // Der Button zum Hinzufügen von Subtasks
    var subtaskList = document.getElementById("list"); // Die Liste, in der die Subtasks angezeigt werden
    var openDropdown = document.getElementById("openDropdown"); // Der Button zum Öffnen des Dropdown-Menüs
    // Wir erstellen ein Objekt, das die Prioritätsbuttons gruppiert, um später einfacher auf sie zugreifen zu können.
    var priorityButtons = { Urgent: urgentBtn, Medium: mediumBtn, Low: lowBtn };
    var priority = ""; // Eine Variable, um die ausgewählte Priorität zu speichern
    var subtasks = []; // Ein Array, um die Subtasks zu speichern

    // Diese Funktion füllt das Dropdown-Menü mit Kontakten.
    function fillContactDropdown() {
        const dropdown = document.getElementById("dropDownContacts"); // Das Dropdown-Menü
        // Für jeden Kontakt in der Liste der Kontakte
        contacts.forEach((contact) => {
            // Erstelle ein neues div-Element
            const div = document.createElement("div");
            // Füge HTML in das div-Element ein, das eine Checkbox und ein Label für den Kontakt enthält
            div.innerHTML = `
                <input type="checkbox" class="contact-checkbox" id="contact-${contact.userID}" name="assignedContacts" value="${contact.userID}">
                <label for="contact-${contact.userID}">${contact.name}</label>
            `;
            // Füge das div-Element zum Dropdown-Menü hinzu
            dropdown.appendChild(div);
        });
    }

    // Rufe die Funktion zum Befüllen des Dropdowns auf
    fillContactDropdown();

    // Füge einen Event Listener zum Dropdown-Button hinzu, der das Dropdown-Menü öffnet und schließt
    openDropdown.addEventListener("click", function () {
        var dropdown = document.getElementById("dropDownContacts"); // Das Dropdown-Menü
        // Wenn das Dropdown-Menü geschlossen ist
        if (
            dropdown.style.display === "none" ||
            dropdown.style.display === ""
        ) {
            // Öffne das Dropdown-Menü
            dropdown.style.display = "block";
        } else {
            // Wenn das Dropdown-Menü geöffnet ist
            // Schließe das Dropdown-Menü
            dropdown.style.display = "none";
        }
    });

    // Diese Funktion setzt die ausgewählte Priorität und hebt die entsprechende Schaltfläche hervor
    function setPriority(selectedPriority) {
        // Speichere die ausgewählte Priorität
        priority = selectedPriority;

        // Für jeden Button in der Gruppe der Prioritätsbuttons
        Object.values(priorityButtons).forEach((button) => {
            // Entferne die Hervorhebung
            button.classList.remove("selected-priority");
        });
        // Hebe den ausgewählten Button hervor
        priorityButtons[selectedPriority].classList.add("selected-priority");
    }

    // Füge Event Listener zu den Prioritätsbuttons hinzu, die die setPriority Funktion aufrufen, wenn der Button geklickt wird
    urgentBtn.addEventListener("click", function () {
        setPriority("Urgent");
    });
    mediumBtn.addEventListener("click", function () {
        setPriority("Medium");
    });
    lowBtn.addEventListener("click", function () {
        setPriority("Low");
    });

    // Funktion, um eine neue Subtask zur Liste der Subtasks hinzuzufügen
function addSubtask(subtaskName) {
    // Erstelle ein neues Subtask-Objekt
    let subtask = {
        name: subtaskName,
        completed: false // Initial ist die Subtask nicht abgeschlossen
    };
    // Füge das neue Subtask-Objekt zum Array der Subtasks hinzu
    subtasks.push(subtask);

    // Rufe die Funktion auf, um die Subtask-Liste im UI zu aktualisieren
    // Achtung: Hier nicht die addSubtask-Funktion erneut aufrufen, um Rekursion zu vermeiden
    updateSubtaskList();
}

// Funktion, um die Subtask-Liste im UI basierend auf dem aktuellen Zustand des 'subtasks'-Arrays zu aktualisieren
function updateSubtaskList() {
    // Leere zunächst die Liste im UI, um sie neu aufzubauen
    subtaskList.innerHTML = "";

    // Durchlaufe das Array der Subtasks und erstelle für jede Subtask ein Listenelement im UI
    subtasks.forEach((subtask, index) => {
        let li = document.createElement("li");
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = subtask.completed;
        checkbox.onchange = function() {
            // Aktualisiere den 'completed'-Status der Subtask, wenn die Checkbox geändert wird
            subtasks[index].completed = this.checked;
        };

        let text = document.createTextNode(" " + subtask.name);
        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Löschen";
        deleteButton.onclick = function() {
            // Entferne die Subtask aus dem Array und aktualisiere die Liste, wenn der Löschen-Button geklickt wird
            removeSubtask(index);
        };

        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(deleteButton);
        subtaskList.appendChild(li);
    });
}

// Funktion, um eine Subtask aus der Liste zu entfernen
function removeSubtask(index) {
    // Entferne die Subtask aus dem Array
    subtasks.splice(index, 1);
    // Aktualisiere die Subtask-Liste im UI
    updateSubtaskList();
}


    // Event Listener für das Hinzufügen einer Subtask
    subtaskAddButton.addEventListener("click", function () {
        let subtaskValue = subtaskInput.value.trim();
        if (subtaskValue) {
            addSubtask(subtaskValue); // Füge die Subtask hinzu
            subtaskInput.value = ""; // Leere das Eingabefeld
        }
    });




    // Diese Funktion entfernt eine Subtask aus der Liste der Subtasks
    function removeSubtask(index) {
        // Entferne die Subtask an der gegebenen Position
        subtasks.splice(index, 1);
        // Aktualisiere die Anzeige der Subtask-Liste
        updateSubtaskList();
    }

   // Korrigierte Funktion, um die Subtask-Liste im UI zu aktualisieren
function updateSubtaskList() {
    // Leere zunächst die Liste im UI, um sie neu aufzubauen
    subtaskList.innerHTML = "";

    // Durchlaufe das Array der Subtasks und erstelle für jede Subtask ein Listenelement im UI
    subtasks.forEach((subtask, index) => {
        let li = document.createElement("li");
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = subtask.completed;
        checkbox.onchange = function() {
            // Aktualisiere den 'completed'-Status der Subtask, wenn die Checkbox geändert wird
            subtasks[index].completed = this.checked;
        };

        let text = document.createTextNode(" " + subtask.name);
        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Löschen";
        deleteButton.onclick = function() {
            // Entferne die Subtask aus dem Array und aktualisiere die Liste, wenn der Löschen-Button geklickt wird
            removeSubtask(index);
        };

        li.appendChild(text);
        li.appendChild(deleteButton);
        subtaskList.appendChild(li);
    });
}


    // Füge einen Event Listener zum Subtask-Add-Button hinzu, der eine Subtask hinzufügt, wenn der Button geklickt wird
    subtaskAddButton.addEventListener("click", function () {
        // Der Text der Subtask ist der Inhalt des Subtask-Eingabefelds
        var subtaskValue = subtaskInput.value.trim();
        // Wenn der Text nicht leer ist
        if (subtaskValue) {
            // Füge die Subtask hinzu
            addSubtask(subtaskValue);
            // Leere das Subtask-Eingabefeld
            subtaskInput.value = "";
        }
    });

    // Füge einen Event Listener zum Create-Button hinzu, der eine Aufgabe erstellt, wenn der Button geklickt wird
    createBtn.addEventListener("click", function (event) {
        // Verhindere, dass das Formular abgeschickt wird
        event.preventDefault();
        // Der Titel der Aufgabe ist der Inhalt des Titel-Eingabefelds
        var title = document.getElementById("titleInput").value;
        // Die Beschreibung der Aufgabe ist der Inhalt des Beschreibung-Eingabefelds
        var description = document.getElementById("descriptionInput").value;
        // Das Datum der Aufgabe ist der Inhalt des Datum-Eingabefelds
        var taskDate = document.getElementById("taskDate").value;
        // Die Kategorie der Aufgabe ist der Inhalt des Kategorie-Eingabefelds
        var category = document.getElementById("category").value;
        // Die zugewiesenen Kontakte sind die ausgewählten Kontakte im Dropdown-Menü
        var assignedContacts = [
            ...document.querySelectorAll(".contact-checkbox:checked"),
        ].map((input) => input.value);
        // Der Status der Aufgabe ist 'todo'
        var status = "todo";
        // Die Liste der Aufgaben ist die Liste der Aufgaben im localStorage, oder eine leere Liste, wenn es keine Aufgaben im localStorage gibt
        var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        // Die ID der neuen Aufgabe ist eine zufällig generierte ID
        var newTaskId = "task-" + Math.random().toString(36).substr(2, 9);
        // Füge die neue Aufgabe zur Liste der Aufgaben hinzu

        tasks.push({
            id: newTaskId,
            title,
            description,
            taskDate,
            category,
            priority,
            subtasks,
            status,

            assignedContacts,
        });
        // Speichere die Liste der Aufgaben im localStorage
        localStorage.setItem("tasks", JSON.stringify(tasks));
        // Leite den Benutzer zur board.html Seite um
        window.location.href = "board.html";
    });
});
