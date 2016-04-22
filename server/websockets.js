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
<<<<<<< 90db97c7e36f44ce51fb490704b9d6e70f0557c0
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
  });
};

// prerefactor below
      sessionData.userData.push({ userName: username, userId: socket.id, role: 'pleeb', mood: 1 });
        if (sessionData.userData.length === 1) {
            newDictator();
        }
      });

    socket.on('moodLike', () => {
      _.each(sessionData.userData, function(item) {
        if (item.userId === socket.id) {
          item.mood = 1;
        }
      })
      updateCurrentMood();
    });

    socket.on('moodDislike', () => {
      (console.log('moodDislike'))
      _.each(sessionData.userData, function(item) {
        if (item.userId === socket.id) {
          item.mood = 0;
        }
      })
      updateCurrentMood();
    });

    function updateCurrentMood() {
      var moodArray = _.pluck(sessionData.userData, 'mood');
      var aggregateMood = _.reduce(moodArray, function(memo, num){ return memo + num; }, 0.001);
      getTemperature(aggregateMood, sessionData.userData.length);
    }

    function getTemperature(aggregateMood, numUsers) {
      sessionData.temperature = Math.floor((aggregateMood/sessionData.userData.length) * 100);

      socket.emit('temperatureUpdate', {temperature: sessionData.temperature})
      socket.broadcast.emit('temperatureUpdate', {temperature: sessionData.temperature})

      if ((sessionData.temperature) < 30 ) {
        _.each(sessionData.userData, function(person) {
              person.mood = 1;
          });
          sessionData.temperature = 100;

          newDictator();
          socket.emit('temperatureUpdate', {temperature: sessionData.temperature});
          socket.broadcast.emit('temperatureUpdate', {temperature: sessionData.temperature});
      }
    }

    function newDictator() {
      var newDictator = sessionData.userData[Math.floor(Math.random() * sessionData.userData.length)];
      sessionData.dictator = newDictator;
       // socket.emit('newDictator', {});
       if (io.sockets.connected[sessionData.dictator.userId]) {
         io.sockets.connected[sessionData.dictator.userId].emit('assignDictator', 'for your eyes only');
         console.log('DICTATOR ACCORDING TO OBJECT', sessionData.dictator.userId)
         console.log('ALLDATA', sessionData)
       }
    }

  });
};
