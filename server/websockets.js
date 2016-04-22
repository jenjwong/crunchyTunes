module.exports = (server) => {

  var io = require('socket.io')(server);
  var sessionData = require('./sessionData.js');
  var dataMethods = require('./dataMethods.js');

  io.on('connection', (socket) => {
    var user;

    socket.on('add track', (track) => {
      // sessionData is a server side data store
      dataMethods.addToStore(track, sessionData.tracks);
      dataMethods.setRemovalInHalfHour(track, sessionData.tracks, function () {
        socket.emit('remove from playlist', sessionData.tracks);
      });

      socket.emit('new track', sessionData.tracks);
      socket.broadcast.emit('new track', sessionData.tracks);
    });

    socket.on('track play', (playing) => {
      sessionData.currentTrack = playing;
      socket.emit('update track', sessionData.currentTrack);
      socket.broadcast.emit('update track', sessionData.currentTrack);
      // then delete track from playlist
      dataMethods.removeFromStore(playing, sessionData.tracks);
      socket.emit('remove from playlist', sessionData.tracks);
      socket.broadcast.emit('remove from playlist', sessionData.tracks);
    });

    //handle messages to send from one to all
    socket.on('new message', (message) => {
      socket.emit('new message', message);
      socket.broadcast.emit('new message', message);
    });

    socket.on('add user', (username) => {
      socket.username = username;
      socket.emit('user joined', {
        username: socket.username,
      });
      user = {
        userName: username,
        userId: socket.id,
        role: 'pleeb',
        mood: 0,
      };
      dataMethods.addToStore(user, sessionData.userData);
    });

    socket.on('disconnect', () => {
      dataMethods.removeFromStore(user, sessionData.userData);
    });

    // handle messages to send from one to all
    socket.on('new message', (message) => {
      socket.emit('new message', message);
      socket.broadcast.emit('new message', message);
    });

      // need to handle dictator change on disconnect

    socket.on('moodChange', (sentiment) => {
      var target = {userId: socket.id};
      dataMethods.updateObjPropInStore(target, sessionData.userData, (user) => {
        user.mood = sentiment;
      });

      dataMethods.getMood(sessionData.userData, (mood) => {
        dataMethods.setTemperature(sessionData, mood);

        socket.broadcast.emit('temperatureUpdate', {temperature: sessionData.temperature});
        socket.emit('temperatureUpdate', {temperature: sessionData.temperature});
        dataMethods.resetPlayerMoods(sessionData.userData);

        dataMethods.getMood(sessionData.userData, (mood) => {
          dataMethods.setTemperature(sessionData, mood);
          var isDictatorSafe = dataMethods.isDictatorSafe(mood);
          if (!isDictatorSafe) {
            dataMethods.assignDictator(sessionData);
            var dictatorId = sessionData.dictator.userId;
            if (io.sockets.connected[dictatorId]) {
              io.sockets.connected[dictatorId].emit('assignDictator');
              // there is a chance the same dictator will be picked twice
              // gahh math.random
              io.sockets.connected[dictatorId].broadcast.emit('assignDictator');
            }
          }
        });
      });
    });
  });
};
