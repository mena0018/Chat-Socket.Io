/*
 * client.js
 */
let socketClient = io();

socketClient.emit('hello', 'Olivier');
let signinForm = document.forms["signin"];
let sendForm   = document.forms["send"];
let span       = document.querySelector("span");
let nickname   = document.querySelector("input[name='nickname']");
let display    = document.getElementById("display");
let error      = document.querySelector("div.toast-error");
let message    = document.querySelector("input[name='message']");
 

/**
 * Ecouteur d'événement submit au formulaire signin afin de :
 * - Envoyer un événement de type >signin au serveur avec comme paramètre 
 *   la valeur du champ de saisie nommé nickname
 * - Empêcher la soumission du formulaire
 */
 signinForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (nickname.value){
      socketClient.emit('>signin', nickname.value);
  }
});


/*
 * Ecouteur d'événement de type <connected pour l'objet socketClient afin de:
 * - Masquer le formulaire signin
 * - Ajouter le pseudo comme contenu textuel de l'élément span du formulaire send
 * - Afficher le formulaire send
 * - Masquer la div toast error
 */
socketClient.on('<connected', (content) => {
  signinForm.classList.add("hidden");
  sendForm.classList.remove("hidden");
  error.classList.add("hidden");
  span.innerHTML = content;
});


/**
 * Ecouteur d'événement de type <notification pour l'objet socketClient afin de:
 * - Ajouter le message passé en paramètre dans l'élément div#display
 */
socketClient.on('<notification', (content) => {
  display.innerHTML += content;
});


/**
 * Ecouteur d'événement de type <error pour l'objet socketClient afin de  :
 * - Renseigner le message d'erreur dans l'élément div.toast-error
 * - Afficher l'élément div.toast-error
 */
socketClient.on('<error', (content) => {
  error.classList.remove("hidden");
  error.innerHTML = 'Le pseudo ' + content + ' est déjà utilisé';
});


/**
 * Ecouteur d'événement submit au formulaire send afin de  :
 * - Envoyer un événement de type >message au serveur avec comme paramètre
 *   la valeur du champ de saisie nommé message
 * - Empêcher la soumission du formulaire
 * - Vider le champ de saisie nommé message
 */
sendForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (message.value) {
    socketClient.emit(">message", message.value);
    message.innerHTML = "";
  }
} )