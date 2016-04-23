module.exports = (server) => {

  var io = require('socket.io')(server);
  var sessionData = require('./sessionData.js');
  var dataMethods = require('./dataMethods.js');
  io.on('connection', (socket) => {
    var user;
    var room;

    socket.on('add track', (track) => {
    socket.join('HR41');

    socket.emit('new track', sessionData['HR41'].tracks);


    socket.on('add track', (data) => {
      // sessionData is a server side data store
      dataMethods.addToStore(data.track, sessionData[data.room].tracks);
      dataMethods.setRemovalInHalfHour(data.track, sessionData[data.room], function () {
        // console.log('inside removal', sessionData[data.room]);
        io.to(data.room).emit('remove from playlist', sessionData[data.room].tracks);
        // io.broadcast(data.room).emit('remove from playlist', sessionData[data.room].tracks);
      });
      io.to(data.room).emit('new track', sessionData[data.room].tracks);
      // io.broadcast(data.room).emit('new track', sessionData[data.room].tracks);
    });

    socket.on('track play', (data) => {
      sessionData[data.room].currentTrack = data.track;
      io.to(data.room).emit('update track', sessionData[data.room].currentTrack);
      // then delete track from playlist
      dataMethods.removeFromStore(data.track, sessionData[data.room].tracks);
      io.to(data.room).emit('remove from playlist', sessionData[data.room].tracks);
    });

    // handle messages to send from one to all
    socket.on('new message', (message) => {
      socket.emit('new message', message);
      socket.broadcast.emit('new message', message);
    });

    socket.on('add user', (username) => {
      socket.username = username;
      socket.emit('user joined', socket.username);
      user = {
        userName: username,
        userId: socket.id,
        isDictator: false,
        mood: 0,
      };
      if (sessionData.userData.length === 0) {
        socket.emit('assign dictator');
        user.isDictator = true;
        sessionData.dictator = user;
      }
      dataMethods.addToStore(user, sessionData['HR41'].userData);

    });

    socket.on('disconnect', () => {
      // handles undefined user for disconnects before
      // joining with the modal
      var isDictator = user ? user.isDictator : false;
      if (isDictator) {
        dataMethods.assignDictator(user, sessionData);
        var dictatorId = sessionData.dictator.userId;
        if (io.sockets.connected[dictatorId]) {
          io.to(dictatorId).emit('assign dictator');
          // i do not think the line below is necessary but haven't tested extensively
          // io.sockets.connected[dictatorId].broadcast.emit('assign dictator');
        }
      }
      dataMethods.removeFromStore(user, sessionData[room].userData);
    });
      // need to handle dictator change on disconnect

    socket.on('mood change', (sentiment) => {
      var target = { userId: socket.id };
      dataMethods.updateObjPropInStore(target, sessionData.userData, (user) => {
        user.mood = sentiment;
      });

      dataMethods.getMoods(sessionData.userData, (mood) => {
        dataMethods.setTemperature(sessionData, mood);

        socket.broadcast.emit('temperatureUpdate', { temperature: sessionData.temperature });
        socket.emit('temperatureUpdate', { temperature: sessionData.temperature });
        dataMethods.getMoods(sessionData.userData, (moods) => {
          dataMethods.setTemperature(sessionData, moods);
          var isDictatorSafe = dataMethods.isDictatorSafe(mood);
          if (!isDictatorSafe) {
            dataMethods.assignDictator(sessionData);
            dataMethods.resetPlayerMoods(sessionData.userData);

            var dictatorId = sessionData.dictator.userId;
            if (io.sockets.connected[dictatorId]) {
              io.sockets.connected[dictatorId].emit('assign dictator');
            }
          }
        });
      });
    // handle messages to send from one to all
    //handle messages to send from one to all
    socket.on('new message', (message) => {
      socket.emit('new message', message);
      socket.broadcast.emit('new message', message);
    });

    socket.on('change room', (roomData) =>{
      if (!sessionData[roomData.newRoom]) {
        sessionData.addRoomSession(roomData.newRoom);
      }
      socket.leave(roomData.oldRoom);
      dataMethods.removeFromStore(user, sessionData[roomData.oldRoom].userData);
      socket.join(roomData.newRoom);
      room = roomData.newRoom;
      dataMethods.addToStore(user, sessionData[roomData.newRoom].userData);
      socket.emit('new track', sessionData[roomData.newRoom].tracks)


    });
  });
};
