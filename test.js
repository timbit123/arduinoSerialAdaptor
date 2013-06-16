var Arduino = require('./index.js');
var arduino = new Arduino("/dev/ttyACM0");

arduino.startSensorStream();

arduino.sensorStream.on('data', function(data) {
	console.log(data);
});

arduino.sensorStream.on('sensor', function(values)
{
	console.log(values);
});


setTimeout(function() {
	arduino.activateSensorValues();
	setTimeout(function(){
		arduino.deactivateSensorValues();
	},5000);
}, 2000);

