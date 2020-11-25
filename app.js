const Discord	= require('discord.js');
const fs	= require('fs');
const ps	= require('./lib/points_system.js');
const config	= require('./config.json');


const debug	= config.debug;
const logChat	= config.logChat;
const prefix	= config.prefix;


const client = new Discord.Client();

client.commands = new Discord.Collection();

client.once('ready', () => {
	console.log(`signed in as ${client.user.tag}`);
});


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// client.commands[commandName] holds a command object
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}




client.on('message', async (msg) => {
	

	if (msg.author.bot)
		return;


	const tag = msg.author.tag;

	console.log(tag);

	await ps.addTag(tag);

	await ps.givePoints(tag, 1);



	if (logChat)
		console.log(`[MSG] ${tag} in ${msg.channel.name} : ${msg.content}`);

	
	
	if (!msg.content.startsWith(prefix))
		return;
	
	const args = msg.content.slice(prefix.length).trim().split(' ');


	const commandName = args.shift().toLowerCase();

	if (debug)
		console.log(commandName);

	// convert userID (pings) to tags
	for (let i = 0; i < args.length; i++) {
		if (RegExp("<@![0-9]+>").test(args[i])) {
			console.log(args[i]);
			console.log(await client.users.fetch(args[i].slice(3,21)));
			let user = await client.users.fetch(args[i].slice(3,21));
			args[i] = `${user.username}#${user.discriminator}`;
		}
	}
	if (debug || true)
		console.log(args);

	if (!client.commands.get(commandName)) {
		msg.channel.send(`${commandName} is not a command!`)
			.then(msg => {msg.delete({ timeout: 1000 })});
		msg.delete();
		return;
	}

	const command = client.commands.get(commandName);

	try {
		if (debug)
			console.log(`attempting to execute ${commandName}`);
		command.execute(msg, args);
	}
	catch (err) {
		console.error(err);
		msg.reply("there was some error executing that command!\nContact ChimpGimp#8041 for more information");
	}



	// end
});





function main() {
	
	let token = fs.readFileSync("../shopkeep_token").toString();
	token = token.slice(0, token.length - 1);

	client.login(token);

}

main();
