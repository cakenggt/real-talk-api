const socketClient = require('socket.io-client');
const patch = require('socketio-wildcard')(socketClient.Manager);

class RealTalkAPI {
	constructor (socket) {
		this.socket = socket;
		this.listeners = {
			'MESSAGE_SEND': [],
			'MESSAGE_CHANGE': [],
			'USER_JOIN': [],
			'USER_LEAVE': [],
			'VISIBILITY_CHANGE': []
		};
		this.connections = [];

		this.socket.on('*', (packet) => {
			var event = packet.data[0];
			var data = packet.data[1];
			var list = this.listeners[event];
			if (list){
				for (let i = 0; i < list.length; i++){
					var listener = list[i];
					listener(data);
				}
			}
		});

		this.socket.on('reconnect', () => {
			var oldConnections = this.connections;
			this.connections = [];
			for (let i = 0; i < oldConnections.length; i++){
				var connection = oldConnections[i];
				//try to reconnect
				this.joinRoom(connection.room, connection.user);
			}
		});
	}

	joinRoom (room, username) {
		return new Promise((resolve, reject) => {
			this.socket.emit('JOIN', {
				room: room,
				username: username
			}, (error, users) => {
				if (!error) {
					this.connections.push({
						user: username,
						room: room
					});
					resolve(users);
				} else {
					reject(error);
				}
			})
		});
	}

	sendMessage (message) {
		return new Promise((resolve) => {
			this.socket.emit('MESSAGE_SEND', message);
			resolve();
		})
	}

	sendMessageChange (message) {
		return new Promise((resolve) => {
			this.socket.emit('MESSAGE_CHANGE', message);
			resolve();
		})
	}

	sendVisibilityChange (hidden) {
		return new Promise((resolve) => {
			this.socket.emit('VISIBILITY_CHANGE', hidden);
			resolve();
		})
	}

	addMessageSendListener (func) {
		addListener(this, 'MESSAGE_SEND', (data)=>{func(data.user, data.message)});
	}

	removeMessageSendListener (func) {
		removeListener(this, 'MESSAGE_SEND', func);
	}

	addMessageChangeListener (func) {
		addListener(this, 'MESSAGE_CHANGE', (data)=>{func(data.user, data.message)});
	}

	removeMessageChangeListener (func) {
		removeListener(this, 'MESSAGE_CHANGE', func);
	}

	addUserJoinListener (func) {
		addListener(this, 'USER_JOIN', func);
	}

	removeUserJoinListener (func) {
		removeListener(this, 'USER_JOIN', func);
	}

	addUserLeaveListener (func) {
		addListener(this, 'USER_LEAVE', func);
	}

	removeUserLeaveListener (func) {
		removeListener(this, 'USER_LEAVE', func);
	}

	addVisibilityChangeListener (func) {
		addListener(this, 'VISIBILITY_CHANGE', (data)=>{func(data.user, data.hidden)});
	}

	removeVisibilityChangeListener (func) {
		removeListener(this, 'VISIBILITY_CHANGE', func);
	}
};

function addListener (clss, event, func) {
	clss.listeners[event].push(func);
}

function removeListener (clss, event, func) {
	clss.listeners[event] = clss.listeners[event].filter((elem) => {
		return elem != func;
	});
}

module.exports = function (url) {
	return new Promise(function (resolve) {
		var socket = socketClient(url);
		patch(socket);
		socket.on('connect', function () {
			resolve(new RealTalkAPI(socket));
		});
	});
}
