# Usage

## Starting the server

Install openjdk version "23" 2024-09-17

Run 'javac -cp ".;server/jars/json-20240303.jar;server/jars/Java-WebSocket-1.5.7.jar;server/jars/slf4j-api-2.0.6.jar" server/*.java' in powershell in the base folder
Run 'java -cp ".;server/jars/json-20240303.jar;server/jars/Java-WebSocket-1.5.7.jar;server/jars/slf4j-api-2.0.6.jar/server" Server [port]' in powershell in the base folder
    !Note: the files server is always on port 8080!
To connect multiple clients, replace address in servers/servers.json with the desired address

## Starting the client

Open the index.html

Pressing the `Connect` button will connect to the server specified in the address box

- This generates an RSA key pair and sets up your client with it, you do not need to enter your own key pair
- This is potentially a negative, but its fine for now

Before sending or receiving messages, you need to update the client list with the `Refresh` button

 - You will want to open 2 tabs of index.html and connect to the server with both to test things
 - Connect with both before pressing `Refresh`

After receiving the online clients, clicking their key will create a new chat with them, and all users in the currently selected chat

 - To create a chat with just yourself and the target, select the global chat first

You can now send messages to any chat group by selecting it in the group list, typing a message in the chat box and pressing enter.