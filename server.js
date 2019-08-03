const express = require('express');

const server = express();

server.get('/', (req, res) => {
  res.send(`<h1>Yay!!!!</h1>`);
});

module.exports = server;
