const express = require('express')
const routes = express.Router();
routes.use('/auth',require('../routes/authRoute'))
module.exports = routes;