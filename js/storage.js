const STORAGE_TOKEN = "6CELMFVRMQZMVRMEZ8Z0UL3PAVRGV32GFIXMZ85D";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

async function setItem(key, value) {
    const payload = {key, value, token: STORAGE_TOKEN};
    return fetch(STORAGE_URL, {
        method: "POST",
        body: JSON.stringify(payload),
    }).then((res) => res.json());
}

async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return await fetch(url)
        .then((res) => res.json())
        .then((res) => res.data);
}

// async function getItem(key) {
//     const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
//     let respone = await fetch(url);
//     console.log("response", respone);
//     let usersResp = await respone.json();
//     console.log("CP", usersResp);
//     users = usersResp["data"];
//     console.log("users", users);
// }

// const keys = ["user", "tasks", "RememberUser", "contacts"];

// async function init() {
//     try {
//         // Für jeden benötigten Schlüssel prüfen, ob er vorhanden ist
//         for (const key of requiredKeys) {
//             const keyExists = await checkKeyExists(key);
//             // Wenn der Schlüssel nicht existiert, initialisieren Sie ihn mit einem Standardwert
//             if (!keyExists) {
//                 await setItem(key, ""); // Setzen Sie den Schlüssel mit einem leeren Wert
//             }
//         }

//         // Laden oder Initialisieren anderer erforderlicher Daten...

//         // Benutzerdaten abrufen
//         const userData = await getItem("user");
//         users = userData || [];

//         // Weitere Initialisierungsschritte...
//     } catch (error) {
//         console.error("Fehler beim Laden der Daten:", error.message);
//         // Behandeln Sie den Fehler angemessen...
//     }
// }

// async function checkKeysExist() {
//     try {
//         // Initialisieren Sie ein leeres Objekt, um die Ergebnisse zu speichern
//         const keyExistenceMap = {};

//         // Für jeden Schlüssel in der Liste überprüfen, ob er vorhanden ist
//         for (const key of keys) {
//             const keyExists = await checkKeyExists(key);
//             // Das Ergebnis für jeden Schlüssel im keyExistenceMap-Objekt speichern
//             keyExistenceMap[key] = keyExists;
//         }

//         // Die keyExistenceMap zurückgeben, die angibt, ob die Schlüssel vorhanden sind oder nicht
//         return keyExistenceMap;
//     } catch (error) {
//         console.error("Fehler beim Überprüfen der Schlüssel:", error.message);
//         // Im Fehlerfall null zurückgeben oder den Fehler weiterleiten
//         throw error;
//     }
// }

async function getItemAsJson(key) {
    let response = await getItem(key);
    // if (response) return JSON.parse(response);
    // return undefined;
    console.log(response);
}

async function setItemFromJson(key, value) {
    return await setItem(key, JSON.stringify(value));
}
