var SerialPort = require('serialport2').SerialPort;
var util = require('util');
var events = require('events');
var serial;
var state;
function Arduino(port) {
	serial = new SerialPort();
	state = "";
	this.sensorStream = new events.EventEmitter();

	var self = this;
	var theString = "";
	serial.on('data', function(data) {
		theString += data.toString();
		
		if (theString.indexOf('\n') != -1) {
			var split = theString.split('\n'); 
			var line = split[0];
			theString = split[1];
			
			//sensors values
			if (line.charAt(0) == 'i') {
				line = line.substring(1, line.length - 2);
				self.sensorStream.emit('sensor', line.split(','));
			}
			//Motor Armed
			else if(line.charAt(0) == 'A'){
				self.sensorStream.emit('motorArmed', line.charAt(1) == '1');
			}
			
			//Motor value message
			else if(line.charAt(0) == 'M')
			{
				self.sensorStream.emit('message' line.substring(1, line.length - 1));
			}

	});

	serial.on('error', function(err) {
		console.log(err);
	});
	serial.open(port, {
		baudRate : 115200,
		dataBits : 8
	}, function(err) {
		err != null ? this.status = err : this.status = "Connected";
	});

}

Arduino.prototype.activateSensorValues = function() {
	serial.write('i');
}
Arduino.prototype.deactivateSensorValues = function() {
	serial.write('x');
}

Arduino.prototype.armMotor = function()
{
	serial.write('A1');
}

Arduino.prototype.dearmMotor = function()
{
	serial.write('A0');
}

Arduino.prototype.sendMotorValues = function(values) {
	serial.write('M' + values.join(';'));
}
module.exports = Arduino;
