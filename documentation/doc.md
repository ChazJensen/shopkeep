
# crudfs.js

---


## Outline

Calls to a `queue.js/Queue` to edit files in such a
way that no two edits happen at once.


	- [createLine](#createLine)
	- [findLine](#findLine)
	- [readLine](#readLine)
	- [updateLine](#updateLine)
	- [deleteLine](#deleteLine)


---


## createLine

---

## findLine

---

## readLine

---

## updateLine

---

## deleteLine

---

eof
# points_sytem.js

---


## Overview

`points_system.js` is for keepking track of points
via a discord bot. It may have other uses, but I can't
think of anything at the moment

	- [addTag](#addTag)
	- [setPoints](#setPoints)
	- [givePoints](#setPoints)
	- [getPoints](#getPoints)

---

## addTag

---

## setPoints

---

## givePoints

---

## getPoints

eof
# queue.js

---


# Outline


`queue.js` sequences function calls. A program needs to call the `Queue`
constructor and store the return value for the queue (stored in `queue`
for examples in this documentation). Then, whenever the program wants
to sequence a bunch of functions to execute in order, it stores the result
of `queue.add(func)` where `func` is the function it wants to queue.

The `queue.add(func)` call will return a `QueueTicket`. The ticket has
a place in `queue.queue`, `queueSpot`, that gets updated when it moves up
in the queue. When `queueSpot` reaches 0, `func` is allowed to execute.
`QueueTicket` stores the function wrapped in a promise, `ticket.promise`,
that only starts execution once `queueSpot` is zero. After `queueSpot`
hits 0, the promise will evaluate and store the return value where the
promise initially was, `ticket.promise`.


- [Queue](#Queue)
- [QueueTicket](#QueueTicket)

---


## Queue

A constructor function, returning a Queue Object, `Queue`.

	- Queue.queue
	- Queue.pid
	- Queue.QUEUE_LIMIT
	- Queue.add
	- Queue.finishTicket
	- Queue.updateQueue
	- Queue.clearQueue
	- Queue.startProcessing
	- Queue.start
	- Queue.stopProcessing
	- Queue.stop
	- Queue.processing
	- Queue.blink


---


## QueueTicket

A constructor function, returning QueueTicket Object, `QueueTicket`.

	- QueueTicket.promise
	- QueueTicket.clear
	- QueueTicket.processed
	- QueueTicket.task
	- QueueTicket.queueSpot

---

eof