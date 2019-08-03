const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const server = express();
const actionRoute = require('./data/routes/actionRoutes');
const projectRoute = require('./data/routes/projectRoutes');

/* Middleware */
server.use(morgan('dev'));
server.use(helmet());
server.use(express.json());
server.use('/api/actions', actionRoute);
server.use('/api/projects', projectRoute);

server.get('/', (req, res) => {
  res.send(`<h1>Yay!!!!</h1>`);
});

module.exports = server;
