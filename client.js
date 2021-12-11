/*
 * client.js
 */
let socketClient = io();

socketClient.emit("hello", "Olivier");
let signinForm  = document.forms["signin"];
let sendForm    = document.forms["send"];
let privateForm = document.forms["private"];
let nickname    = document.querySelector("input[name='nickname']");
let message     = document.querySelector("input[name='message']");
let messagePrv  = document.querySelector("input[name='message-private']");

let span        = document.querySelector("span");
let display     = document.getElementById("display");
let error       = document.querySelector("div.toast-error");
let users       = document.querySelector("#users>div");
let title       = document.querySelector("#users>h1");
let user        = document.querySelector(".user");


/**
 * Écouteur d'événement submit au formulaire signin afin de :
 * - Envoyer un événement de type >signin au serveur avec comme paramètre
 *   la valeur du champ de saisie nommé nickname
 * - Empêcher la soumission du formulaire
 */
signinForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (nickname.value) {
    socketClient.emit(">signin", nickname.value);
  }
});

/**
 * Écouteur d'événement de type <connected pour l'objet socketClient afin de:
 * - Masquer le formulaire signin
 * - Ajouter le pseudo comme contenu textuel de l'élément span du formulaire send
 * - Afficher le formulaire send
 * - Masquer la div toast error
 */
socketClient.on("<connected", (content) => {
  signinForm.classList.add("hidden");
  sendForm.classList.remove("hidden");
  error.classList.add("hidden");
  span.innerHTML = content;
});

socketClient.on("<notification", (content) => {
  const action = content.type === "joined" ? "rejoint" : "quitté";
  display.innerHTML = `<div class="${content.type}"> ${content.pseudo} à ${action} la conversation </div>`;
});

/**
 * Écouteur d'événement de type <error pour l'objet socketClient afin de  :
 * - Renseigner le message d'erreur dans l'élément div.toast-error
 * - Afficher l'élément div.toast-error
 */
socketClient.on("<error", (content) => {
  error.classList.remove("hidden");
  error.innerHTML = "Le pseudo " + content + " est déjà utilisé";
});

/**
 * Écouteur d'événement submit au formulaire signin afin de :
 * - Envoyer un événement de type >signin au serveur avec comme paramètre
 *   la valeur du champ de saisie nommé nickname
 * - Empêcher la soumission du formulaire
 */
sendForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (message.value) {
    socketClient.emit(">message", message.value);
    message.innerHTML = "";
  }
});

/**
 * Écouteur d'événement de type <message pour l'objet socketClient afin de
 * - Afficher le message dans l'élément div#display
 */
socketClient.on("<message", (sender, text) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  const date = new Date().toLocaleDateString("fr-FR", options);
  display.innerHTML += `
      <div>
        <span class="pseudo">${sender}</span>
        <span class="date">${date}</span>
      </div>
      <div class="contenu">${text}</div>
    `;
});

/**
 * Écouteur d'événement de type <users afin de
 * - Mettre à jour la liste des utilisateurs connecté
 *   dans l'interface du client chat.
 */
socketClient.on("<users", (content) => {
  let nbr = content.length;
  if (nbr > 0) {
    title.innerHTML = `${nbr} users connected`;
  }

  users.innerHTML = ``;
  content.forEach((user) => {
  users.innerHTML += `<div class="user">${user} 
  <a href="#demo">Message privé</a>
    <div id="demo" class="modal">
      <div class="modal_content">
      <h5>Message privé à ${user}</h5>
        <form name="private" class="mt-2">
          <div class="input-group">
            <span class="input-group-addon hide-sm">${user} </span>
            <input name="message-private" type="text" class="form-input" placeholder="type your message here">
            <input type="submit" class="btn btn-error" value="send">
          </div>
        </form>
        <a href="#" class="modal_close">&times;</a>
      </div>
    </div>
  </div>`;
  //user.addEventListener("click", () => {});
  });
});


 
/**
 * L'événement de type >private envoyé au serveur aura pour paramètre un objet composé    * des propriétés recipient et text.
 */
privateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (messagePrv.value) {
    socketClient.emit(">private", messagePrv.value);
    messagePrv.innerHTML = "";
  }
});
