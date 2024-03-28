// Warte, bis das gesamte HTML-Dokument vollständig geladen ist, bevor der Code ausgeführt wird
document.addEventListener('DOMContentLoaded', function () {

    // Erfasse alle Spalten für Aufgaben aus dem HTML-Dokument und speichere sie in der Variable taskColumns
    const taskColumns = document.querySelectorAll('.task-column');

    // Lade die Liste der Aufgaben aus dem Local Storage, falls vorhanden, andernfalls setze tasks auf ein leeres Array
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Eine Funktion, die die Initialen der zugewiesenen Kontakte basierend auf deren IDs zurückgibt
    function getAssignedContactInitials(assignedContactIds) {
        // Die Funktion erhält als Parameter ein Array von zugewiesenen Kontakt-IDs

        // Die map() Methode wird auf das Array der zugewiesenen Kontakt-IDs angewendet,
        // um ein neues Array zu erstellen, das die Initialen der Kontakte enthält
        return assignedContactIds.map(contactId => {
            // Für jede Kontakt-ID wird eine Funktion ausgeführt, die die Initialen berechnet

            // Suche den Kontakt in der Kontaktliste anhand seiner ID
            const contact = contacts.find(contact => contact.userID === contactId);
            // Die find() Methode wird verwendet, um den Kontakt mit der aktuellen Kontakt-ID zu finden

            // Überprüfe, ob der Kontakt gefunden wurde und einen Namen hat
            if (contact && contact.name) {
                // Wenn ein Kontakt mit der angegebenen ID gefunden wurde und einen Namen hat

                // Erstelle die Initialen des Kontakts
                const initials = contact.name.split(' ')
                    .filter(namePart => namePart.length > 0) // Entferne leere Teile des Namens
                    .map(namePart => namePart[0].toUpperCase()) // Wähle den ersten Buchstaben jedes Namens und wandele ihn in Großbuchstaben um
                    .join(''); // Verbinde die Initialen zu einem einzigen String
                return initials; // Gib die Initialen des Kontakts zurück
            } else {
                return '??'; // Wenn der Kontakt nicht gefunden wurde oder keinen Namen hat, gib '??' zurück
            }
        }).join(', '); // Verbinde die Initialen aller gefundenen Kontakte zu einem einzigen String und gib sie zurück
    }


    // Eine Funktion, die eine Karte für eine Aufgabe erstellt, basierend auf den Aufgabeninformationen
    function createTaskCard(task) {
        // Erstelle ein neues Artikel-Element für die Aufgabenkarte
        let card = document.createElement('article');
        card.className = 'task-card';
        // Setze die ID der Karte auf die ID der Aufgabe oder eine zufällig generierte ID
        card.id = task.id || 'task-' + Math.random().toString(36).substr(2, 9);
        card.setAttribute('draggable', true);
        card.dataset.status = task.status;

        // Bestimme die CSS-Klasse basierend auf der Kategorie der Aufgabe
        let categoryClass = task.category === 'Technical Task' ? 'category-technical' : 'category-userstory';
        let categoryDiv = `<div class="${categoryClass}">${task.category}</div>`;

        // Erstelle HTML für die Subtask-Liste
        let subtasksHtml = '<ul class="task-card-subtasks">';
        task.subtasks.forEach(subtask => {
            subtasksHtml += `<li>${subtask}</li>`;
        });
        subtasksHtml += '</ul>';

        // Erfasse die Initialen der zugewiesenen Kontakte
        const assignedContactInitials = getAssignedContactInitials(task.assignedContacts);

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

        // Füge einen Event Listener für den Drag-and-Drop-Vorgang hinzu
        card.addEventListener('dragstart', handleDragStart);
        
        function openAllTaskInformation(task) {
            const allTaskInformation = document.getElementById('allTaskInformation');
            allTaskInformation.style.display = 'block';

            // Setzen Sie den Titel in das allTaskInformationTitle-Element
            const allTaskInformationTitle = document.getElementById('allTaskInformationTitle');
            allTaskInformationTitle.textContent = task.title;

            // Setzen Sie die Beschreibung in das allTaskInformationDescription-Element
            const allTaskInformationDescription = document.getElementById('allTaskInformationDescription');
            allTaskInformationDescription.textContent = task.description;

            // Setzen Sie die Priorität in das allTaskInformationPriority-Element
            const allTaskInformationPriority = document.getElementById('allTaskInformationPriority');
            allTaskInformationPriority.textContent = task.priority;

            // Setzen Sie das Fälligkeitsdatum in das allTaskInformationDueDate-Element
            const allTaskInformationDueDate = document.getElementById('allTaskInformationDueDate');
            allTaskInformationDueDate.textContent = task.taskDate;

            // Setzen Sie die zugewiesene Person in das allTaskInformationAssignedTo-Element
            const allTaskInformationAssignedTo = document.getElementById('allTaskInformationAssignedTo');
            allTaskInformationAssignedTo.textContent = assignedContactInitials;

            // Setzen Sie die Kategorie in das allTaskInformationCategory-Element
            const allTaskInformationCategory = document.getElementById('allTaskInformationCategory');
            allTaskInformationCategory.textContent = task.category;

            // Setzen Sie den Status in das allTaskInformationStatus-Element
            const allTaskInformationStatus = document.getElementById('allTaskInformationStatus');
            allTaskInformationStatus.textContent = task.status;

            // Setzen Sie die Subtasks in das allTaskInformationSubtasks-Element
            const allTaskInformationSubtasks = document.getElementById('allTaskInformationSubtasks');
            allTaskInformationSubtasks.innerHTML = '';
            task.subtasks.forEach(subtask => {
            const subtaskElement = document.createElement('li');
            subtaskElement.textContent = subtask;
            allTaskInformationSubtasks.appendChild(subtaskElement);
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
    tasks.forEach(task => {
        if (document.getElementById(task.status)) {
            let taskCard = createTaskCard(task);
            document.getElementById(task.status).appendChild(taskCard);
        }
    });

    // Eine Funktion, die die Anzeige der Spalten aktualisiert, um anzuzeigen, ob sie Aufgaben enthalten oder nicht
    function updateTaskColumns() {
        document.querySelectorAll('.task-column').forEach(column => {
            const hasTasks = Array.from(column.children).some(child => child.classList.contains('task-card'));
            const hasNoTaskMessage = !!column.querySelector('.no-task-message');

            if (!hasTasks && !hasNoTaskMessage) {
                let noTaskMessage = document.createElement('div');
                noTaskMessage.className = 'no-task-message';
                noTaskMessage.textContent = 'No task available';
                column.appendChild(noTaskMessage);
            } else if (hasTasks && hasNoTaskMessage) {
                let noTaskMessage = column.querySelector('.no-task-message');
                column.removeChild(noTaskMessage);
            }
        });
    }

    // Aktualisiere die Anzeige der Spalten
    updateTaskColumns();

    // Füge Event Listener für Drag-and-Drop-Operationen zu den Spalten hinzu
    taskColumns.forEach(column => {
        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('drop', handleDrop);
    });

    // Eine Funktion, die aufgerufen wird, wenn ein Drag-and-Drop-Vorgang gestartet wird
    function handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
    }

    // Eine Funktion, die aufgerufen wird, wenn eine Element über eine Drop-Zone bewegt wird
    function handleDragOver(e) {
        e.preventDefault();
    }

    // Eine Funktion, die aufgerufen wird, wenn ein Element in eine Drop-Zone gezogen wird
    function handleDrop(e) {
        e.preventDefault();
        const id = e.dataTransfer.getData('text');
        const draggableElement = document.getElementById(id);
        const newStatus = e.target.closest('.task-column').id;
        draggableElement.dataset.status = newStatus;

        e.target.closest('.task-column').appendChild(draggableElement);
        updateTaskInLocalStorage(id, newStatus);
        updateTaskColumns();
    }

    // Eine Funktion, die den Status einer Aufgabe im Local Storage aktualisiert
    function updateTaskInLocalStorage(taskId, newStatus) {
        // Finde den Index der Aufgabe in der tasks-Liste basierend auf der taskId
        let taskIndex = tasks.findIndex(task => task.id === taskId);
        // Falls die Aufgabe gefunden wurde
        if (taskIndex !== -1) {
            // Aktualisiere den Status der Aufgabe
            tasks[taskIndex].status = newStatus;
            // Speichere die aktualisierte Liste der Aufgaben im Local Storage
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

});

function closeAllTaskInformation() {
    const allTaskInformation = document.getElementById('allTaskInformation');
    allTaskInformation.style.display = 'none';
}