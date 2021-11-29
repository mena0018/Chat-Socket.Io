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
http.listen(8080);

// Binds a socket server to the current HTTP server
let socketServer = require('socket.io')(http);
let registeredSockets = {};

// Registers an event listener ('connection' event)
socketServer.on('connection', function (socket) {
  console.log('A new user is connected...');


  function isAvailable (nickname) {
    if (registeredSockets[nickname] === undefined) {
      return true;
    }
    return false;
  }

    socket.on('>signin', (content) => {
      if (isAvailable(content)) {

         // Ajout du socket à l'objet registeredSockets
        registeredSockets[content] = socket;

        // Envoie d'un événement de type <connected au client
        socket.emit('<connected', content);

        // Envoie d'un événement de type <notification à tous les autres
        socket.broadcast.emit('<notification', content + ' à rejoint la conversation <br>')
      } 
    });
      socket.emit('<error', content);
});






