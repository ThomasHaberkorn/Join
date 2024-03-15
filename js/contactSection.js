let uniqueFirstLetters = new Set();

function initContactSection() {
    let list = document.getElementById('contactSection');
    list.innerHTML = '';
    contacts.sort((a, b) => a['lastName'].localeCompare(b['lastName']));

    for (i=0; i < contacts.length; i++){
        let firstLetter = contacts[i]['lastName'].charAt(0);

        if (!uniqueFirstLetters.has(firstLetter)) {
          uniqueFirstLetters.add(firstLetter);
          list.innerHTML += `
          <div class="firstLetter">${firstLetter}</div>
          <div class="spaceContactList"></div>`;
        }
        list.innerHTML += `
        <img src="${contacts[i]['url']}" class="contactPic">
        <div class="singleNameList">${contacts[i]['firstName']} ${contacts[i]['lastName']}</div>`;
    }
}