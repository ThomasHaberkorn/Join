document.addEventListener('DOMContentLoaded', function () {
    const taskColumns = document.querySelectorAll('.task-column');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Sortiere die Tasks entsprechend ihres Status und füge sie in die entsprechenden Spalten ein
    tasks.forEach(task => {
        // Überprüfen, ob das Element für den Status existiert, um Fehler zu vermeiden
        if (document.getElementById(task.status)) {
            let taskCard = createTaskCard(task);
            document.getElementById(task.status).appendChild(taskCard);
        }
    });

    function createTaskCard(task) {
        let card = document.createElement('article');
        card.className = 'task-card';
        card.id = task.id || 'task-' + Math.random().toString(36).substr(2, 9); // Nutze vorhandene ID oder generiere eine neue
        card.setAttribute('draggable', true);
        card.dataset.status = task.status;
    
        // Bestimme die Klasse basierend auf der Kategorie
        let categoryClass = task.category === 'Technical Task' ? 'category-technical' : 'category-userstory';
    
        // Erstelle das Div für die Kategorie und wende die Klasse an
        let categoryDiv = `<div class="${categoryClass}">${task.category}</div>`;
    
        // Erstellen eines Strings für alle Subtasks
        let subtasksHtml = '<ul class="task-card-subtasks">';
        task.subtasks.forEach(subtask => {
            subtasksHtml += `<li>${subtask}</li>`;
        });
        subtasksHtml += '</ul>';
    
        // Integrieren aller Task-Details einschließlich Datum, Priorität, Kategorie und Subtasks
        card.innerHTML = `
            <div class="task-card-header">${categoryDiv}</div>
            <div class="task-card-title">${task.title}</div>
            <div class="task-card-description">${task.description}</div>
            ${subtasksHtml}
            <div>Applied to ...</div>
        `;
    
        card.addEventListener('dragstart', handleDragStart);
        return card;
    }
    


    taskColumns.forEach(column => {
        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('drop', handleDrop);
    });

    function handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
    }

    function handleDragOver(e) {
        e.preventDefault(); // Erlaubt das Droppen von Elementen
    }

    function handleDrop(e) {
        e.preventDefault();
        const id = e.dataTransfer.getData('text');
        const draggableElement = document.getElementById(id);
        const newStatus = e.target.closest('.task-column').id;
        draggableElement.dataset.status = newStatus; // Aktualisiere den Status des Tasks

        e.target.closest('.task-column').appendChild(draggableElement);
        updateTaskInLocalStorage(id, newStatus);
    }

    function updateTaskInLocalStorage(taskId, newStatus) {
        // Finde den Task im Array und aktualisiere seinen Status
        let taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].status = newStatus;
            localStorage.setItem('tasks', JSON.stringify(tasks)); // Speichere die aktualisierte Task-Liste im LocalStorage
        }
    }
});
