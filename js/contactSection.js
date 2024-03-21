let uniqueFirstLetters = new Set();

function rendercontactList(){   
  let list = document.getElementById('contactList');
  contacts.sort((a, b) => a['name'].localeCompare(b['name']));

  for (i = 0; i < contacts.length; i++) {
    let firstLetter = contacts[i]['name'].charAt(0);
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
            <div class="singleNameListContact">${contacts[i]['name']}</div>
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
    fullContact.innerHTML = '';
    fullContact.innerHTML += `
  <div class="contactFullUpperSection" id="contactFullUpperSection">
    <img class="contactFullImage" src="${contacts[index]['url']}">
      <div class="contactNameEditDelete">
        <div class="contactFullName">${contacts[index]['name']}</div>
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
  contactEdit.innerHTML += `
    <div class="contactEditVisible slide-in-right" id="contactEditVisible">
      <div class="contactEditLeft">
        <img src="./assets/img/join-logo-white.png">
        <a>Edit contact</a>
        <div class="contactEditSpace"></div>
      </div>
      <div class="contactEditRight">
        <img src="${contacts[index]['url']}" class="contactEditFullImage">
        <div class="contactEditRenderDetailsRight">
          <img src="./assets/img/Close.png" class="contactEditClose" onclick="closeEditContact()">
          <div class="contactEditUserDetails">
            <div class="contactEditInput">
              <input  id="contactEditName" placeholder="Name">
              <img src="./assets/img/person.png">
            </div>
            <div class="contactEditInput">
              <input id="contactEditEmail" placeholder="Mail">
              <img src="./assets/img/mail.png">
            </div>
            <div class="contactEditInput">
              <input id="contactEditPhone" placeholder="Phone">
              <img src="./assets/img/call.png">
            </div>
          </div>
          <div class="contactEditSaveDelete">
            <div class="contactEditDelete dispflex" onclick="">Delete</div>
            <div class="contactEditSave dispflex" onclick="">Save <img src="./assets/img/check.png"</div>
          </div
        </div>  
      </div>
    </div>
  `;
  document.getElementById('contactEditName').defaultValue = contacts[index]['name'];
  document.getElementById('contactEditEmail').defaultValue = contacts[index]['email'];
  document.getElementById('contactEditPhone').defaultValue = contacts[index]['phone'];
}

function closeEditContact() {
  let contactEditVisible = document.getElementById('contactEditVisible');
  contactEditVisible.classList.remove('slide-in-right');
  contactEditVisible.classList.add('slide-out-right');
  contactEditVisible.innerHTML = "";
  document.getElementById('contactEditArea').style.display = "none";
}