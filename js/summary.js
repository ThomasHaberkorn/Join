async function initSum() {
    await includeHTML();
    setDaytime();
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
    } else if (b > 11 && b < 18) {
        return "Welcome";
    } else if (b >= 18 && b < 24) {
        return "Good evening";
    }
}
