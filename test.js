var Arduino = require('./index.js');
var arduino = new Arduino("/dev/ttyACM0");
var Datagram = require('./dataGram.js');
var datagram = new Datagram();
arduino.sensorStream.on('data', function(data) {
	console.log(data);
});
/*
arduino.sensorStream.on('message', function(message) {
	console.log(message);
	if (message == "OK") {
		setTimeout(function() {
			arduino.armMotor();
		}, 2000);
	}
});

arduino.sensorStream.on('motorArmed', function(bool) {
	if (bool) {
		console.log("Motor Armed!");
		arduino.sendMotorValues([1050, 1050, 1050, 1050]);
		setTimeout(function() {
			arduino.sendMotorValues([1000, 1000, 1000, 1000]);
		}, 10000);
	}
});

arduino.sensorStream.on('sensor', function(values) {
	console.log(values);
});
*/ 
datagram.on('data', function(data)
{
	arduino.sendReceiverCommands([data.X, data.Y, data.Z, data.T]);
});
