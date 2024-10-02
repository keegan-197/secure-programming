# THIS CODE IS VULNERABLE, USE AT YOUR OWN RISK

Group 8
Cheng Cao, Keegan Jackel, Malte Vollendorff, Po Yu Chen

# Usage

## Starting the server

Install openjdk version "23" 2024-09-17

Run `javac -cp ".;server/jars/json-20240303.jar;server/jars/Java-WebSocket-1.5.7.jar;server/jars/slf4j-api-2.0.6.jar" server/*.java` in powershell in the base folder

Run `java -cp ".;server/jars/json-20240303.jar;server/jars/Java-WebSocket-1.5.7.jar;server/jars/slf4j-api-2.0.6.jar;server" Server [port]` in powershell in the base folder
- !Note: the files server is always on port 8080!

If you already have an installed Java version, you can try using the full path. E.g. enter the following in powershell `& "C:\Program Files\Java\jdk-23\bin\java.exe" -cp ".;server/jars/json-20240303.jar;server/jars/Java-WebSocket-1.5.7.jar;server/jars/slf4j-api-2.0.6.jar;server" Server [port]`

To connect multiple clients, replace address in servers/servers.json with the desired address

## Starting the client

Open the index.html

- Tested to work on Firefox, unsure about how well it works on other browsers

Pressing the `Connect` button will connect to the server specified in the address box

- If testing locally, this will probably be `localhost:[port]` where [port] is the port used in the server setup
- This generates an RSA key pair and sets up your client with it, you do not need to enter your own key pair

Before sending or receiving messages, you need to update the client list with the `Refresh` button

 - You will want to open 2 tabs of index.html and connect to the server with both to test sending/receiving messages
 - Connect with both before pressing `Refresh`

After receiving the online clients, clicking their key will create a new chat with them, and all users in the currently selected chat

 - To create a chat with just yourself and the target, select the global chat first

You can now send messages to any chat group by selecting it in the group list, typing a message in the chat box and pressing enter.