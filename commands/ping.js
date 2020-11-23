const dd = require('./delaydelete.js').dd;

module.exports = {
	name: 'ping',
	desc: 'ping',
	execute(msg, args) {
		msg.delete();
		dd(msg, 'pong');
	}
};
