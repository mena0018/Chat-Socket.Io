let express = require('express')();
let http = require('http').createServer(express);
let fs = require('fs').promises;

express.get('/', (request, response) => {
  fs.readFile('./index.html')
    .then((content) => {
      // Writes response header
      response.writeHead(200, { 'Content-Type': 'text/html' });
      // Writes response content
      response.end(content);
    })
    .catch((error) => {
      // Returns 404 error: page not found
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.end('Page not found.');
    });
});

express.get('/client.js', (request, response) => {
    fs.readFile('./client.js')
      .then((content)=> {
        response.writeHead(200, { 'Content-Type': 'text/javascript' });
        response.end(content);
      })
      .catch((error) => {
        // Returns 404 error: page not found
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end('Page not found.');
      });
});

// Server listens on port 8080
http.listen(8000);

// Binds a socket server to the current HTTP server
let socketServer = require('socket.io')(http);
let registeredSockets = {};

// Registers an event listener ('connection' event)
socketServer.on('connection', function (socket) {
  console.log('A new user is connected...');

  /**
   * Retourne un booléen indiquant si le pseudo est disponible ou pas.
   */
  function isAvailable (nickname) {
    if (registeredSockets[nickname] === undefined) {
      return true;
    }
    return false;
  }

  /**
   * Retourne le pseudo de l'utilisateur correspondant à l'objet socket passé en paramètre.
   */
  function getNicknameBy(socket) {
    for (let key in registeredSockets) {
      if (key == nickname){
        return key;
      }
    }
  }

  
  /**
   * Ecouteur d'évenement <signin pour l'objet socket afin de : 
   *  - Ajouter le socket à l'objet registeredSockets.
   *  - Envoyer un événement de type <connected au client.
   *  - Envoyer un événement de type <notification à tous les autres.
   *  - Afficher un événement de type <error en cas d'utilisation d'un pseudo non dispo.
   */
    socket.on('>signin', (content) => {
      if (isAvailable(content)) {

        registeredSockets[content] = socket;
        socket.emit('<connected', content);
        socket.broadcast.emit('<notification', content + ' à rejoint la conversation <br>')
      } 
      else {
        socket.emit('<error', content);
      }
    });


    /**
     * Ecouteur d'évenement <message pour l'objet socket afin de : 
     * - Envoyer un événement de type <message à tous les clients connectés
     */
    socket.on('>message', (content) => {
      socketServer.emit('>message', content);
    })
});
