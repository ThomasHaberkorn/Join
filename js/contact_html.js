function rendercontactListHTML(i) {
    return /*html*/`
     <div class="shortContactInfo" onclick="showContact(${i})" id="info${i}">
          <img src="${contacts[i]['url']}" class="contactPic">
          <div class="shortContactLetters">
            <div class="singleNameListContact">${contacts[i]['name']}</div>
            <div class="listMail">${contacts[i]['email']}</div> 
          </div>
        </div>
    `;
}

function renderShowContentHTML(index) {
    return /*html*/`
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
}

function editContactHTML(index) {
    return /*HTML*/`
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
            <div class="contactEditSave dispflex" onclick="">Save <img src="./assets/img/check.png"></div>
        </div>
        </div>  
      </div>
    </div>
    `




}