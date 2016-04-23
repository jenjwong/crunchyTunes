 var _ = require('lodash');
var socket = require('./websockets.js');
var sessionData = require('./sessionData.js');

var dataMethods = {

  setRemovalInHalfHour: (track, store, callback) => {
    setTimeout(() => {
      dataMethods.removeFromStore(track, store.tracks);
      callback();
    }, 180000);
  },

  removeFromStore: (item, store) => {
    for (var i = 0; i < store.length; i++) {
      if (_.isEqual(store[i], item)) {
        return store.splice(i, 1); 
      }
    }
  },

  addToStore: (item, store) => {
    if(Array.isArray(store)){
      store.push(item);
    } else {
      console.log('Storage is not an array. Arrays are only supported');
    }
  },

  isDictator: (user) => user.isDictator,

  updateProperty: (newValue, property, store) => {
    store[property] = newValue;
  },

  updateObjPropInStore: (target, store, callback) => {
    for (var i = 0; i < store.length; i++) {
      if (_.isMatch(store[i], target)) {
        callback(store[i]);
        break;
      }
    }
  },

  getMoods: (store, callback) => {
    var moodArray = _.map(store, 'mood');
    var totalMood = _.reduce(moodArray, (memo, num) => memo + num, 0);
    callback(totalMood);
  },

  setTemperature: (store, mood) => {
    var temperature = Math.floor((mood / store.userData.length) * 100);
    store.temperature = temperature;
  },

  isDictatorSafe: (mood) => {
    if (mood > 75) {
      return false;
    } else {
      return true;
    }
  },

  assignDictator: (user, store) => {
    var otherUsers = _.without(store.userData, user);
    if (otherUsers.length) {
      var index = Math.floor(Math.random() * otherUsers.length);
      var newDictator = otherUsers[index];
      newDictator.isDictator = true;
      store.dictator = newDictator;
    }
  },

  resetPlayerMoods: (store) => {
    _.each(store, (player) => {
      player.mood = 0;
    });
  },
  InStore:(item, store) => {
    for (var i = 0; i < store.length; i++) {
      if (_.isEqual(store[i], item)) {
        return true; 
      }
    }
    return false;
  },

  addRoomSession: (roomName) => {
    sessionData[roomName] = {
    temperature: 0,
    userData: [],
    tracks: [],
    currentTrack: null,
    room: roomName
    };
  }
};


module.exports = dataMethods;
