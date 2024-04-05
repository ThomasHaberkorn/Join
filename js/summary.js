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
let urgendTask = 0;

// async function getTasksAndProcess() {
//     await getTask();

//     for (i = 0; i < task.length; i++) {
//         const cat = task[i];
//         let status = cat["status"];
//         if (status == "todo") {
//             todo++;
//         } else if (status == "inProgress") {
//             inProgress++;
//         } else if (status == "awaitFeedback") {
//             awaitFeedback++;
//         } else if (status == "done") {
//             done++;
//         }
//     }
//     // getUrgendTask(task);
//     // dates.push(task);
//     getEarliestDate();
//     console.log("h1", task);
//     taskInBoard = todo + inProgress + awaitFeedback + done;

//     document.getElementById("summaryTodoInfoCounter").innerHTML = todo;
//     document.getElementById("summaryDoneInfoCounter").innerHTML = done;
//     document.getElementById("tasksInBoardNum").innerHTML = taskInBoard;
//     document.getElementById("taskInProgressNum").innerHTML = inProgress;
//     document.getElementById("awaitingFeedbackNum").innerHTML = awaitFeedback;
// }

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

let dates = [];

// function getUrgendTask() {
//     const urgendDates = task
//         .filter((t) => t.priority === "high")
//         .map((t) => t.taskDate)
//         .sort((a, b) => {
//             if (a instanceof Date && b instanceof Date) {
//                 return a.getTime() - b.getTime();
//             }
//         });
//     return urgendDates;
// }

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

// function getEarliestDate(tasks) {
//     const urgentTasks = tasks.filter((t) => t.priority === "high");
//     if (urgentTasks.length > 0) {
//         const earliestDate = new Date(
//             Math.min(...urgentTasks.map((t) => new Date(t)))
//         );
//         return earliestDate;
//     }
//     return null;
// }
// function getUrgendTask() {
//     const urgendDates = task
//         .filter((t) => t.priority === "high")
//         .map((t) => t.taskDate)
//         .sort((a, b) => {
//             if (a instanceof Date && b instanceof Date) {
//                 return a.getTime() - b.getTime();
//             }
//         });
//     return urgendDates;
// }

// function getUrgendTask(tasks) {
//     const urgendDates = tasks
//         .filter((t) => t.priority === "high")
//         .map((t) => t.taskDate)
//         .sort((a, b) => {
//             if (a instanceof Date && b instanceof Date) {
//                 return a.getTime() - b.getTime();
//             }
//         });
//     console.log("Gefilterte und sortierte dringende Aufgaben:", urgendDates);
//     return urgendDates;
// }

// function getUrgendTask(tasks) {
//     const urgendDates = tasks
//         .filter((t) => t.priority === "high")
//         .map((t) => t.taskDate)
//         .sort((a, b) => {
//             if (a instanceof Date && b instanceof Date) {
//                 const yearDiff = a.getFullYear() - b.getFullYear();
//                 if (yearDiff === 0) {
//                     const monthDiff = a.getMonth() - b.getMonth();
//                     if (monthDiff === 0) {
//                         return a.getDate() - b.getDate();
//                     }
//                     return monthDiff;
//                 }
//                 return yearDiff;
//             }
//         });
//     console.log("Gefilterte und sortierte dringende Aufgaben:", urgendDates);
//     return urgendDates;
// }

// function getUrgendTask() {
//     for (let i = 0; i < task.length; i++) {
//         const uTask = task[i];
//         if (uTask["priority"] == "high") {
//             urgendTask++;
//             dates.push(uTask["taskDate"]);
//         }
//     }
//     sortUrgendDates();
//     console.log("dates", dates);
// }
// // let getDates = [];

// function sortUrgendDates() {
//     dates.sort(function (a, b) {
//         return a.getTime() - b.getTime();
//     });
//     // console.log("gugu", getDates);
// }

async function getTask() {
    task = JSON.parse(localStorage.getItem("tasks"));
}

function summaryActive() {
    document.getElementById("sumSidebar").classList.add("bgfocus");
}

const mediaQuery = window.matchMedia("(max-width: 1050px)");
// const mediaQuery1051 = window.matchMedia("(max-widht: 1050px)");

function showWelcome() {
    const welcomeContainer = document.getElementById("summaryWelcomeContainer");
    const infoContainer = document.getElementById("summaryInfoContainer");
    const storage = sessionStorage.getItem("showWelcome");
    // if (mediaQuery1051.matches) {
    //     welcomeContainer.classList.add("d-none");
    // }
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
