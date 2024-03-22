document.addEventListener('DOMContentLoaded', function() {
    var taskBoard = document.getElementById('taskBoard');
    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function createTaskCard(task) {
        var card = document.createElement('div');
        card.className = 'task-card';

        var priorityColor = 'blue'; // Setzen Sie hier die Logik für die Prioritätsfarbe
        if (task.priority === 'Urgent') {
            priorityColor = 'red';
        } else if (task.priority === 'Medium') {
            priorityColor = 'yellow';
        } else {
            priorityColor = 'green';
        }

        card.innerHTML = `
            <div class="task-card-header ${priorityColor}">
                <span class="task-card-type">${task.category}</span>
            </div>
            <div class="task-card-body">
                <h3 class="task-card-title">${task.title}</h3>
                <p class="task-card-description">${task.description}</p>
            </div>
            <div class="task-card-footer">
                <div class="task-card-subtasks">${task.subtasks}</div>
                <div class="task-card-due-date">${task.taskDate}</div>
            </div>
        `;
        return card;
    }

    tasks.forEach(function(task) {
        var taskCard = createTaskCard(task);
        taskBoard.appendChild(taskCard);
    });
});
