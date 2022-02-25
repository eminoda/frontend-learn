'use strict'
const http = require('https')
const socketHelper = require('./socket')
const fs = require('fs')
const app = require('./app')

/**Z
 * Create HTTP server.
 */
const server = http.createServer(
	{
		cert: fs.readFileSync('./server.cert'),
		key: fs.readFileSync('./server.key'),
	},
	app
)
// const server = http.createServer(app)
socketHelper(server)
/**πP
 * Listen on provided port, on all network interfaces.
 */
server.listen(3000)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error
	}

	const bind = 'Port ' + 3000

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges')
			process.exit(1)
		case 'EADDRINUSE':
			console.error(bind + ' is already in use')
			process.exit(1)
		default:
			throw error
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	console.log(`socket-room-demo 服务已启动`)
}
