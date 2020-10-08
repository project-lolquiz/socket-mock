const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;

app.get('/', function (req, res) {
  res.sendFile(`${__dirname}/index.html`);
});

io.on('connection', (socket) => {
  socket.on('room', function (room) {
    if (socket.room) socket.leave(socket.room);

    socket.room = room;
    socket.join(room);
  });

  //Send this event to everyone in the room.
  io.sockets.in('xablau').emit('connectToRoom', 'You are in room no. ');
});

http.listen(port, function () {
  console.log(`listening on localhost: ${port}`);
});
