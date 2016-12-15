const RealTalkAPI = require('./index');

var api;
var herokuUrl = 'https://real-talk-app.herokuapp.com';
var localUrl = 'http://localhost:4000';

RealTalkAPI(herokuUrl)
.then(function (result) {
	api = result;
})
.then(function () {
	return api.joinRoom('test', 'echo-bot');
})
.then(function (users) {
	console.log('users already here: ', users);
	api.addMessageSendListener(function (user, message) {
		type(api, `${user} said: ${message}`);
	});
	api.addMessageSendListener(function (user, message) {
		api.sendMessageChange('Posted!');
	});
	api.addMessageChangeListener(function (user, message) {
		api.sendMessageChange(`${user}: ${message}`)
	});
	api.addUserJoinListener(function (user) {
		api.sendMessage(`Welcome ${user}!`);
	});
})
.catch(function (err) {
	console.log(err);
});

function type(api, message){
	var typeLetters = function (letters) {
		return function () {
			api.sendMessageChange(letters);
		}
	};
	for (let i = 0; i < message.length+1; i++){
		setTimeout(typeLetters(message.slice(0, i)), i*200);
	}
	setTimeout(function () {
		api.sendMessage(message);
	}, (message.length+1)*200);
}
