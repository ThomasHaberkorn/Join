/**
 * Updates the selected button based on the given priority.
 * @param {string} selectedPriority - The selected priority ("Urgent", "Medium", or "Low").
 */
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

/**
 * Configures event listeners on priority buttons to set the task's priority level.
 * This function attaches click event handlers to buttons for setting priorities to 'Urgent', 'Medium', or 'Low'.
 */
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

/**
 * Resets the image of a button based on its priority.
 * @param {HTMLElement} button - The button element to reset the image for.
 */
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

/**
 * Sets up event listeners once the DOM is fully loaded. Adds a click event listener to the subtask addition button
 * and a keydown event listener to the subtask input field to handle new subtask entries.
 * - On click or pressing Enter (key code 13), the subtask is added if the input is not empty.
 */
document.addEventListener("DOMContentLoaded", function () {
    subtaskAddButton.addEventListener("click", addSubtaskIfNotEmpty);
    subtaskInput.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            addSubtaskIfNotEmpty();
        }
    });
    function addSubtaskIfNotEmpty() {
        let subtaskValue = subtaskInput.value.trim();
        if (subtaskValue) {
            addSubtask(subtaskValue);
            subtaskInput.value = "";
        }
    }
});

/**
 * Resets the buttons and their classes for priority selection.
 */
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
