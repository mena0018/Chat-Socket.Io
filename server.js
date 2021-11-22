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
})


// Binds a socket server to the current HTTP server
let socketServer = require('socket.io')(http);
// Registers an event listener ('connection' event)
socketServer.on('connection', (socket) => {
  console.log('A new user is connected...');
});

// Server listens on port 8080
http.listen(8080);