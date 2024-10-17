/*

Group 8
Cheng Cao, Keegan Jackel, Malte Vollendorff, Po Yu Chen

*/

var messages = {}; // will store the received messages
// no persistent storage for messages

var activeUsers = []; // will store data from the client_list responses

var selfKeys = {}; // will store the clients data

var activeChats = []; // this will be updated by the client to add new chats

var counters = {}; // stores user counters

var selectedChat = -1; // global is default


// update the client's locally stored keys
// whenever client connects to server, create a new RSA key pair and use this for the session
// doesn't handle using same RSA key pair over multiple sessions
// want to store public key, public key as string form, public key digest, private key, connected server, self counter value
async function updateKeys() {
    // let pub = document.getElementById('pub-entry').value;
    // let priv = document.getElementById('priv-entry').value;
    let serverValue = document.getElementById('server-entry').value;
    selfKeys["server"] = serverValue;

    let newKeyPair = await genRSAKeyPair();
    selfKeys["private"] = newKeyPair["private"];
    selfKeys["public"] = newKeyPair["public"];
    selfKeys["pemPublic"] = _arrayBufferToPem(selfKeys["public"], 0);
    selfKeys["iv"] = window.crypto.getRandomValues(new Uint8Array(16));
    selfKeys["digest"] = await sha256Digest(selfKeys["pemPublic"]);
    selfKeys["aes-key"] = await generateAESKey(); // generate an iv, key, and settings for AES encryption

    selfKeys["counter"] = 0;
    console.log("Updated keys");
}

function chatKeyPressed(event) { // detect input box enter pressed
    // console.log(event.keyCode);
    if (event.keyCode == 13) {
        chatSendHandler();
    }
}

function chatSendHandler() { // handle sending chat, and updating local message display
    if (socket['readyState'] == 1) {
        sendChat();
        messages[getCurrentChatKey()].push({"sender": "You", "message": document.getElementById("chatbox").value});
        updateMessagesUI();
    } else {
        console.log("WebSocket not connected");
    }
}

function selectChatGroup(selectedGroup) {
    // called when a chat group is selected -- done
    // needs to change chat group color on UI -- done
    // needs to update the messages in the chat table -- done
    // needs to update a variable -- done
    selectedChat = selectedGroup // set the currently selected chat group variable
    groupsTable = document.getElementById('user-select') // get the DOM table
    for (groupNum = 0; groupNum < groupsTable.childElementCount; groupNum++) { // for each row in the table
        groupRow = groupsTable.children[groupNum] // get the row DOM element
        groupRow.classList.remove('selected') // remove the selected element from the row
        if (groupNum-1 == selectedGroup) { // if the currentRow-1 is the selected group
            groupRow.classList.add('selected') // set it as selected
        }
    }

    // update the message box to contain the messages
    updateMessagesUI();
}

function getCurrentChatKey() { // get the key of the current selected chat
    let chatKey = "";

    if (selectedChat < 0) { // global chat handler
        chatKey = "global"
    } else {
        chatKey = activeChats[selectedChat]['participantDigest']
    }

    return chatKey
}

function updateMessagesUI() {
    // updates the table containing the messages of the current chat
    // called on every message receive, and when switching chat groups
    let groupsTable = document.getElementById('chat-messages'); // get the DOM table
    groupsTable.innerHTML = ""; // clear the DOM table

    let chatKey = getCurrentChatKey();

    if (messages[chatKey] == undefined) {
        messages[chatKey] = [];
    }

    for (let message of messages[chatKey]) { // for each message in the current message group
        let th = document.createElement('th'); // create a new th
        th.innerText = message['sender'] + ": " + insertCharEveryN(message['message'], "\n", 150); // set the content to the message

        let tr = document.createElement('tr'); // create a new tr
        tr.appendChild(th); // append the th to the tr
        groupsTable.appendChild(tr); // add the tr to the table
    }
}

function updateGroupsUI() {
    let groupsTable = document.getElementById('user-select'); // get the DOM table
    groupsTable.innerHTML = ""; // clear the DOM table

    let th = document.createElement('th'); // create a new th
    th.innerText = "global"; // set it as global

    let tr = document.createElement('tr'); // create a new tr
    tr.appendChild(th); // add the th to the tr
    if (selectedChat == -1) {
        tr.classList.add('selected'); // set the tr as selected (global chat selected as default)
    }
        
    // potentially vulnerable below
    // tr.setAttribute('onclick', 'selectChatGroup(-1)');
    tr.addEventListener('click', () => selectChatGroup(-1));  // give it an onclick to select it
    
    groupsTable.appendChild(tr); // add the tr to the table

    for (let chat in activeChats) { // for each chat in the activeChats variable
        let th = document.createElement('th'); // create a new th
        th.innerText = activeChats[chat]['participantDigest']; // set the content to the groups' digest

        let tr = document.createElement('tr'); // create a new tr
        tr.appendChild(th); // append the th to the tr

        // potentially dangerous below
        // tr.setAttribute('onclick', 'selectChatGroup('+chat+')');
        tr.addEventListener('click', () => selectChatGroup(chat)); // add an onclick to select that group
        
        if (selectedChat == chat) {
            tr.classList.add('selected'); // set the tr as selected (global chat selected as default)
        }

        groupsTable.appendChild(tr); // add the tr to the table
    }
}

