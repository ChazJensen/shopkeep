const codeblock = require('./codeblock.js').codeblock;




module.exports = {
	name: 'shop',
	desc: 'shop is supposed to have a shop for each channel of an rp server',
	execute(msg, args) {
		let channel = msg.channel;
		msg.delete();
		let response = `This is the shop for ${channel}
		${codeblock(`Menu:
  - ${"ale"}_________${5} sp
  - ${"item 1"}_____${50} gp
  - ${"item 2"}____${150} gp
  - ${"item 3"}____${500} gp`)}`;

		channel.send(response)
			.then(msg => { msg.delete({ timeout: 3000 }) }) ;
	}
};
