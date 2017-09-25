var TwitterPackage = require('twitter');
//provide access to your Twitter bot
var secret = {
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
}

//make a new twitter object
var Twitter = new TwitterPackage(secret);

// Call the stream function and pass in 'statuses/filter', our filter object, and our callback

Twitter.stream('statuses/filter', {track: '#hipeacebot'}, function(stream) {

  stream.on('data', function(tweet) {
    // Detect sentiment of the message and retweet the positive message
    var sentiment = require('sentiment');
    var r1 = sentiment(tweet.text);
    console.log(tweet.text);
    // If the sentiment is positive retweet the message.
    if(r1 > 0 ) {
      Twitter.post('statuses/update', {status: tweet.text}, function(error, tweets, response) {
        if(error) {
          console.log(error);
        }
      });
    }
    // If the sentiment is negative reply with a random joke from one-liner-joke library. Limitations missing! we don't want a spam.
    else {
      var jokes = require('one-liner-joke');
      var getRandomJoke = jokes.getRandomJoke();
      var all = JSON.stringify(getRandomJoke);
      var allArray = all.split(":");
      var final = allArray[1].split('"');
      Twitter.post('statuses/update', {status: final[1]}, function(error, tweets, response) {
        if(error) {
          console.log(error);
        }
      });
    }
    stream.on('error', function(error) {
      console.log(error);
    });
  });
});
