const fs	= require('fs');
const um	= require('./lib/user_manager.js');
const config	= require('./config.json');


const debug	= config.debug;
const logChat	= config.logChat;
const prefix	= config.prefix;






function main() {

	msg('hello', 'abcd');

	um.addUser('abcd');
}


var msg = (msg, tag) => {

	// um.givePoint(tag, 1)

	// um.addInventory(tag, {"an": 'item'});

}

main();
