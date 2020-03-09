var express = require('express.io');
var app = express();
app.http().io();
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
  res.render('index.ejs');
});

app.io.route('ready', function(req) {
  req.io.join(req.data.chat_room);
  req.io.join(req.data.signal_room);
  app.io.room(req.data).broadcast('announce', {
    message: 'New Client in the ' + req.data + ' room.'
  });
});

app.io.route('send', function(req, res) {
  app.io.room(req.data.room).broadcast('message', {
    message: req.data.message,
    author: req.data.author
  });
});

app.io.route('signal', function(req, res) {
  // note the use of req here for broadcasting so only the sender doesn't receive thier own messages
  req.io.room(req.data.room).broadcast('signaling_message', {
    type: req.data.type,
    message: req.data.message
  });
});

var port = 3000;
app.listen(port, function() {
  console.log('listening to port: ' + port);
});