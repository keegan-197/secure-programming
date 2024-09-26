/*

Group 8
Cheng Cao, Keegan Jackel, Malte Vollendorff, Po Yu Chen

*/

var socket;


async function connectToServer(server) {
    // close the current socket before opening new socket
    // only want to be connected to one server at a time
    if (socket != undefined) {
        socket.close();
    }

    socket = new WebSocket(`ws://${server}:8765`)

    socket.addEventListener("message", (event) => { // Listen for messages
        console.log("Message from server ", event.data);
        receivedMessage(event.data); // handle every message received
    });

    socket.addEventListener("open", (event) => {
        console.log("Connected to server");
        // update user's keys once connected to server
        onConnect();
    })
}

async function onConnect() {
    await updateKeys();
    await sendData({"type": "hello", "public_key": selfKeys["pemPublic"]});
}

// connectToServer('localhost') // initialise connection
