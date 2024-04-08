async function initSummary() {
    await includeW3();
    await getTasksAndProcess();
    setDaytime();
    getUserName();
    summaryActive();
    showWelcome();
    setStorageSession();
    showInitials();
    checkLoggedUser();
}

/**
 * Sets "showWelcome" to "true" in the session storage to prevent the WelcomeScreen from being
 * displayed again during this session
 */

function setStorageSession() {
    sessionStorage.setItem("showWelcome", "true");
}

/**
 * Initializes getDaytime and displays the time of day
 */

function setDaytime() {
    document.getElementById("summaryWelcomeDaytimeContainer").innerHTML =
        getDaytime();
}

/**
 *
 * @returns the daytime greeting
 */

function getDaytime() {
    a = new Date();
    b = a.getHours();
    if (b >= 0 && b < 11) {
        return "Good morning";
    } else if (b >= 11 && b < 18) {
        return "Welcome";
    } else if (b >= 18 && b < 24) {
        return "Good evening";
    }
}

/**
 * get the Username from the session storage and display it in the wlcome message
 */

function getUserName() {
    let userName = sessionStorage.getItem("userName");
    if (userName) {
        // Split the username into an array of names
        let names = userName.split(" ");
        // If there are more than two names, take only the first two
        if (names.length > 2) {
            userName = names.slice(0, 2).join(" ");
        }
        document.getElementById("nameBox").innerHTML = userName;
    } else {
        document.getElementById("nameBox").textContent = "Guest";
    }
}

/**
 * allocate the tasks to the respective categories
 */
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
    countTasks();
    getUrgendTask(task);
    dates.push(task);
    taskInBoard = todo + inProgress + awaitFeedback + done;
    allocateTasks();
    const earliestDate = getEarliestDate(task);
    allocateEarliestDate(earliestDate);
}

/**
 * allocate the earliest date of the urgent task
 */

function allocateEarliestDate(earliestDate) {
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

/**
 * allocate the tasks to the respective categories
 */
function allocateTasks() {
    document.getElementById("summaryTodoInfoCounter").innerHTML = todo;
    document.getElementById("summaryDoneInfoCounter").innerHTML = done;
    document.getElementById("tasksInBoardNum").innerHTML = taskInBoard;
    document.getElementById("taskInProgressNum").innerHTML = inProgress;
    document.getElementById("awaitingFeedbackNum").innerHTML = awaitFeedback;
}

/**
 * count the tasks in the respective categories
 */
function countTasks() {
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
}

/**
 * count the urgent tasks from the task array
 */
function getUrgendTask(task) {
    const taskCount = task.filter((t) => t.priority === "Urgent");
    document.getElementById("summaryUrgentTaskCount").innerHTML =
        taskCount.length;
}

/**
 * check valid date and return the earliest date of the urgent tasks
 */
function getEarliestDate(tasks) {
    const urgentTasks = tasks.filter((t) => t.priority === "Urgent");
    if (urgentTasks.length > 0) {
        const earliestDate = new Date(
            Math.min(
                ...urgentTasks.map((t) => {
                    // Check whether taskDate is in the correct format
                    const taskDate = new Date(t.taskDate);
                    // Check whether taskDate is a valid date
                    if (
                        Object.prototype.toString.call(taskDate) ===
                            "[object Date]" &&
                        !isNaN(taskDate)
                    ) {
                        return taskDate;
                    } else {
                        console.error("Ungültiges Datum gefunden:", t.taskDate);
                        return NaN;
                    }
                })
            )
        );
        return earliestDate;
    }
    return null;
}

/**
 * get the tasks from the local storage and filter the tasks based on the user level
 * currently only for the summary.html and the display of the number of tasks in its respective categories
 */

async function getTask() {
    const userLevel = sessionStorage.getItem("userLevel");
    let taskTemp = JSON.parse(localStorage.getItem("tasks"));
    if (userLevel === "user") {
        const userTasks = taskTemp.filter((t) => t.userLevel === "user");
        task = userTasks;
    } else {
        const userTasks = taskTemp.filter((t) => t.userLevel === "guest");
        task = userTasks;
    }
}

/**
 * highlight the summary link in the sidebar
 */
function summaryActive() {
    document.getElementById("sumSidebar").classList.add("bgfocus");
}

/**
 * show the weclome message and hide it at less than 1050px width
 * at screen width less than 1050px the welcome message will be shown for 2 seconds and then hidden
 */
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
