messages = {
}

// update the client's locally stored keys
// this happens whenever client writes in the key spaces, or when they send the hello to the server
async function updateKeys() {
    let pub = document.getElementById('pub-entry').value;
    let priv = document.getElementById('priv-entry').value;
    let serverValue = document.getElementById('server-entry').value;
    let digest = await sha256Digest(pub);

    selfKeys["public"] = pub;
    selfKeys["private"] = priv;
    selfKeys["digest"] = digest;
    selfKeys["server"] = serverValue;
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
        th.innerText = message['sender'] + " " + insertCharEveryN(message['message'], "\n", 150); // set the content to the message

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
        
    tr.setAttribute('onclick', 'selectChatGroup(-1)'); // give it an onclick to select it
    
    groupsTable.appendChild(tr); // add the tr to the table

    for (let chat in activeChats) { // for each chat in the activeChats variable
        let th = document.createElement('th'); // create a new th
        th.innerText = activeChats[chat]['participantDigest']; // set the content to the groups keys

        let tr = document.createElement('tr'); // create a new tr
        tr.appendChild(th); // append the th to the tr
        tr.setAttribute('onclick', 'selectChatGroup('+chat+')'); // add an onclick to select that group
        if (selectedChat == chat) {
            tr.classList.add('selected'); // set the tr as selected (global chat selected as default)
        }
        groupsTable.appendChild(tr); // add the tr to the table
    }
}

function updateActiveUsersList() {
    const table = document.getElementById("active-users");
    table.innerHTML = "";

    for (server of activeUsers) {
        let th = document.createElement('th'); // create a new th
        th.innerText = server["address"];
        
        let tr = document.createElement('tr'); // create a new tr
        tr.appendChild(th); // add the th to the tr
        
        table.appendChild(tr); // add the tr to the table        

        for (digest in server["digests"]) {
            let td = document.createElement('td'); // create a new th
            td.innerText = server["digests"][digest];
            
            let tr = document.createElement('tr'); // create a new tr
            tr.appendChild(td); // add the th to the tr
            
            
            // tr.setAttribute('onclick', `startChat()`); // give it an onclick to select it
            tr.setAttribute('onclick', `startChat([\`${server['address']}\`, \`${server['clients'][digest]}\`, \`${server["digests"][digest]}\`])`); // give it an onclick to select it
            table.appendChild(tr); // add the tr to the table
        }
    }
}

async function startChat(user_rsa) {
    if (selectedChat == -1 ) {
        // global chat group selected, create a new chat with the user
        
        // check if the chats already has the participant
        for (let activeChat of activeChats) {
            if (activeChat["participantKey"].length == 2 && activeChat["participantKey"].includes(user_rsa[1])) {
                console.log("Chat already exists");
                return;
            }
        }
        
        let participantDigests = [selfKeys["digest"], await sha256Digest(user_rsa[1])];
        
        // create a new chat and push it into the chats
        let new_chat = {
            "destinationServers": [user_rsa[0]],
            "participantKey": [selfKeys["public"], user_rsa[1]],
            "participantDigest": await sha256Digest(participantDigests)
        }
        activeChats.push(new_chat);
    } else {
        // chat group selected, create a new chat with that group + the new user

        // copy the selected group
        let new_chat = structuredClone(activeChats[selectedChat]);

        // if the selected group already has the user in it, do nothing
        if (new_chat["participantKey"].includes(user_rsa[1])) {
            console.log("Group already exists");
            return;
        }

        // otherwise add the user to the new group
        new_chat["participantKey"].push(user_rsa[1]);
        let digestedKeys = [];
        for (let participantKey of new_chat["participantKey"]) {
            digestedKeys.push(await sha256Digest(participantKey));
        }

        // create a fingerprint of the group
        let digest = await sha256Digest(digestedKeys);
        
        // loop through the group and check if we already have the group added
        for (let activeChat of activeChats) {
            if (activeChat["participantDigest"] == digest) {
                console.log("Group already exists");
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

updateGroupsUI(); // update the groups on page load
updateMessagesUI(); // update the messages on page load
addListeners(); // initialise all event listeners