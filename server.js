/*
  Server for the store front app. Connects to Mongo database.
*/

var express = require('express');
const cors = require('cors');
const winston = require('winston')

var controller = require('./serverCtrl.js');

var app = express();
app.use(cors());

//static files
app.use(express.static('./public/dist/store-front-client'));

controller(app);

var server = app.listen(process.env.PORT || 8080, () => {
  var port = server.address().port;
  console.log("App is listening on port ", port);
});
