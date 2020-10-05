const Discord	= require('discord.js');
const fs	= require('fs');
const ps	= require('./points_system.js');

const client = new Discord.Client();

client.once('ready', () => {
	console.log(`signed in as ${client.user.tag}`);
});



const logChat = true;

client.on('message', msg => {
	let tag = msg.author.tag;

	if (msg.content == 'ping')
		msg.reply('pong');

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
