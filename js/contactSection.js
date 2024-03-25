let uniqueFirstLetters = new Set();

function rendercontactList() {
  let list = document.getElementById('listArea');
  contacts.sort((a, b) => a['name'].localeCompare(b['name']));
  for (i = 0; i < contacts.length; i++) {
    let firstLetter = contacts[i]['name'].charAt(0);
    if (!uniqueFirstLetters.has(firstLetter)) {
      uniqueFirstLetters.add(firstLetter);
      list.innerHTML += `
          <div class="firstLetterContact">${firstLetter}</div>
          <div class="spaceContactList"></div>`;
    }
    list.innerHTML += rendercontactListHTML(i);
    document.getElementById(`listContact${i}`).style.backgroundColor = contacts[i]['color'];

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
    fullContact.innerHTML += renderShowContentHTML(index);
    fullContact.style.transform = "translateX(0)";
    document.getElementById(`listContactBig${index}`).style.backgroundColor = contacts[index]['color'];
  }, 400);

}

function editContact(index) {
  let contactEdit = document.getElementById('contactEditArea');
  contactEdit.style.display = "flex";
  contactEdit.innerHTML = ``;
  contactEdit.innerHTML += editContactHTML(index);
  document.getElementById('contactEditName').defaultValue = contacts[index]['name'];
  document.getElementById('contactEditEmail').defaultValue = contacts[index]['email'];
  document.getElementById('contactEditPhone').defaultValue = contacts[index]['phone'];
  document.getElementById(`contactEditImage${index}`).style.backgroundColor = contacts[index]['color']; 
}

function closeEditContact() {
  let contactEditVisible = document.getElementById('contactEditVisible');
  contactEditVisible.classList.add('slide-out-right');
  setTimeout(() => {
    document.getElementById('contactEditArea').style.display = "none";
    contactEditVisible.innerHTML = "";
  }, 400);
}

