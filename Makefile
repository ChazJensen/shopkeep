NODE_FLAGS=--unhandled-rejections=strict

app: app.js
	@node ${NODE_FLAGS} app


points: points_system.js
	@node ${NODE_FLAGS} points_system.js
