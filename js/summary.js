async function initSummary() {
    await includeW3();
    setDaytime();
    getUserName();
    getTasksAndProcess();
    summaryActive();
    showWelcome();
    setStorageSession();
    showInitials();
}

function setStorageSession() {
    sessionStorage.setItem("showWelcome", "true");
}

function setDaytime() {
    document.getElementById("summaryWelcomeDaytimeContainer").innerHTML =
        getDaytime();
}

function getDaytime() {
    a = new Date();
    b = a.getHours();

    // if (b < 10) {
    //     b = "0" + b;
    // }

    if (b >= 0 && b < 11) {
        return "Good morning";
    } else if (b >= 11 && b < 18) {
        return "Welcome";
    } else if (b >= 18 && b < 24) {
        return "Good evening";
    }
}

function getUserName() {
    const userName = sessionStorage.getItem("userName");

    if (userName) {
        document.getElementById("nameBox").innerHTML = userName;
    } else {
        document.getElementById("nameBox").textContent = "Guast";
    }
}
// {
/* <script>
    // Abrufen des Namens aus dem Session Storage const userName =
    sessionStorage.getItem("userName"); // Einfügen des Namens in den
    HTML-Inhalt document.getElementById("userName").textContent = userName;
</script>; */
// }
let task;
let todo = 0;
let inProgress = 0;
let awaitFeedback = 0;
let done = 0;
let taskInBoard = 0;
let urgendTask = 0;

let dates = [];

async function getTasksAndProcess() {
    await getTask();

    for (i = 0; i < task.length; i++) {
        const cat = task[i];
        let status = cat["status"];
        if (status == "todo") {
            todo++;
        } else if (status == "inProgress") {
            inProgress++;
        } else if (status == "awaitFeedback") {
            awaitFeedback++;
        } else if (status == "done") {
            done++;
        }
    }
    getUrgendTask(task);
    dates.push(task);
    console.log("dates", dates);
    taskInBoard = todo + inProgress + awaitFeedback + done;

    document.getElementById("summaryTodoInfoCounter").innerHTML = todo;
    document.getElementById("summaryDoneInfoCounter").innerHTML = done;
    document.getElementById("tasksInBoardNum").innerHTML = taskInBoard;
    document.getElementById("taskInProgressNum").innerHTML = inProgress;
    document.getElementById("awaitingFeedbackNum").innerHTML = awaitFeedback;

    // Hier fügen Sie das früheste Datum in ein HTML-Element ein
    const earliestDate = getEarliestDate(task);

    if (earliestDate) {
        const options = {year: "numeric", month: "long", day: "numeric"};
        document.getElementById("summaryUrgentTaskNextDate").innerHTML =
            earliestDate.toLocaleDateString("en-US", options);
        document.getElementById("summaryUrgentTaskInfo").innerHTML =
            "Upcoming Deadline";
    } else {
        document.getElementById("summaryUrgentTaskNextDate").innerHTML =
            "No urgent deadlines";
        document.getElementById("summaryUrgentTaskInfo").innerHTML =
            "Upcoming Deadline";
    }
}

function getUrgendTask(task) {
    const taskCount = task.filter((t) => t.priority === "Urgent");
    document.getElementById("summaryUrgentTaskCount").innerHTML =
        taskCount.length;
}

function getEarliestDate(tasks) {
    const urgentTasks = tasks.filter((t) => t.priority === "Urgent");
    if (urgentTasks.length > 0) {
        const earliestDate = new Date(
            Math.min(
                ...urgentTasks.map((t) => {
                    // Überprüfen, ob taskDate im richtigen Format vorliegt
                    const taskDate = new Date(t.taskDate);
                    // Überprüfen, ob taskDate ein gültiges Datum ist
                    if (
                        Object.prototype.toString.call(taskDate) ===
                            "[object Date]" &&
                        !isNaN(taskDate)
                    ) {
                        return taskDate;
                    } else {
                        console.error("Ungültiges Datum gefunden:", t.taskDate);
                        return NaN; // Oder einen anderen Wert, der darauf hinweist, dass das Datum ungültig ist
                    }
                })
            )
        );
        return earliestDate;
    }
    return null;
}

async function getTask() {
    task = JSON.parse(localStorage.getItem("tasks"));
}

function summaryActive() {
    document.getElementById("sumSidebar").classList.add("bgfocus");
}

const mediaQuery = window.matchMedia("(max-width: 1050px)");

function showWelcome() {
    const welcomeContainer = document.getElementById("summaryWelcomeContainer");
    const infoContainer = document.getElementById("summaryInfoContainer");
    const storage = sessionStorage.getItem("showWelcome");

    if (storage == null || storage == "false") {
        if (mediaQuery.matches) {
            welcomeContainer.classList.remove("d-none");
            infoContainer.classList.add("d-none");
            setTimeout(() => {
                infoContainer.classList.remove("d-none");
                welcomeContainer.classList.add("d-none");
            }, 2000);
        }
    } else {
        infoContainer.classList.remove("d-none");
        welcomeContainer.classList.add("d-none");
    }
}
mediaQuery.addEventListener("change", showWelcome);
