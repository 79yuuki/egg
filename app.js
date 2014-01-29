
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/draw', function(req,res){res.render('draw');});

var server =  http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);
var namespace = io.of('/socket')

namespace.on('connection',function(socket){
  console.log('connected!!');
  socket.on('message', function(data){
    console.log();
    var msg = sanitize(data.value).entityEncode();
    namespace.emit('message', {value: msg});
    //io.sockets.emit('message', {value: msg});
    //io.sockets.emit('message', {value: data.value});
  });

  socket.on('throw', function(egg){
    namespace.emit('throw', egg);
  });

  socket.on('disconnect', function(){
    console.log('disconnected!');
  });
});

