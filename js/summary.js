async function initSummary() {
    await includeHTML();
    setDaytime();
    getUserName();
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
        document.getElementById("nameBox").textContent = "Guastuser";
    }
}
// {
/* <script>
    // Abrufen des Namens aus dem Session Storage const userName =
    sessionStorage.getItem("userName"); // Einfügen des Namens in den
    HTML-Inhalt document.getElementById("userName").textContent = userName;
</script>; */
// }
