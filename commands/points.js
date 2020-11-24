const ps = require('../points_system.js');
const conf = require('../config.json');

const dd = require('./delaydelete.js').dd;

const debug = conf.debug;

function isTag(s) {
	return RegExp('[A-Za-z]+#[0-9]+').test(s);
}

module.exports = {
	name: 'points',
	desc: 'tell invoker amount of points they have and delete after a couple of seconds',
	async execute(msg, args) {

		

		if (debug)
			console.log(msg.author.tag);

		let response = '';
		let tag;

		if (args.length === 0) {
			dd(msg, `has ${await ps.getPoints(msg.author.tag)} points`);
			msg.delete();
			return;
		}

		console.log(args[0]);
		if (debug || true)
			console.log(isTag(args[0]));

		if (isTag(args[0])) {
			tag = args.shift();
		}

		tag = (tag === undefined) ? msg.author.tag : tag;

		if (debug || true)
			console.log(`args: ${args}\ntag: ${tag}`);

		switch (args[0]) {
			case 'set':
				ps.setPoints(tag, args[1]);
				response = `set points to ${args[1]}`;
			break;
			case 'add':
				ps.givePoints(tag, args[1]);
				response = `added ${args[1]} points`;
			break;
			case 'remove':
				ps.givePoints(tag, -args[1]);
				response = `removed ${args[1]} points`;
			break;
		}
		
		
		if (response.length === 0)
			response = 'something may have gone wrong';

		dd(msg, response);
		msg.delete();
	}
};


