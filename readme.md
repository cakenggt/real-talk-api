# Real Talk API

This is an api library for connecting to the [Real Talk](https://github.com/cakenggt/real-talk) chat application.

## API

### require('real-talk-api')(url) -> Promise

Calling the default function with a url returns a promise which resolves with
a RealTalkAPI object already connected to the server.

### RealTalkAPI.joinRoom(room, username) -> Promise

Joins the room name provided with the username provided. Returns a promise which resolves with a list of users currently in the room.

### RealTalkAPI.sendMessage(message)

Sends a message to the room.

### RealTalkAPI.sendMessageChange(message)

Sends a message change to the room. This will appear beside the username of the bot.

### RealTalkAPI.sendVisibilityChange(hidden)

Sends a visibility change to the room. Hidden is whether or not the bot should appear to not be looking at the thread.

### RealTalkAPI.addMessageSendListener(function)

Adds a listener function. The listener function should take 2 parameters, the user's name and the new message.

### RealTalkAPI.removeMessageSendListener(function)

Removes the provided function from the list of listeners.

### RealTalkAPI.addMessageChangeListener(function)

Adds a listener function. The listener function should take 2 parameters, the user's name and the new message.

### RealTalkAPI.removeMessageChangeListener(function)

Removes the provided function from the list of listeners.

### RealTalkAPI.addUserJoinListener(function)

Adds a listener function. The listener function should take 1 parameter, the user's name.

### RealTalkAPI.removeUserJoinListener(function)

Removes the provided function from the list of listeners.

### RealTalkAPI.addUserLeaveListener(function)

Adds a listener function. The listener function should take 1 parameter, the user's name.

### RealTalkAPI.removeUserLeaveListener(function)

Removes the provided function from the list of listeners.

### RealTalkAPI.addVisibilityChangeListener(function)

Adds a listener function. The listener function should take 2 parameters, the user's name and the new hidden boolean.

### RealTalkAPI.removeVisibilityChangeListener(function)

Removes the provided function from the list of listeners.
