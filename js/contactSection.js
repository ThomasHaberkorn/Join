let uniqueFirstLetters = new Set();

function initContactSection() {
  let list = document.getElementById('contactSection');
  list.innerHTML = '';
  list.innerHTML += `
    <div class="dispflex">
      <div class="borderContactButton dispflex">
        <div class="addNewContactButton dispflex" onclick="addNewContact()">Add new contact  
        <img src="./assets/img/person_add.png"></div>
      </div> 
    </div> 
    `;
  contacts.sort((a, b) => a['lastName'].localeCompare(b['lastName']));

  for (i = 0; i < contacts.length; i++) {
    let firstLetter = contacts[i]['lastName'].charAt(0);
    if (!uniqueFirstLetters.has(firstLetter)) {
      uniqueFirstLetters.add(firstLetter);
      list.innerHTML += `
          <div class="firstLetterContact">${firstLetter}</div>
          <div class="spaceContactList"></div>`;
    }
    list.innerHTML += `
        <div class="shortContactInfo" onclick="showContact(${i})" id="info${i}">
          <img src="${contacts[i]['url']}" class="contactPic">
          <div class="shortContactLetters">
            <div class="singleNameListContact">${contacts[i]['firstName']} ${contacts[i]['lastName']}</div>
            <div class="listMail">${contacts[i]['email']}</div> 
          </div>
        </div>`;
  }
  
}

function addNewContact() {

}

function showContact(index) {
  let fullContact = document.getElementById('contactFull');
// Animation für das Verschieben des Containers nach rechts vorbereiten
fullContact.style.transition = "transform 0.4s ease";
fullContact.style.transform = "translateX(120%)";

// Eine kurze Verzögerung hinzufügen, um die Animation abzuschließen
setTimeout(() => {
  // Alten Inhalt löschen
  fullContact.innerHTML = '';
  fullContact.innerHTML += `
  <div class="contactFullUpperSection" id="contactFullUpperSection">
    <img class="contactFullImage" src="${contacts[index]['url']}">
      <div class="contactNameEditDelete">
        <div class="contactFullName">${contacts[index]['firstName']}  ${contacts[index]['lastName']}</div>
        <div class="contactEditDeleteArea">
          <div onclick="editContact(${index})" class="contactEdit"><img class="existContactEdit" src="./assets/img/edit.png"><p>Edit</p></img></div>
          <div onclick="deleteContact(${index})" class="contactDelete margin16left"><img class="existContactEdit margin16left" src="./assets/img/delete.png"><p>Delete</p></img></div>
        </div>   
      </div>
    </div>
  </div>
  <div class="contactInformationHeadline">Contact Information</div>
  <div class="mailPhoneArea">
    <div class="renderMail">
      <p>Email</p>
    </div>
    <a href="mailto:${contacts[index]['email']}">${contacts[index]['email']}</a>
    <div class="renderPhone">
      <p>Phone</p>
    <a href="tel:${contacts[index]['phone']}">${contacts[index]['phone']}</a>
    </div>
  </div>
  `;

  fullContact.style.transform = "translateX(0)";
  }, 400);
}

function editContact(index) {
  let contactEdit = document.getElementById('contactEditArea');
  contactEdit.style.display = "flex";
  contactEdit.innerHTML = ``;
  contactEdit.innerHTML +=`
    <div class="contactEditVisible" id="contactEditVisible">
      <div class="contactEditLeft">
        <img src="./assets/img/join-logo-white.png">
        <a>Edit contact</a>
        <div class="contactEditSpace"></div>
      </div>
      <div class="contactEditRight">
        <img src="${contacts[index]['url']}" class="contactEditFullImage">
        <div class="contactEditRenderDetailsRight">
          <img src="./assets/img/Close.png" class="contactEditClose">
          <div class="contactEditUserDetails">
            <div class="contactEditInput">
              <input  id="contactEditName" placeholder="${contacts[index]['firstName']}  ${contacts[index]['lastName']}">
            </div>
            <div class="contactEditInput">
              <input id="contactEditEmail" placeholder="${contacts[index]['email']}">
            </div>
            <div class="contactEditInput">
              <input id="contactEditPhone" placeholder="${contacts[index]['phone']}">
            </div>
          </div>
          <div class="contactEditSaveDelete"></div
        </div>  
      </div>
    </div>
  `;
}