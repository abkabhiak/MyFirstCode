// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@        Dependencies              @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
var express = require('express');
var app = express();
//chat room
var http = require('http').Server(app);
var io = require('socket.io')(http);
//
var mongoose = require('mongoose');
app.use(express.static(__dirname + '/public'));       // Exposing public directory
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))   // parse application/x-www-form-urlencoded
app.use(bodyParser.json())                            // parse application/json


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@    set up handlebars view engine  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
var handlebars = require('express3-handlebars').create({ defaultLayout:'main',helpers: {section: function(name, options){if(!this._sections) this._sections = {};
this._sections[name] = options.fn(this);
return null;
}
}});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@        Setting Port of HTTP Host      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
app.set('port', process.env.PORT || 3000);

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@           File Uploading             @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
var Busboy = require('busboy');
var busboy = require('connect-busboy'); //middleware for form/file upload
var inspect = require('util').inspect;
    path = require('path'),
    os = require('os');
var fs = require('fs-extra'); //File System - for file manipulation
app.use(busboy());            //using into express app object

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@         DB Connection and Modal creation            @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//

var hr1; /// Model
var myDb=require(__dirname+'/Serverjs/Datajs/DBConnect.js');
myDb.myDbConnect(mongoose,hr1);
mongoose.connection.on('error',function(err){
  console.log('Mongoose connection error: ' + err);
});  //On error with DB connection
process.on('SIGINT', function(){
  mongoose.connection.close(function () {
  console.log('Mongoose disconnected through app termination');
  process.exit(0);
  });
});  // On stoping App


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@        Other JS         @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
var fortune = require('./Serverjs/fortune.js');


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@        Router              @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//

//Router initialization
app.use(require(__dirname +'/Serverjs/Routejs/BasicRoute.js'));


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@        Listening on Port              @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
http.listen(app.get('port'), function(){console.log( 'Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.' )});

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@        Chat room         @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
var iomodule=require(__dirname+'/Serverjs/servicesjs/chaterbox.js');
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    iomodule.conMsgPrint(msg);//console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
    iomodule.conUserConnected();
  socket.on('disconnect', function(){
    iomodule.conUserDisconnected();
  });
});
