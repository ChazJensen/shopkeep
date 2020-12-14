const fs = require('fs');

const readline = require('readline');


const config = require('../config.json');

const debug = config.debug;



async function main() {

	let foo = new Queue();

	let out = [];

	out[0] = foo.add('processing');
	out[1] = foo.add('more');
	out[2] = foo.add(() => {return true;});
	out[3] = foo.add('one');
	out[4] = foo.add('thing');
	out[5] = foo.add('at');
	out[6] = foo.add('a');
	out[7] = foo.add(function() {console.log('time');return 'off'});

	foo.blink();


	// for (let i in out)
		// console.log(await out[i].promise);

	(async () => { for (let i of out) console.log(await i.promise);})();

	await out[1].promise;

	// for (let i = 0; i < out.length; i++)
		// out[i].queueSpot = -1;
	
	// foo.clearQueue();

	console.log('end');
}

function Queue() {
	
	this.queue = [];

	this.pid = -1;

	this.QUEUE_LIMIT = 16;

	/* add takes a function to queue and generates
	/* a promise ticket, putting it at the end of 
	/* the queue and giving it back to the caller
	/*/
	this.add = (cb) => {


		let callback = (typeof(cb) == 'function')
			? cb
			:() => { return cb; };

		let queueSpot = this.queue.length;

		
		let ticket = new QueueTicket(
			callback,
			queueSpot
		);

		
		this.queue.push( ticket );

		if (!this.processing())
			this.startProcessing();

		return this.queue[this.queue.length - 1];

	};

	this.finishTicket = () => {

		if (!this.queue[0]) this.stopProcessing();

		else if (this.queue[0].processed) this.queue.shift();
		

		this.updateQueue();

	};

	this.updateQueue = () => {

		for (let i = 0; i < this.queue.length; i++)
			this.queue[i].queueSpot = i;

	};

	this.clearQueue = () => {

		if (this.pid != -1) this.stopProcessing();

		for (let i = 0; i < this.queue.length; i++) {

			this.queue[i].clear();

		}

		this.queue = [];

	};


	this.startProcessing = () => {

		log(`processing${this.pid != -1 ? ' was previously' : ''} started`)

		if (this.pid === -1)
			this.pid = setInterval(this.finishTicket, 100)
	
	};

	this.start = this.startProcessing;

	this.stopProcessing = () => {

		log(`processing${(this.pid === -1) ? ' was previously' : ''} stopped`);
		
		if (this.pid != -1) clearInterval(this.pid);

		this.pid = -1;


	};

	this.stop = this.stopProcessing;

	this.processing = () => (this.pid != -1);

	this.blink = (timeout = 1000) => {

		this.start();
	
		setTimeout(this.stop, timeout);

	}



	return this;
}

/*psuedo code/documentation*/
function QueueTicket(callback, queueNumber) {

	const ticket = {};

	ticket.promise = new Promise(

		(resolve, reject) => {

			function checkPlaceInQueue() {

				if (ticket.queueSpot === 0) {

					// start working on task
					resolve();

				} else if (ticket.queueSpot === -1) {
				
					// this means the ticket was cleared
					reject('cleared from queue');

				} else {

					setTimeout(checkPlaceInQueue, 100);

				}

			}

			// start checking for execution
			checkPlaceInQueue();

		}

	)

	// entry point for task execution
	.then(

		() => ticket.task()

	)

	// task execution exits and returns values to this `.then`
	.then(

		// process output of task
		output => {

			ticket.output = output;

			ticket.processed = true;

			return output;
		}

	)

	.catch(

		err => {

			console.log(err);

			ticket.output = err

			ticket.processed = true;

			return err;
		}

	);

	ticket.clear = () => {

		ticket.queueSpot = -1;

	}

	ticket.processed = false;

	ticket.task = callback;

	ticket.queueSpot = queueNumber;

	ticket.output = {};


	return ticket;

}


// testing
// if (debug) main();

function log(s) {
	if (debug) console.log(`[queue.js]: ${s}`);
}

exports.Queue = Queue;
exports.QueueTicket = QueueTicket;
