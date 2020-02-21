require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet=require('helmet');
const { NODE_ENV } = require('./config');
const bookmarkRouter = require('./bookmarksRouter')
const errorHandler = require('./errorHandler')
const logger = require('./logger')

const app= express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`)
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  next()
})

app.use(bookmarkRouter)
app.use(errorHandler)

app.get('/', (req, res) => {
     res
        .status(200)
        .send('Hello, world!')
});

module.exports = app;