const crudfs	= require('./crudfs.js');

// const debug	= require('./config.json').debug;
const debug = true;

const idxFile	= './data/indices.csv';

const ptsFile	= './data/points.csv';


const TAG	= 0;
const POINTS	= 1;
const INV	= 2;


async function main() {

	await addTag('abcdefg');
	await setPoints('abcdefg', 100);
	await givePoints('abcdefg', 1);

}

if (debug) main();

async function addTag(tag) {

	log(`creating user ${tag}`);


	var lineInfo;

	lineInfo = await getLineInfo(idxFile, tag); // async call

	// if tag found
	if (lineInfo.lineNumber !== -1)
		return false;
	
	
	// create entry in ptsFile
	crudfs.createLine(
		ptsFile,
		`${tag},0,{}`
	);


	// find line number in ptsFile
	lineInfo = await getLineInfo(ptsFile, tag); // async call

	// create entry in idxFile
	crudfs.createLine(
		idxFile,
		`${tag},${lineInfo.lineNumber}`
	);
}


async function setPoints(tag, value) {
	
	log(`setting points of ${tag} to ${value}`);


	var lineInfo;


	// find lineNumber in ptsFile
	let lineNumber = await tagLookup(tag);
	lineNumber = lineNumber.split(',')[1];
	lineNumber = parseInt(lineNumber)

	if (debug) {

		log(`attempting updateLine with\n\tlineNumber: ${lineNumber}\n\tvalue: ${value}`);

	}

	// read line in ptsFile, store in memory:
	let ptsFileTicket = crudfs.readLine(
		ptsFile,
		lineNumber
	);

	let line = await ptsFileTicket.promise;
	line = line.split(',');

	if (typeof(value) != 'function') line[POINTS] = value;
	else line[POINTS] = value(line[POINTS]);

	line = line.join(',');

	// update lineNumber in ptsFile to value
	crudfs.updateLine(
		ptsFile,
		lineNumber,
		line
	);

}

async function givePoints(tag, amt) {

	// lookup tag
	setPoints(tag, num => parseInt(num)+amt)

}

//			|
//   helper functions	|
//			|

function log(s) {
	if (debug) console.log(`[points_system.js]: ${s}`);
}

function getLineInfo(file, value) {
	
	let locationTicket = crudfs.findLine(
		file,
		value
	);

	return locationTicket.promise;
}

async function tagLookup(tag) {

	let lineInfo = await getLineInfo(idxFile, tag);

	return lineInfo.lineValue;

}


exports.givePoints = givePoints
exports.setPoints = setPoints
