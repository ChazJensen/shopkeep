module.exports = {
	name: 'ping',
	desc: 'ping',
	execute(msg, args) {
		let m = msg;
		msg.delete();
		msg.channel.send('pong')
			.then(msg => { msg.delete({ timeout: 3000 })} )
			.catch(err => { console.error(error); });
	}
};
