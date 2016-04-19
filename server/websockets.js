module.exports = (server) => {
  var io = require('socket.io')(server);

  io.on('connection', (socket) => {
    socket.emit('test', { hello: 'world' });
    socket.on('test2', (data) => {
      console.log(data, 'from server');
    });
  });
};
