const crudfs 	= require('./crudfs.js');
const debug	= require('./config.json').debug;

const indicesFile = './data/indices.csv';
const pointsFile = './data/points.csv';

const TAG = 0;
const POINTS = 1;
const INV = 2;

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
async function givePoints(tag, amount) {

	console.log(tag)
	// search through `indices.csv` and assign `tag`'s
	// index to `usrLineNum`
	crudfs.findLine(indicesFile, tag)
	.then(line => {
	
		// if usrLineNum is defined return usrLineNum

		crudfs.updateLine(pointsFile,
			line.lineNum,
			POINTS,
			curPts => parseInt(curPts, 10) + amount);

	})
	.catch((err, tag) => {
		console.log(err);
		// otherwise create a new entry in `points.csv`,
		// get the line number of that, and store
		// the tag and line number in `indices.csv`	
		crudfs.createLine(pointsFile, `${tag},1,{}`);

		crudfs.findLine(pointsFile, tag)	
		.then(line => {
			crudfs.createLine(
				indicesFile,
				`${tag},${line.lineNum}`);
		});
	});

}

async function setPoints(tag, val) {
	crudfs.findLine(indicesFile, tag)
	.then(line => {
		crudfs.updateLine(
			pointsFile,
			line.lineNum,
			POINTS,
			curVal => val);
	})
	.catch((err, tag) => {
		// otherwise create a new entry in `points.csv`,
		// get the line number of that, and store
		// the tag and line number in `indices.csv`	
		crudfs.createLine(pointsFile, `${tag},1,{}`);

		crudfs.findLine(pointsFile, tag)	
		.then(line => {
			crudfs.createLine(
				indicesFile,
				`${tag},${line.lineNum}`);
		});
	});
}

// return the points from a user
// TODO thsi wont work???
async function getPoints(tag) {
	
	let indexSearch = await crudfs.findLine(indicesFile, tag);
	let lineNum = indexSearch.lineNum;

	let line = await crudfs.readLine(pointsFile, lineNum)
		.then(line => {
			let points = line.split(',')[POINTS];
			return points;
		})
		.catch(err => {
			console.log("there was an error finding the line");
		});

	console.log(line);
	return line;
}


function newUser(err) {

	crudfs.createLine(pointsFile, `${tag},1,{}`);

	crudfs.findLine(pointsFile, tag)	
	.then(line => {
		crudfs.createLine(
			indicesFile,
			`${tag},${line.lineNum}`);
	});
}


if (debug)
	console.log(getPoints("ChimpGimp#8041"));


exports.givePoints	= givePoints;
exports.setPoints	= setPoints;
exports.getPoints	= getPoints;
