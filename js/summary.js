async function initSummary() {
    await includeW3();
    setDaytime();
    getUserName();
    getTasksAndProcess();
    summaryActive();
}

function setDaytime() {
    document.getElementById("summaryWelcomeDaytimeContainer").innerHTML =
        getDaytime();
}

function getDaytime() {
    a = new Date();
    b = a.getHours();
    c = a.getMinutes();
    d = a.getSeconds();
    day = a.getDate();
    month = a.getMonth();
    year = a.getYear();
    if (b < 10) {
        b = "0" + b;
    }
    if (c < 10) {
        c = "0" + c;
    }
    if (d < 10) {
        d = "0" + d;
    }

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

    taskInBoard = todo + inProgress + awaitFeedback + done;

    document.getElementById("summaryTodoInfoCounter").innerHTML = todo;
    document.getElementById("summaryDoneInfoCounter").innerHTML = done;
    document.getElementById("tasksInBoardNum").innerHTML = taskInBoard;
    document.getElementById("taskInProgressNum").innerHTML = inProgress;
    document.getElementById("awaitingFeedbackNum").innerHTML = awaitFeedback;
}

async function getTask() {
    task = JSON.parse(localStorage.getItem("tasks"));
}

function summaryActive() {
    document.getElementById("sumSidebar").classList.add("bgfocus");
}
