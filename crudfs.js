const fs = require('fs');

const readline = require('readline');


const queue = require('./queue.js');


const fileQ = queue.Queue();

const debug = false;

async function main() {


	let create = queueFileAccess(
		createLine,
		'./foo', 'hello from main (through queue)!'
	);

	queueFileAccess(
		createLine,
		'./foo', 'this one will be here!'
	);

	let find = queueFileAccess(
		findLine,
		'./foo', 'hello'
	);

	let read = queueFileAccess(
		readLine,
		'./foo', 0
	);

	let update = queueFileAccess(
		updateLine,
		'./foo', 1, 'abcdefg'
	);

	let del = queueFileAccess(
		deleteLine,
		'./foo', 0
	);

	fileQ.start();

	console.log(await create.promise);
	console.log(await find.promise);
	console.log(await read.promise);
	console.log(await update.promise);
	console.log(await del.promise);
}

if (debug) main();



// CREATE

/* 
 *
/**/
function createLine(file, line) {

	let writer = fs.createWriteStream(
		file, 
		{flags: 'a'}
	);

			
	writer.write(`${line}\n`);

			
	return true;

}

async function findLine(file, uniqVal) {

	let readStream = fs.createReadStream(file);

	let newlines = 0;

	let lineValue = '';


	readStream.on('data', chunk => {

		if (lineValue != '') return;


		let rows = chunk.toString().split('\n');

		for (let i in rows) {

			if (lineValue.length != 0)
				continue;

		
			if (rows[i].startsWith(uniqVal))
				lineValue = rows[i]


			newlines++;

		}

	});

	return await new Promise(
		(res, rej) => {

			readStream.on('end', () => {

				if (lineValue === '')
					rej('name not found in file');			
				
				res({
					lineNum: newlines,
					lineVal: lineValue
				});
			});

		}
	);

}

async function readLine(file, row) { 

	if (debug && typeof row != 'number')
		log('readLine: row is not a number');

	return await new Promise(
	(resolve, reject) => {

		let readStream = fs.createReadStream(file);

		let lineCount = 0;

		let newline = '\n'.charCodeAt(0);

		let complete = false;

		if (debug) log(`readLine: newline char = ${newline}`);


		readStream.on(
			'data',
			chunk => {

				if (complete) return;

				let chunkLineCount = 0;

				if (debug) log(`readLine: ${lineCount === row}`);
				
				for (let i of chunk) {

					if (debug) log(`readLine: ${i}`);

					if (i === newline)
						chunkLineCount++

					if (lineCount + chunkLineCount === row) {

						if (debug) log(`readLine: should resolve soon`);

						complete = true;

						let rows = chunk.toString().split('\n');

						resolve(rows[chunkLineCount]);

						break;

					}
				}

				lineCount += chunkLineCount;


			}
		);

		readStream.on(
			'end',
			() => {
			
				if (!complete) {

					log('readLine [WARN]: the file is too short!');

					reject('this file is too short!');
				}

			}
		);


	});

}


function updateLine(file, lineNumber, newValue) {

	// TODO: implement error checking
	return new Promise( (resolve, reject) => {

		const LineStepper = createLineStepper(file);

		let writeStream = fs.createWriteStream(`${file}.swp`);

		let lineCount = 0;

	
		LineStepper.on(
			'line',
			line => {
				if (debug) log(`lineStepper: ${line}`);

				if (lineCount === lineNumber) 
					line = newValue;

				writeStream.write(`${line}\n`);

				lineCount++;

			}
		);

		LineStepper.on('end', resolve(true))

	});

}


function deleteLine(file, lineNumber) {

	return new Promise( (resolve, reject) => {

		const LineStepper = createLineStepper(file);

		let writeStream = fs.createWriteStream(`${file}.swp`);

		let lineCount = 0;

		
		LineStepper.on(
			'line',
			line => {

				if (debug) log(`deleteLine: ${line}`);


				if (lineCount !== lineNumber)
					writeStream.write(`${line}\n`);

				else if (debug) log(`deleteLine: deleting line ${lineCount}:${line}`);

				lineCount++;

			}
		);

		LineStepper.on('end', resolve(true));

	});

}



function queueFileAccess(func, ...params) {
	
	// this returns func's return from the ticket's promise
	let ticket = fileQ.add( () => func(...params) );

	ticket.promise.catch(
		err => { console.warn(err); }
	);

	
	return ticket;
}

function saveSwapFile(file) {

	if (fs.existsSync(`${file}.swp`)) {

		fs.rename(
			`${file}.swp`,
			file,
			() => {

				if (debug) log('SaveSwapFile: save successful!');

			}
		);

	}

}

function createLineStepper(file) {

	let stepper = readline.createInterface({
		input: fs.createReadStream(file),
		output: null,
		terminal: false
	});

	stepper.on(
		'close',
		() => saveSwapFile(file)
	);


	return stepper;

}



function log(s) {
	console.log(`{crudfs.js]: ${s}`);
}


exports.createLine = (file, line) => queueFileAccess(
	createLine, file, line);

exports.findLine = (file, key) => queueFileAccess(
	findLine, file, key);

exports.readLine = (file, lineNumber) => queueFileAccess(
	readLine, file, lineNumber);

exports.updateLine = (file, lineNumber, value) => queueFileAccess(
	updateLine, file, lineNumber, value);

exports.deleteLine = (file, lineNumber) => queueFileAccess(
	deleteLine, file, lineNumber);
