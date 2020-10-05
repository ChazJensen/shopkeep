const Discord	= require('discord.js');
const fs	= require('fs');
const ps	= require('./points_system.js');

const client = new Discord.Client();

client.once('ready', () => {
	console.log(`signed in as ${client.user.tag}`);
});



const logChat = true;
const prefix = ';';

client.on('message', msg => {
	let tag = msg.author.tag;

	switch(msg.content) {
		case('ping'):
			msg.reply('pong');
			break;
		case(prefix + 'points'):
			// tag's points: ps.getPoints(tag)
			msg.channel.send(
				`${tag} has ${ps.getPoints(tag)} points`);
			break;
	}

	if (logChat)
		console.log(`[MSG] ${tag} in ${msg.channel.name} : ${msg.content}`);

	ps.givePoint(tag);
});





function main() {
	
	let token = fs.readFileSync("../shopkeep_token").toString();
	token = token.slice(0, token.length - 1);

	client.login(token);

}

main();
