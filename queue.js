const fs = require('fs');

const readline = require('readline');


// const config = require('./config.json');

// const debug = config.debug;
const debug = true;



function Queue() {
	
	const q = {};

	q.queue = [];

	q.pid = -1;

	q.QUEUE_LIMIT = 16;

	/* add takes a function to queue and generates
	/* a promise ticket, putting it at the end of 
	/* the queue and giving it back to the caller
	/*/
	q.add = (cb) => {

		let callback = (typeof(cb) == 'function')
			? cb
			: () => { return cb; };

		let queueSpot = q.queue.length;

		
		let ticket = new QueueTicket(
			callback,
			queueSpot
		);

		
		q.queue.push( ticket );

		return q.queue[q.queue.length - 1];

	};

	q.finishTicket = () => {

		if (q.queue[0] && q.queue[0].processed)
			q.queue.shift();
		else
			q.stopProcessing();

		q.updateQueue()

	};

	q.updateQueue = () => {

		for (let i = 0; i < q.queue.length; i++)
			q.queue[i].queueSpot = i;
	};


	q.startProcessing = () => {
	
		if (q.pid === -1)
			q.pid = setInterval(q.finishTicket, 100)
	
	};

	q.start = q.startProcessing;

	q.stopProcessing = () => {

		if (q.pid != -1) clearInterval(q.pid);

		q.pid = -1;

	};

	q.stop = q.stopProcessing;




	return q;
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

	);

	ticket.processed = false;

	ticket.queueSpot = queueNumber;

	ticket.task = callback;

	ticket.output = {};


	return ticket;

}

/*psuedo code/documentation*/
function Action() {

}


// testing
if (debug) main();


async function main() {

	let foo = new Queue();

	let out = [];

	out[0] = foo.add('processing');
	out[1] = foo.add('more');
	out[2] = foo.add('than');
	out[3] = foo.add('one');
	out[4] = foo.add('thing');
	out[5] = foo.add('at');
	out[6] = foo.add('a');
	out[7] = foo.add('time');

	foo.start();
	setTimeout(foo.stop, 1000);

	for (let i in out)
		console.log(await out[i].promise);


}
