var dgram = require("dgram");
var util = require("util");
var events = require("events");
var server = dgram.createSocket("udp4");

function Datagram() {
	events.EventEmitter.call(this);
	var self = this;
	server.on("error", function(err) {
		console.log("server error:\n" + err.stack);
		server.close();
	});

	server.on("message", function(msg, rinfo) {
		self.emit('data', JSON.parse(msg));
		console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
	});

	server.on("listening", function() {
		var address = server.address();
		console.log("server listening " + address.address + ":" + address.port);
	});
	server.bind(4144);
}

util.inherits(Datagram, events.EventEmitter);
module.exports = Datagram;
