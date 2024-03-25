document.addEventListener('DOMContentLoaded', function() {
    var createBtn = document.getElementById('create-btn');
    var urgentBtn = document.getElementById('urgentBtn');
    var mediumBtn = document.getElementById('mediumBtn');
    var lowBtn = document.getElementById('lowBtn');
    var subtaskInput = document.getElementById('subtask');
    var subtaskAddButton = document.getElementById('subtask-img'); // Angenommen, dies ist ein Button
    var subtaskList = document.getElementById('list'); // Die UL für Subtasks

    var priorityButtons = { Urgent: urgentBtn, Medium: mediumBtn, Low: lowBtn };
    var priority = ''; // Variable für die Priorität
    var subtasks = []; // Array für die Subtasks

    // Funktion zum Setzen der Priorität und visuellen Markierung
    function setPriority(selectedPriority) {
        priority = selectedPriority;
        Object.values(priorityButtons).forEach(button => {
            button.classList.remove('selected-priority');
        });
        priorityButtons[selectedPriority].classList.add('selected-priority');
    }

    // Event Listener für Prioritätsbuttons
    urgentBtn.addEventListener('click', function() { setPriority('Urgent'); });
    mediumBtn.addEventListener('click', function() { setPriority('Medium'); });
    lowBtn.addEventListener('click', function() { setPriority('Low'); });

    // Funktion zum Hinzufügen von Subtasks zur Liste und Anzeigen
    function addSubtask(subtask) {
        let index = subtasks.length;
        subtasks.push(subtask);
        let li = document.createElement('li');
        li.innerHTML = `${subtask} <button class="delete-subtask" data-index="${index}">Löschen</button>`;
        subtaskList.appendChild(li);

        // Event Listener für den Löschbutton jedes Subtasks
        li.querySelector('.delete-subtask').addEventListener('click', function() {
            removeSubtask(index);
        });
    }

    // Funktion zum Entfernen eines Subtasks
    function removeSubtask(index) {
        subtasks.splice(index, 1); // Entfernt den Subtask aus dem Array
        updateSubtaskList(); // Aktualisiert die Anzeige
    }

    // Funktion zum Aktualisieren der Subtask-Liste in der UI
    function updateSubtaskList() {
        subtaskList.innerHTML = ''; // Löscht die aktuelle Liste
        subtasks.forEach((subtask, index) => {
            addSubtask(subtask, index); // Fügt jeden Subtask neu hinzu
        });
    }

    // Event Listener für das Hinzufügen von Subtasks
    subtaskAddButton.addEventListener('click', function() {
        var subtaskValue = subtaskInput.value.trim();
        if(subtaskValue) {
            addSubtask(subtaskValue);
            subtaskInput.value = ''; // Eingabefeld leeren
        }
    });

    createBtn.addEventListener('click', function(event) {
        handleCreateTask(event);
    });

    function handleCreateTask(event) {
        event.preventDefault(); // Verhindert das Standardverhalten des Buttons im Formular
    
        var title = document.getElementById('titleInput').value;
        var description = document.getElementById('descriptionInput').value;
        var taskDate = document.getElementById('taskDate').value;
        var category = document.getElementById('category').value;
        var status = 'todo'; // Fügen Sie einen Standardstatus hinzu
    
        // Speichern der Aufgabendetails im localStorage, inklusive Subtasks, Priorität und Status
        var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ title, description, taskDate, category, priority, subtasks, status });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    
        // Weiterleitung zur board.html Seite
        window.location.href = 'board.html';
    }
    
});
