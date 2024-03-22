document.addEventListener('DOMContentLoaded', function() {
    var taskBoard = document.getElementById('taskBoard');
    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(function(task) {
        var taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.innerHTML = `
            <h2>${task.title}</h2>
            <p>${task.description}</p>
            <p>Due Date: ${task.taskDate}</p>
            <p>Category: ${task.category}</p>
        `;
        taskBoard.appendChild(taskElement);
    });
});
