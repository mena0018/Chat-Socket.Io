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
// Registers an event listener ('connection' event)
socketServer.on('connection', function (socket) {
  console.log('A new user is connected...');

/*
   * Registers an event listener
   *
   * - The first parameter is the event name
   * - The second parameter is a callback function that processes
   *   the message content.
   */
  /*
  socket.on('hello', (content) => {
    console.log(content + ' says hello!');

    // Pushes an event to all the connected clients
    socketServer.emit('notification', content + ' says hello!');

    // Pushes an event to the client related to the socket object
    socket.emit('hello', 'Hi ' + content + ', wassup mate?');
  });
  */

  let registeredSockets = {};

  function isAvailable (nickname) {

    // if (Object.keys(registeredSockets).includes(nickname))
    if (registeredSockets[nickname] === undefined) {
      return true;
    }
    return false;
  }

    socket.on('>signin', (content) => {
      if (isAvailable(content)){
        console.log('login :' + content);
        Object.keys(registeredSockets).push(content);
      } 
    });
});
