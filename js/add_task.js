document.addEventListener('DOMContentLoaded', function() {
    var createBtn = document.getElementById('create-btn');
    createBtn.addEventListener('click', function(event) {
        handleCreateTask(event);
    });
});

function handleCreateTask(event) {
    event.preventDefault(); // Verhindert das Standardverhalten des Buttons im Formular

    var title = document.getElementById('titleInput').value;
    var description = document.getElementById('descriptionInput').value;
    var taskDate = document.getElementById('taskDate').value;
    var category = document.getElementById('category').value;

    // Speichern der Aufgabendetails im localStorage
    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ title, description, taskDate, category });
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Weiterleitung zur board.html Seite
    window.location.href = 'board.html';
}