function updateActiveUsersList() {
    // build a new table of active users every client_list received
    const table = document.getElementById("active-users");

    // clear the old list
    table.innerHTML = "";

    // for every server in the client_list, create a new th
    for (let server of activeUsers) {
        let th = document.createElement('th'); // create a new th (header)
        th.innerText = server["address"];
        
        let serverRow = document.createElement('tr'); // create a new tr (row)
        serverRow.appendChild(th); // add the th to the tr (add header into row)
        
        table.appendChild(serverRow); // add the tr to the table (add row into table)

        for (let client in server["digests"]) {
            let td = document.createElement('td'); // create a new th
            td.innerText = server["digests"][client];
            
            let tr = document.createElement('tr'); // create a new tr
            tr.appendChild(td); // add the th to the tr
            
            // potentially vulnerable below
            // tr.setAttribute('onclick', `startChat([\`${server['address']}\`, \`${server['clients'][client]}\`, \`${server["digests"][client]}\`])`);
            tr.addEventListener('click', () => startChat([server['address'], server['clients'][client], server['digests'][client]])); // give it an click event listener to select it
            console.log(`Adding event listener ${[server['address'], server['clients'][client], server['digests'][client]]}`);
            
            table.appendChild(tr); // add the tr to the table
        }
    }
}

async function startChat(user_rsa) {
    console.log(`Starting new chat with ${user_rsa}`);
    // starts a new chat group when the client clicks a user in the client_list

    if (selectedChat == -1 ) {
        // global chat group selected, create a new chat with only the clicked user
        
        // check if the activeChats array already has the direct message between client and target
        for (let activeChat of activeChats) {
            if (activeChat["participantKey"].length == 2 && activeChat["participantKey"].includes(user_rsa[1])) {
                console.log("Chat already exists");
                return;
            }
        }
        
        // create a list of the group participants digests
        let participantDigests = [selfKeys["digest"], await sha256Digest(user_rsa[1])];
        
        // create a new chat with the client and the target and push it into the chats
        let new_chat = {
            "destinationServers": [user_rsa[0]], // targets server
            "participantKey": [selfKeys["pemPublic"], user_rsa[1]], // clients key, targets key
            
            // create a SHA-256 digest of the clients digest, and the targets digest
            // this will be used to identify group chats
            // both the client and target will have the same group digest value as the digest is sorted
            "participantDigest": await sha256Digest(participantDigests)
        }
        
        // push the new chat to the activeChats list
        activeChats.push(new_chat);
    } else {
        // chat group selected, create a new chat with that group + the new user

        // copy the selected group
        let new_chat = structuredClone(activeChats[selectedChat]);

        // if the selected group already has the user in it, do nothing
        if (new_chat["participantKey"].includes(user_rsa[1])) {
            console.log("Group already exists 1");
            return;
        }

        // otherwise add the user to the new group
        new_chat["participantKey"].push(user_rsa[1]);
        
        // create a new list of digests of the participants of the group chat
        let digestedKeys = [];
        for (let participantKey of new_chat["participantKey"]) {
            digestedKeys.push(await sha256Digest(participantKey));
        }

        // create a fingerprint of the group
        let digest = await sha256Digest(digestedKeys);
        
        // loop through the group and check if we already have the group added
        for (let activeChat of activeChats) {
            if (activeChat["participantDigest"] == digest) {
                console.log("Group already exists 2");
                return;
            }
        }
        // otherwise add the server and fingerprint to the group and push it onto the active chats
        new_chat["destinationServers"].push(user_rsa[0]);
        new_chat["participantDigest"] = digest;
        activeChats.push(new_chat);
    }

    // updates the group list
    updateGroupsUI();
}

async function addChatToDOM(chat) {
    chat = JSON.parse(chat);
    let digest = await sha256Digest(chat["participants"]);
    if (!(digest in messages)) {
        messages[digest] = [];
    }

    messages[digest].push({"sender":chat["participants"][0], "message":chat["message"]});
    updateMessagesUI();
}

async function generateChatObj() { // generate a chat object from the input box
    let participants = [] 
    for (participantKey of activeChats[selectedChat]['participantKey']) {
        let fingerprint = await sha256Digest(participantKey);
        participants.push(fingerprint);
    }

    chat = {
        "participants": participants,
        "message": document.getElementById("chatbox").value
    };
    
    return chat;
}

updateGroupsUI(); // update the groups on page load
updateMessagesUI(); // update the messages on page load
addListeners(); // initialise all event listeners