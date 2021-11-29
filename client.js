/*
 * client.js
 */
let socketClient = io();

/*
 * Emits an event to the server
 *
 * - The first parameter is the event name.
 * - The second parameter is the message content: it can be a number,
 *   a string or an object.
 */
socketClient.emit('hello', 'Olivier');
let signinForm = document.forms["signin"];
let sendForm   = document.forms["send"];
let span       = document.querySelector("span");
let nickname   = document.querySelector("input[name='nickname']");
let display    = document.getElementById("display");
let error       = document.querySelector("toast");



/*
 * Registers event listeners
 *
 * - The first parameter is the event name
 * - The second parameter is a callback function that processes
 *   the message content.
 */
socketClient.on('<connected', (content) => {
  // Masque le formulaire signin
  signinForm.classList.add("hidden")

  // Affiche le formulaire send
  sendForm.classList.remove("hidden")

  // Remplace le contenu du span par le pseudo 
  span.innerHTML = content;
});

socketClient.on('<notification', (content) => {
  // Ajoute le message passé en paramètre dans l'élément div#display
  display.innerHTML += content;
});

socketClient.on('<error', (content) => {
  error.classList.remove("hidden");
  error.innerHTML += 'Le pseudo' + content + 'est déjà utilisé';
});


signinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (nickname.value){
        socketClient.emit('>signin', nickname.value)
    }
});
