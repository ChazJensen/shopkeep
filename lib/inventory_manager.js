const debug = require('../config.json');

const fs = require('./crudfs.js');



let INVFILE = tag => `./data/inventory/${tag}.json`;


function Inventory(tag = 'null') {
	
	this.obj = {};

	this.tag = tag;
	this.path = INVFILE(this.tag);

	this.getData = async () => {

		let dataString = await fs.readFile(this.path);

		log(`Inventory Constructor: readFile result: ${dataString}`);

		this.obj = JSON.parse( dataString );

	}

	this.addItem = (itemObj) => {

		if (!itemObj.name)
			itemObj.name = 'youForgotTheName';

		this.obj[itemObj.name] = itemObj;

	}
	
	this.toString = () => JSON.stringify(this.obj);

	this.getData();

	return this;
}


async function createInventory(tag) {

	let iFile = INVFILE(tag);

	let inventory = new Inventory(tag);

	log(`createInventory: ${typeof inventory.toString()}`);

	fs.writeFile(iFile, inventory.toString());

	return fs.exists(iFile);

}

function getInventory(tag) {

	let iFile = INVFILE(tag);

	let inventory = new Inventory(tag);

	return inventory

}



function log(s) {
	console.log(`[inventory_manager.js]: ${s}`);
}



exports.createInventory = createInventory;
