
var express = require('express');

// cfenv provides access to your Cloud Foundry environment

var cfenv = require('cfenv');

var app = express();

//Get users speech in the form of text from robot
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

const tone_analyzer = new ToneAnalyzerV3({
  username: 'f0dd5d40-c884-40fc-96dc-1b8908437de5',
  password: 'sliT4RSnd2Pn',
  version_date: '2016-05-19'
});


// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

app.get("/bot", function(req, response) {
  //var question = res.send(req.query.text);
  var userInput = req.query.text;

    //--tone analyzer api
    tone_analyzer.tone({ text: userInput }, function(err, tone) {
      if (err) {
        console.log(err);
      } else {
          var json = JSON.stringify(tone, null, 2);
          response.writeHead(200, {"Content-Type": "application/json"});

          var sarResponse = sarcasm(json);


          if (sarResponse) {
              response.end(sarResponse);
          }
          else {


              response.end(radical(json));

          }
      }
    });
});


function movieAlgorithm(json){
  //--emotion rules to determine what they signify
    var parsedJson = JSON.parse(json);
    return parsedJson.document_tone.tone_categories[0].tones;

}


function sort(json){

    var originalList = movieAlgorithm(json);

    originalList.sort(function(a,b){
        return b.score - a.score
    });
    return originalList

}


function check_joy(list){
    var i = 0;
    for (var tone_id in list){
        if (i < 3) {

            var value = list[tone_id];
            console.log(value.tone_id);
            if (value.tone_id === "joy") {
                return true;

            }
        }i++
    }
    return false;
}

function check_anger_disgust(list) {
    var i = 0;
    for (var tone_id in list) {
        if (i < 3) {

            var value = list[tone_id];
            console.log(value.tone_id);

            if (value.tone_id === "anger" || value.tone_id === "disgust") {
                return true;

            }
        }i++;

    }
    return false;
}

function sarcasm (json) {
    if(check_joy(sort(json))) {
        if(check_anger_disgust(sort(json))) {
            return '{"tone": 5, "text": "Ok captain obvious!"}'

        }else {
            return false
        }
    }
}


function check_top_emotion(list) {
    var i = 0;
    for (var tone_id in list) {
        if (i < 1) {
            var value = list[tone_id];

            return value.tone_id;
        }
        i++
    }

}
/*
var angerData = ["I’m here for you. Let's go to the break room/go for a walk and grab a coffee and you can tell " +
"me what’s going on. I’ve been there, so no judgments.", "You’re understandably upset right now, and I totally get " +
"why. Let’s see if we can figure out how to solve this together.", "Let’s take three deep breaths together.", "Lets just " +
"take a breath. One thing that helps me is a movie, have you seen The Lego Batman Movie ? Its a good one."];


var joy = ["I'm happy to here that, keep on rolling!", "You are awesome, don't stop beliving don't stop being you!", ""];

var sadness = ["I'm so sorry to here that, don't worry, everything is going to be alright!", "That sucks, you'll be fine.", "Aww that sucks you want to talk about it.","Be cool, and do not worry, it will be okay. Let us watch The Body Guard", "Keep going I'm here to listen."]

var disgust = ["That is crazy, it is okay though.", "Why would you say something like that, you are off, maybe watch Grease. It will make you feel better!"];

var none
*/

function radical(json) {
    if (check_top_emotion(sort(json)) === 'anger') {
        return '{"tone": 0, "text": "Lets just take a breath. One thing that helps me is a movie, have you seen The Lego Batman Movie ? Its a good one."}';

    } else if (check_top_emotion(sort(json)) === 'joy') {
        return '{"tone": 3, "text": "Lets have some fun! I am so happy, let us watch The hangover"}';

    } else if (check_top_emotion(sort(json)) === 'sadness') {
        return '{"tone": 4, "text": "Be cool, and do not worry, it will be okay. Let us watch The Body Guard"}';

    } else if (check_top_emotion(sort(json)) === 'disgust') {
        return '{"tone": 1, "text": "Why would you say something like that, you are off, maybe watch Grease. It will make you feel better!"}';

    } else if (check_top_emotion(sort(json)) === 'fear') {
        return '{"tone": 2, "text": "There is nothing to fear but fear itself."}';

    } else {
        return '{"tone": 6, "text": "I do not know how to respond to that, but I hear you. If you are bored, watch Step Brothers!"}';
    }
}


// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
