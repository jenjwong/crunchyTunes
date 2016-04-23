module.exports = (server) => {

  var io = require('socket.io')(server);
  var sessionData = require('./sessionData.js');
  var dataMethods = require('./dataMethods.js');
  io.on('connection', (socket) => {
    var user;
    var room = 'HR41';

    socket.join(room);
    socket.emit('new track', sessionData[room].tracks);

    socket.on('add track', (track) => {
      dataMethods.addToStore(track, sessionData[room].tracks);
      dataMethods.setRemovalInHalfHour(track, sessionData[room], () => {
        io.to(room).emit('remove from playlist', sessionData[room].tracks);
      });

      io.to(room).emit('new track', sessionData[room].tracks);
    });

    socket.on('track play', (track) => {
      sessionData[room].currentTrack = track;
      io.to(room).emit('update track', sessionData[room].currentTrack);
      // then delete track from playlist
      dataMethods.removeFromStore(track, sessionData[room].tracks);
      io.to(room).emit('remove from playlist', sessionData[room].tracks);
    });

    // handle messages to send from one to all
    socket.on('new message', (message) => {
      io.emit('new message', message);
    });

    socket.on('add user', (username) => {
      socket.username = username;
      socket.emit('user joined', socket.username);
      user = {
        username: username,
        userId: socket.id,
        isDictator: false,
        mood: 0,
      };

      if (sessionData[room].userData.length === 0) {
        user.isDictator = true;
        sessionData[room].dictator = user;
        socket.emit('you are dictator', sessionData[room].dictator);
      }

      io.emit('new dictator', sessionData[room].dictator)
      dataMethods.addToStore(user, sessionData[room].userData);
    });

    socket.on('disconnect', () => {
      // handles undefined user for disconnects before
      // joining with the modal
      var isDictator = user ? user.isDictator : false;
      if (isDictator) {
        dataMethods.assignDictator(user, sessionData[room]);
        var dictatorId = sessionData[room].dictator.userId;
        if (io.sockets.connected[dictatorId]) {
          io.to(dictatorId).emit('you are dictator', sessionData[room].dictator);
          io.emit('new dictator', sessionData[room].dictator);

          // i do not think the line below is necessary but haven't tested extensively
          // io.sockets.connected[dictatorId].broadcast.emit('assign dictator');
        }
      }
      dataMethods.removeFromStore(user, sessionData[room].userData);
    });
      // need to handle dictator change on disconnect

    socket.on('mood change', (sentiment) => {
      var target = { userId: socket.id };
      dataMethods.updateObjPropInStore(target, sessionData[room].userData, (user) => {
        user.mood = sentiment;
      });

      dataMethods.getMoods(sessionData[room].userData, (mood) => {
        //set and broadcast temperature
        dataMethods.setTemperature(sessionData[room], mood);

        io.emit('update temperature', sessionData[room].temperature);
        dataMethods.getMoods(sessionData[room].userData, (moods) => {

          dataMethods.setTemperature(sessionData[room], moods);
          
          var isDictatorSafe = dataMethods.isDictatorSafe(sessionData[room].temperature);
          if (!isDictatorSafe) {

            dataMethods.assignDictator(sessionData[room].dictator, sessionData[room]);
            dataMethods.resetPlayerMoods(sessionData[room].userData);
            io.emit('new dictator', sessionData[room].dictator);   

            var dictatorId = sessionData[room].dictator.userId;
            if (io.sockets.connected[dictatorId]) {
              io.sockets.connected[dictatorId].emit('you are dictator', sessionData[room].dictator);
            }
          }
        });
      });
    });

    socket.on('change room', (roomData) =>{
      if (!sessionData[roomData.newRoom]) {
        dataMethods.addRoomSession(roomData.newRoom);
      }
      socket.leave(roomData.oldRoom);
      dataMethods.removeFromStore(user, sessionData[roomData.oldRoom].userData);
      socket.join(roomData.newRoom);
      room = roomData.newRoom;
      dataMethods.addToStore(user, sessionData[room].userData);
      socket.emit('new track', sessionData[room].tracks)
    });
  });
}
