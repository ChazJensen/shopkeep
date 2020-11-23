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
function findLine(file, uniqVal) {
	let readStream = fs.createReadStream(file);
	let complete = false;
	let newlines = 0;
	let lineValue = "";
	
	readStream.on('data', (chunk) => {

		if (complete)
			return;

		let rows = chunk.toString().split('\n');

		for(let i in rows) {
			if (rows[i].startsWith(uniqVal)) {

				complete = true;
				lineValue = rows[i];
				
				break;
			}
			newlines++;
		}
	});/**/
	
	return new Promise((resolve, reject) => {
		readStream.on('end', () => {

			if (!complete) {
			
				if (debug)
					log("[WARN] findLine[75] Promise[100]: name not found in file");
				
				reject("name not found in file");

			} else {

				resolve({
					lineNum: newlines,
					lineVal: lineValue
				});

			}
		});
	});

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
function readLine(file, lineNumber) {
	if (debug && typeof lineNumber != 'number')
		log("readLine[142]: lineNumber is not a number");

	return new Promise((resolve, reject) => {
	
		let readStream = fs.createReadStream(file);
		let newlines = 0;
		let newline = '\n'.charCodeAt(0);
		let complete = false;

		var row;

		readStream.on('data', chunk => {

			if (complete)
				return;

			let chunkNewlines = 0;
			for (var i = 0; i < chunk.length; i++) {
				if (debug)
					log(`readLine[142]: ${chunk[i]} : ${String.fromCharCode(chunk[i])}`);

				if (chunk[i] === newline) {
					
					if (debug)
						log('readLine[142]: newline found' + `(${newlines + chunkNewlines}/${lineNumber})`);

					chunkNewlines++;
				}

				if (newlines + chunkNewlines === lineNumber) {
					let rows = chunk.toString().split('\n');
					log("readLine[142]: resolving promise");
					resolve(rows[chunkNewlines]);
					break;
				}

			}

			newlines += chunkNewlines;
		});


		if (debug)
			log(row);
		readStream.on('end', () => reject() );
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
			log("updateLine[219] (lineStepper cb): " + line);

		if (lineCnt === lineNum) {
			let vals = line.split(',');
			let t = typeof newValue;

			if (debug)
				log("updateLine[219]: " + t);
	

			if (t != "function" && t != "object")
				vals[valToUpdate] = newValue;
			else if (t === "function")
				vals[valToUpdate] = newValue(vals[valToUpdate]);
			else
				log(`updateLine[219]: type ${t} unsupported in crudfs.updateLine`);
			

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
			log("destroyLine[277] (lineStepper cb): " + line);

		if (linecnt !== lineNum) {
			writeStream.write(line + '\n');
		} else {
			log(`destroyLine[277] (lineStepper cb): ommiting: [${linecnt}] ${line}`);
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
		if (debug)
			log("renameAndFinishEdit[316]: edit successful, saving edit");
	});
}

function log(str) {
	console.log(`crudfs ${str}`);
}
exports.createLine	= createLine;
exports.findLine	= findLine;
exports.readLine	= readLine;
exports.updateLine	= updateLine;
exports.destroyLine	= destroyLine;

if (debug)
	main();
