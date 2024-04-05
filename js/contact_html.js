function rendercontactListHTML(i) {
  return /*html*/`
     <div class="shortContactInfo" onclick="showContact(${i})" id="info${i}">
          <div id="listContact${i}" class="contactPic">${contacts[i]['firstLetter']}${contacts[i]['lastLetter']}</div>
          <div class="shortContactLetters">
            <div class="singleNameListContact">${contacts[i]['name']}</div>
            <div class="listMail">${contacts[i]['email']}</div> 
          </div>
        </div>
    `;
}

function renderShowContactHTML(index) {
  return /*html*/`
  <div class="contactFullUpperSection" id="contactFullUpperSection">
    <div class="contactFullImage" id="listContactBig${index}">${contacts[index]['firstLetter']}${contacts[index]['lastLetter']}</div>
      <div class="contactNameEditDelete">
        <div class="contactFullName">${contacts[index]['name']}</div>
        <div class="contactEditDeleteArea">
          <div onclick="editContact(${index})" class="contactEdit"><div class="existContactEdit"></div>Edit</div>
          <div onclick="deleteContact(${index})" class="contactDelete margin16left"><div class="existContactDelete margin16left"></div>Delete</div>
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
}

function editContactHTML(index) {
  return /*HTML*/`
     <div class="contactEditVisible slide-in-right " id="contactEditVisible" onclick="event.stopPropagation()">
     <div class="contactEditCloseResponse" onclick="closeEditContact()"><img src="./assets/img/Close-white.png"></div>
      <div class="contactEditLeft">
        <img src="./assets/img/join-logo-white.png">
        <a>Edit contact</a>
        <div class="contactEditSpace"></div>
      </div>
      <div class="contactEditRight">
        <div id="contactEditImage${index}" class="contactEditFullImage">${contacts[index]['firstLetter']}${contacts[index]['lastLetter']}</div>
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
            <div class="contactEditSave" onclick="patchEdit(${index}); closeEditContact()">Save <img src="./assets/img/check.png"></div>
        </div>
        </div>  
      </div>
    </div>
    `
}

function rendercontactFullResponsive(index) {
  return /*HTML*/`
    <div class="headLineContactResponsive">
      <div class="contactFullResponsiveClose">
        <div class="headLineLeftContactResponsive">Contacts</div>
        <img src="./assets/img/Vector.png" onclick="closeContactFullResponsive()">
      </div>
      <div class="headLineRightContactResponsive">Better with a team</div>
      <div class="headLineSpaceContactHorizontalResponsive"></div>
      <div class="contactFullUpperSectionResponsive">
        <div class="contactFullImage" id="listContactBigResponsive${index}">${contacts[index]['firstLetter']}${contacts[index]['lastLetter']}</div>
        <div class="contactFullNameResponsive">${contacts[index]['name']}</div>
      </div>
      <div class="contactInformationHeadlineResponsive">Contact Information</div>
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
</div>
<div class="editContactButtonSmall" onclick="showContactPopupEditDelete()">
  <img src="./assets/img/more_vert.png">
</div>
<div class="popupAuxContainer" id="popupAuxContainer" onclick="hideContactPopupEditDelete()">
  <div class="contactPopupEditDelete" id="contactPopupEditDelete">
    <div onclick="editContact(${index})" class="contactEdit margin16left"><div class="existContactEdit"></div>Edit</div>
    <div onclick="deleteContact(${index})" class="contactDelete margin16left"><div class="existContactDelete"></div>Delete</div>
  </div>
</div>
</div>`
}