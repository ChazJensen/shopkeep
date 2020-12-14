const fs = require('./crudfs.js');
const ps = require('./points_system.js');
const im = require('./inventory_manager.js');

// to toggle debug mode per file, insert `/*` right after = in the next line
const debug = require('../config.json').debug;


const INVFILE = tag => `../data/inventory/${tag}.json`;
const IDXFILE = '../data/indices.csv';
const PTSFILE = '../data/points.csv';



async function addUser(tag) {

	log(`addUser: tag: ${tag}, attempting to add tag to ${IDXFILE}`);

	await ps.addTag(tag)

	if (!ps.inSystem(tag))
		throw Error(`error creating user ${tag} in points system!`);

	let fileExists = await fs.exists(INVFILE(tag));


	log(`addUser: fs.exists call: ${ fileExists }`);

	log(`addUser: ${INVFILE(tag)} ${ fileExists ? 'does' : 'doesn\'t'} exist`);

	if (!fileExists) {
		log(`addUser: file doesn't exist, creating new file now`);
		log(`addUser: creating inventory for ${tag} at ${INVFILE(tag)}`);

		await im.createInventory(tag)

		fileExists = await fs.exists(INVFILE(tag));

		if (fileExists)
			throw Error(`error creating user ${tag} inventory!`);
	}

}

async function getUser(tag) {

}


function log(s) {
	console.log(`[user_manager.js] ${s}`);
}

exports.addUser = addUser;
