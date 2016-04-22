var _ = require('lodash');

var dataMethods = {
  setRemovalInHalfHour: (track, tracks, callback) => {
    setTimeout(() => {
      dataMethods.removeFromStore(track, tracks);
      callback();
    }, 1800000);
  },
  removeFromStore: (itemToRemove, store) => {
    for (var i = 0; i < store.length; i++) {
      if (_.isEqual(store[i], itemToRemove)) {
        store.splice(i, 1);
        return;
      }
    }
  },
  addToStore: (itemToAdd, store) => {
    if (Array.isArray(store)) {
      store.push(itemToAdd);
    } else {
      console.log('we only currently support adding to arrays');
    }
  },

  updateObjPropInStore: (target, store, callback) => {
    for (var i = 0; i < store.length; i++) {
      if (_.isMatch(store[i], target)) {
        callback(store[i])
        break;
      }
    }
  },

  getMood: (store, callback) => {
    var moodArray = _.pluck(store, 'mood');
    var totalMood = _.reduce(moodArray, (memo, num) => memo + num, 0);
    callback(totalMood);
  },

  setTemperature: (store, mood, callback) => {
    var temperature = Math.floor((mood/store.userData.length) * 100);
    store.temperature = temperature;

  },

  isDictatorSafe: (mood) => {
    if (mood > 75) {
      return false;
    } else {
      return true;
    }
  },

  assignDictator: (store) => {
    var index = Math.floor(Math.random() * store.userData.length);
    var newDictator = store.userData[index];
    store.dictator = newDictator;
  },

  resetPlayerMoods: (store) => {
    _.each(store, (player) => {
      player.mood = 0;
    });
  },

};

module.exports = dataMethods;
