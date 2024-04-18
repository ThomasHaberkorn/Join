const STORAGE_TOKEN = "6CELMFVRMQZMVRMEZ8Z0UL3PAVRGV32GFIXMZ85D";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

/**
 * Sets an item in the storage.
 *
 * @param {string} key - The key of the item.
 * @param {any} value - The value of the item.
 * @returns {Promise<any>} - A promise that resolves to the response from the server.
 */
async function setItem(key, value) {
    const payload = {key, value, token: STORAGE_TOKEN};
    return fetch(STORAGE_URL, {
        method: "POST",
        body: JSON.stringify(payload),
    }).then((res) => res.json());
}

/**
 * Retrieves an item from the storage based on the provided key.
 * @param {string} key - The key of the item to retrieve.
 * @returns {Promise<any>} - A promise that resolves to the retrieved item.
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return await fetch(url)
        .then((res) => res.json())
        .then((res) => res.data);
}

/**
 * Retrieves an item from storage and logs the response as JSON.
 * @param {string} key - The key of the item to retrieve.
 * @returns {Promise<void>} - A promise that resolves when the item is retrieved and logged.
 */
async function getItemAsJson(key) {
    let response = await getItem(key);
    console.log(response);
}

/**
 * Speichert ein Objekt als JSON-Zeichenkette unter einem bestimmten Schlüssel.
 *
 * @param {string} key - Der Schlüssel, unter dem der Wert gespeichert wird.
 * @param {Object} value - Das Objekt, das gespeichert wird.
 * @returns {Promise} Eine Promise, die sich auflöst, wenn der Wert erfolgreich gespeichert wurde.
 */
async function setItemFromJson(key, value) {
    return await setItem(key, JSON.stringify(value));
}
