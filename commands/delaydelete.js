exports.dd = (msg, content) => {
	msg.channel.send(content)
		.then(msg => { msg.delete({ timeout: 3000 })} )
		.catch(err => { console.error(err); });
}

