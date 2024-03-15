let uniqueFirstLetters = new Set();

function initContactSection() {
    let list = document.getElementById('contactSection');
    list.innerHTML = '';
    list.innerHTML +=`
    <div class="contactButtonArea dispflex">
      <div class="borderContactButton dispflex">
        <div class="addNewContactButton dispflex">Add new contact  
        <img src="./assets/img/person_add.png"></div>
      </div> 
    </div> 
    `;
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
        <div class="shortContactInfo" id="info${i}">
          <img src="${contacts[i]['url']}" class="contactPic">
          <div class="shortContactLetters">
            <div class="singleNameList">${contacts[i]['firstName']} ${contacts[i]['lastName']}</div>
            <div class="listMail">${contacts[i]['email']}</div> 
          </div>
        </div>`;
        
      }
}