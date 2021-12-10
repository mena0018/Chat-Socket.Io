let express = require('express')();
let http = require('http').createServer(express);
let fs = require('fs').promises;
const ent = require('ent');

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
    for (const [key, value] of Object.entries(registeredSockets)) {
      if (value === socket) {
        return key;
      }
    }
  }

  /**
   * Retourne un tableau contenant les pseudos de tous les utilisateurs connectés.
   */
  function getAllNicknames() {
    return Object.keys(registeredSockets);
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
        socket.broadcast.emit('<notification', { type:"joined", pseudo: content }) 

        socketServer.emit('<users', (getAllNicknames()));
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
      let text = getNicknameBy(socket);
      socketServer.emit('<message', text, ent.encode(content));
    })

    /**
     * Ecouteur d'événement de type disconnect à l'objet socket afin de:
     * - supprimer ce socket de l'objet registeredSockets
     * - envoyer une notification aux autres utilisateurs
     */
    socket.on('disconnect', () => {
      const pseudo = getNicknameBy(socket);
      delete registeredSockets[pseudo];

      // Pour envoyer uniquement à ceux connecté
      Object.values(registeredSockets).forEach(
        socket => socket.emit('<notification', { type:"left", pseudo })
        );   
      
      socketServer.emit('<users', (getAllNicknames()));
    })

});
