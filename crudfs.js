const fs = require('fs');
const readline = require('readline');


const config = require('./config.json');

const debug = config.debug;



const fileLocked = {};

function lockFile(file) {
	fileLocked.file = true;
}
function unlockFile(file) {
	fileLocked.file = false;
}
function isFileLocked(file) {
	return fileLocked.file;
}



function main() {
	findLine('foo', 'comma', (out) => {
		readLine('foo', out.lineNumber);
		updateLine('foo', out.lineNumber, 2, 'row');
		// readLine('foo', out.lineNumber);
		destroyLine('foo', out.lineNumber);
		destroyLine('foo', out.lineNumber);
		updateLine('foo', out.lineNumber, 0, 'foobared');
		readLine('foo', out.lineNumber);
	});
}


// CREATE

/* Create Line:
 *
 * create an entry in `file` with
 * values contained in `line` using
 * the WriteStream class from fs
 *
 * Parameters:
 *  - file: path to file to operate on
 *  - line: Buffer/String to write at the end of the file
 */
function createLine(file, line) {
	let writeStream = fs.createWriteStream(file, { flags: 'a' } );
	
	writeStream.write(`\n${line}`);
}


// READ

/* Find Line:
 *
 * find a row in a file based on
 * row's first (unique) value.
 * Return line and index
 *
 * Parameters:
 *  - file: Path to file to operate on
 *  - uniqVal: will be first value in every row for every file
 *  - callback: pass in from a higher-level
 *  		will recieve OBJ described in `Returns`
 *
 * Returns:
 *  - lineNumber
 *  - lineValue
 */
function findLine(file, uniqVal, callback = (val) => { console.log(val); }) {
	let readStream = fs.createReadStream(file);
	let newlines = 0;
	
	readStream.on('data', (chunk) => {

		let rows = chunk.toString().split('\n');

		for(let i in rows) {
			if (rows[i].startsWith(uniqVal)) {

				callback({
						lineNumber: newlines,
						lineValue: rows[i]
				});

				break;
			}
			newlines++;
		}
	});/**/
	

}

/* Read Line:
 * 
 * Have you ever had performance issues
 * by just being generally inefficient?
 * This function reads through a file and
 * only begins processing a chunk after it's
 * found the right line in the file. THAT'S
 * efficiency!
 *
 * Parameters:
 *  - file: string path to file
 *  - lineNumber: line-to-read-in-file(TM)
 *  - callback: takes in values from "Return"
 *  		default logs said values
 *
 * Returns:
 *  - lineContents: content of the line in `file`
 *  		with corresponding line number
 */
function readLine(file, lineNumber, callback = (val) => { console.log(val); } ) {
	let readStream = fs.createReadStream(file);
	let newlines = 0;
	let newline = '\n'.charCodeAt(0);

	readStream.on('data', chunk => {
		let chunkNewlines = 0;
		for (var i = 0; i < chunk.length; i++) {
			if (debug)
				console.log(`${value} : ${String.fromCharCode(value)}`);

			if (chunk[i] === newline)
				chunkNewlines++;

			if (newlines + chunkNewlines === lineNumber) {
				let rows = chunk.toString().split('\n');
				callback(rows[chunkNewlines]);
				break;
			}

		}

		newlines += chunkNewlines;
	});
}

// UPDATE

/* Update Line:
 *
 * Will iterate through all lines in a file
 * in a (memory) efficient manner--stepping.
 * It will modify the line and write to a 
 * temp file in the same directory with same
 * file name with '.tmp' appended to the file
 * name. Will rename the temp file to the 
 * original file name, creating the updated
 * version.
 *
 * Parameters:
 *  - file: path to file to modify
 *  - lineNum: the line number of the row you want to modify
 *  - valToUpdate: index of the value you would like to update
 *  - newValue: the value being updated
 *
 * TODO:
 * 	refactor so newValue is a callback function that does
 * 	any operation on the value to update.
 *
 * Returns:
 * 	NONE
 *
 */
function updateLine(file, lineNum, valToUpdate, newValue) {
	// if file is locked
	if (fileLocked.file){
		// schedule operation another time
		setTimeout(() => {
			updateLine(file, lineNum, valToUpdate, newValue)},
			100
		);
		// break out of function
		return;
	}

	lockFile(file)
	const lineStepper = readline.createInterface({
		input: fs.createReadStream(file),
		output: null,
		terminal: false
	});
	let writeStream = fs.createWriteStream(file + '.tmp');
	let lineCnt = 0;

	lineStepper.on('line', line => {
		if (debug)
			console.log("LS from UPDATE: " + line);

		if (lineCnt === lineNum) {
			let vals = line.split(',');
			vals[valToUpdate] = newValue;
			line = vals.join(',');
		}

		writeStream.write(line + '\n');

		lineCnt++;
	});

	lineStepper.on('close', () => {
		renameAndFinishEdit(file);
		unlockFile(file);
	});
	
}


// DESTROY
function destroyLine(file, lineNum) {
	
	// if file is locked
	if (fileLocked.file) {
		// schedule operation another time
		setTimeout(() => {destroyLine(file, lineNum)}, 100);
		// break out of the function
		return;
	}

	lockFile(file);
	const lineStepper = readline.createInterface({
		input: fs.createReadStream(file),
		output: null,
		terminal: false
	});
	let writeStream = fs.createWriteStream(`${file}.tmp`);
	let linecnt = 0;

	lineStepper.on('line', line => {
		if (debug)
			console.log("LS from DESTROY : " + line);

		if (linecnt !== lineNum) {
			writeStream.write(line + '\n');
		} else {
			console.log(`ommiting: [${linecnt}] ${line}`);
		}

		linecnt++;
	});

	lineStepper.on('close', () => {
		renameAndFinishEdit(file);
		unlockFile(file);
	});

}

function renameAndFinishEdit(file) {
	fs.rename(file + ".tmp", file, () => {
		console.log("edit successful, saving edit");
	});
}

if (debug || true)
	main();
