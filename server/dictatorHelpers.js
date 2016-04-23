var sessionData = require('./sessionData.js');
var _ = require('underscore');
module.exports = {

  updateCurrentMood: (callback, cb) => {
  // console.log('inside update')
  //   var moodArray = _.pluck(sessionData.userData, 'mood');
  //   var aggregateMood = _.reduce(moodArray, function(memo, num){ return memo + num; }, 0);
    this.getTemperature(aggregateMood, sessionData.userData.length, callback, cb);
  },

  getTemperature: (aggregateMood, numUsers, callback, cb) => {
    console.log('inside temp')
    sessionData.temperature = Math.floor((aggregateMood/sessionData.userData.length) * 100);
    callback()

    if ((sessionData.temperature) < 40 ) {
      _.each(sessionData.userData, function(person) {
            person.mood = 1;
            console.log(person)
        });
        sessionData.temperature = 100;

        // this.newDictator(cb);
        callback()
        ///////////////////
    }
  },

  newDictator: (callback) => {
    console.log(callback)
    var newDictator = sessionData.userData[Math.floor(Math.random() * sessionData.userData.length)];
    sessionData.dictator = newDictator;
     callback()

       console.log('DICTATOR ACCORDING TO OBJECT', sessionData.dictator.userId)
       console.log('ALLDATA', sessionData)

  }
};
