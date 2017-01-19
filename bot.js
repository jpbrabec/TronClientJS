require('dotenv').config();
var http = require('http');
var net = require('net');
var incomingData = ""; //Partial messages coming through socket

var SECRET = process.env.SECRET; //TODO- Set your password key in .env


//TCP Socket Server for bots
var client = net.Socket();
client.connect(8080,'localhost', () => {
    console.log("Connected to server");
});

client.on('data', function(data) {
  incomingData += data.toString().replace("\n",""); //Strip newlines
  while(true) {
    var pos = incomingData.indexOf(";");
    if(pos >= 0) {
      var message = incomingData.substring(0,pos);
      incomingData = incomingData.substring(pos+1);
      handleMessage(message);
    } else {
      break;
    }
  }
});

client.on('close', function() {
	console.log('Connection closed');
});

//Handle incoming messages from the server
function handleMessage(message) {
  console.log("Handling message <" + message + ">");
  switch(message) {
    //Authenticate with server
    case "REQUEST_KEY":
      sendMessage("AUTH " + SECRET);
      break;

    //Server accepted our credentials
    case "AUTH_VALID":
      console.log("Connected! Searching for opponent...");
      break;

    //Server rejected our credentials
    case "ERR_AUTH_INVALID":
      console.log("Error! Server rejected our credentials.\nRe-check your key. Is <" + SECRET + "> correct?");
      client.destroy();
      break;

    default:
      console.log("Unknown Command <" + message + ">");
      break;
  }
}

//Send a message to the server
function sendMessage(message) {
  if(!client) {
    console.log("Error! Client is not alive");
    return;
  }
  client.write(message +";");
}


function selectMove(boardState) {
  return myMove; //UP DOWN LEFT or RIGHT
}
