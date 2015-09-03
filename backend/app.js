var express = require('express');
var http = require('http');
var regions = require('./routes/regions');
var mongoose = require('mongoose');
var cors = require('cors')

// DB connection:
mongoose.connect('mongodb://localhost/bigmap');

var app = express();

// all environments
app.use(cors());
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

// ROUTES HERE!
app.get('/regions', regions.index);
app.post('/regions', regions.create);
app.post('/regions/init', regions.init);

// Aaaaand here we go:
http.createServer(app).listen(app.get('port'), function(){
  console.log('BigMap Express server listening on port ' + app.get('port'));
});
