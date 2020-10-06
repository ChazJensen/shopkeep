const fs = require('fs');

const debug = false;
/* Parameters:
 * - file: path to file to write to
 * - values: line to write to file
 *
 * Returns:
 *   int: line number corresponding to
 *        the new line created in a file
 *
 * Description
 *   create an entry in a `file` with values
 *   held in `values` by appending `values`
 *   to `file` using fs
 */
function createLine(file, values) {
	let estimatedIndex = getRows(file).length;

	let fileConts = fs.readFileSync(file)
		.toString()
	fileConts += values;

	fs.writeFile(file, fileConts, (err) => {
		if (err) throw(err);
	});

	return estimatedIndex;
}


/* Parameters:
 * - file: path to file to read
 * - tag: first value of all rows in file
 * 
 * Returns:
 *   Object obj:
 *     obj.lineIndex
 *     obj.contents
 *
 * Description:
 *   find a uniqVal (first value of a row)
 *   in a file. return an object containing
 *   line index and contents of the line.
 *   crash if uniqVal has no coresponding val
 *   in file
 */

function readLine(file, uniqVal) {
	let rows = getRows(file);
	let out = {};

	// look for uniqVal in rows
	for (i in rows) {
		if (rows[i].split(',')[0] === uniqVal)
			out.lineIndex = i;
	}
	
	// crash if out.index is not defined
	if (out.lineIndex === undefined)
		throw new Error(uniqVal + ' was not found in ' + file);

	out.contents = rows[out.lineIndex];

	// out: // fields
	//   lineIndex
	//   contents
	return out;
}


/* Parameters:
 * - file: path to file to update
 * - lineNum: index of line to update
 * - values: line of values to update
 * 
 * Returns:
 * - true if line was found
 * - false if line was not found
 *
 * Description:
 *   O(n) = 1 at top level
 *   O(n) = 1 + 2n at lower level
 */
function updateLine(file, lineNum, values) {
	let rows = getRows(file);

	rows[lineNum] = values;

	let contents = rows.join('\n');

	try {
		fs.writeFileSync(file, contents);
		return true;
	} catch (err) {
		if (debug)
			console.error(err);
	}

	return false;

}


function destroyLine() {
	throw new Error('destroyLine is not implemented yet!');
}

/* Parameter:
 * - file: path to file to get rows from
 *
 * Returns:
 *   string[] containing file's rows,
 *   1 row per index.
 */
function getRows(file) {
	let contents = fs.readFileSync(file);
	
	if (debug)
		console.log(contents);
	contents = contents.toString().split('\n');
	
	if (debug)
		console.log(contents);

	return contents;
}

exports.createLine	= createLine;
exports.getRows		= getRows;
exports.readLine	= readLine;
exports.updateLine	= updateLine;
exports.destroyLine	= destroyLine
