Group 8
Cheng Cao, Keegan Jackel, Malte Vollendorff, Po Yu Chen

# Usage

## Starting the server

For now we are using a temporary Python server `relay.py`

Start `relay.py` with `python relay.py`

- This temporary server does not handle file uploads, or users disconnecting
- To reset the client list, restart the server

## Starting the client

Open the index.html

Pressing the `Connect` button will connect to the server specified in the address box

- This generates an RSA key pair and sets up your client with it, you do not need to enter your own key pair

Before sending or receiving messages, you need to update the client list with the `Refresh` button

 - You will want to open 2 tabs of index.html and connect to the server with both to test things
 - Connect with both before pressing `Refresh`

After receiving the online clients, clicking their key will create a new chat with them, and all users in the currently selected chat

 - To create a chat with just yourself and the target, select the global chat first

You can now send messages to any chat group by selecting it in the group list, typing a message in the chat box and pressing enter.