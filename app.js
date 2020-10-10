const app = require('express')();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

const port = process.env.PORT || 3000;

app.get('/', function (req, res) {
  res.sendFile(`${__dirname}/index.html`);
});

app.get('/:id', function (req, res) {
  res.sendFile(`${__dirname}/index.html`);
});

io.on('connect', (socket) => {
  socket.on('room', function (data) {
    if (socket.room) socket.leave(socket.room);

    const { room, nickname } = data;
    socket.room = room;
    socket.nickname = nickname;
    socket.join(room);

    // const users = socket.adapter.rooms[room]?.sockets;

    const sockets = io.in(room);
    const members = Object.keys(sockets.sockets)
      .filter((item) => sockets.sockets[item].room === room)
      .map((item) => sockets.sockets[item].nickname);

    io.in(room).emit('connectToRoom', members);
  });

  socket.on('disconnect', () => {
    const sockets = io.in(socket.room);
    const members = Object.keys(sockets.sockets).map(
      (item) => sockets.sockets[item].nickname
    );

    io.in(socket.room).emit('connectToRoom', members);
  });
});

httpServer.listen(port, function () {
  console.log(`listening on localhost: ${port}`);
});
