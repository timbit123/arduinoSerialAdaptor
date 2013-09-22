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

		if (theString.indexOf('\r\n') != -1) {
			var split = theString.split('\r\n');
			parseString(self, split[0]);
			if (split.length == 3) {
				parseString(self, split[1]);
				theString = "";
			} else {
				theString = split[1];
			}
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
};
Arduino.prototype.deactivateSensorValues = function() {
	serial.write('x');
};

Arduino.prototype.armMotor = function() {
	serial.write('A1');
};

Arduino.prototype.dearmMotor = function() {
	serial.write('A0');
};

Arduino.prototype.sendMotorValues = function(values) {

	serial.write('M' + values.join(';') + ";");
};

Arduino.prototype.sendReceiverCommands = function(values)
{
	serial.write('R'+ values.join(';') + ';');
};

Arduino.prototype.sendCalibration = function() {
	serial.write('C');
};
Arduino.prototype.sendPulse = function(nbPulse) {
	serial.write('P' + nbPulse +";");
};
function parseString(arduino, text) {
	//sensors values
	if (text.charAt(0) == 'i') {
		text = text.substring(1, text.length - 1);
		arduino.sensorStream.emit('sensor', text.split(','));
	}
	//Motor Armed
	else if (text.charAt(0) == 'A') {
		arduino.sensorStream.emit('motorArmed', text.charAt(1) == '1');
	}

	//Motor value message
	else if (text.charAt(0) == 'M') {
		arduino.sensorStream.emit('message', text.substring(1, text.length));
	}

}

module.exports = Arduino;
