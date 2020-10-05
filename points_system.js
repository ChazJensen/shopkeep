const crudfs = require('./crudfs.js');

const indicesFile = './data/indices.csv';
const pointsFile = './data/points.csv';

const debug = false;
/* Parameters:
 * - tag: discord.js user.tag will be unique
 *
 * Returns:
 *   `true` if point awarded
 *   `false` if point was not awarded
 *
 * Description:
 *   search through `indices.csv` to find user's
 *   line number: if found, return the line number
 *   otherwise create a new entry into `points.csv`
 *   and get the line number and save it along with
 *   `tag` into `indices.csv
 *
 */
function givePoint(tag) {
	let awarded = false;
	let usrLineNum;


	// search through `indices.csv` and assign `tag`'s
	// index to `usrLineNum`
	try {
		usrLineNum = crudfs.readLine(indicesFile, tag).lineIndex;

		let rows = crudfs.getRows(pointsFile);
		let row = rows[usrLineNum];
		let vals = row.split(',');

		if (debug)
			console.log(tag + " found!");

		vals[1] = (parseInt(vals[1]) + 1).toString(); 

		let newLine = `${vals[0]},${vals[1]},${vals[2]}`;

		crudfs.updateLine(pointsFile, usrLineNum, newLine);
	}
	// if tag is not in indices.csv
	catch (err) {
		
		if (debug)
			console.error(err);

		let newLine = `${tag},1,{}\n`;

		usrLineNum = crudfs.createLine(pointsFile, newLine);
		
		crudfs.createLine(indicesFile, `${tag},${usrLineNum}\n`);

	}


	// if usrLineNum is defined return usrLineNum
	// otherwise create a new entry in `points.csv`,
	// get the line number of that, and store
	// the tag and line number in `indices.csv`




	return awarded;
}


// return the points from a user
function getPoints(tag) {
	let lineNum = crudfs.readLine(indicesFile, tag).lineIndex;
	
	let rows = crudfs.getRows(pointsFile);

	let row = rows[lineNum];

	let points = row.split(',')[1];

	return points;
}


exports.givePoint	= givePoint;
exports.getPoints	= getPoints;
