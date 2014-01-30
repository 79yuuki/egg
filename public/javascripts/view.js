  var socket = io.connect('http://bapa-egg.herokuapp.com');
  //var socket = io.connect('http://localhost:3000/');
  var s = socket.of('/socket');
  s.on('connect', function(msg) {
    console.log('connected');
  });

  s.on('throw', function(xyz) {
  	console.log(xyz);
  });
