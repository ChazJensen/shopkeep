const ps = require('../points_system.js');
const conf = require('../config.json');

const debug = conf.debug;


module.exports = {
	name: 'points',
	desc: 'tell invoker amount of points they have and delete after a couple of seconds',
	execute(msg, args) {
		if (debug) {
			console.log(msg.author.tag);
			console.log(ps.getPoints(msg.author.tag));
		}
		msg.reply(`has ${ps.getPoints(msg.author.tag)} points`)
			.then(msg => {msg.delete({ timeout: 3000 });});
		msg.delete();
	}
};
