messages = { // temporary list of messages
    "global": [
        {
            "sender": "rsakey1",
            "message": "first message"
        }
    ],
    "Q+6fz2lL2yQDOM7U7lAtkQ==": [
        {
            "sender": "rsakey1",
            "message": "first message"
        },
        {
            "sender": "rsakey1",
            "message": "second message"
        },
        {
            "sender": "rsakey2",
            "message": "first message"
        },
        {
            "sender": "rsakey3",
            "message": "first message"
        }
    ],
    "R/GsfSEVhCrHWvrGvW+fEQ==": [
        {
            "sender": "MIIBI",
            "message": "first message"
        },
        {
            "sender": "MIIBI",
            "message": "second message"
        },
        {
            "sender": "MIIBI",
            "message": "third message"
        }
    ],
}

function chatKeyPressed(event) { // detect input box enter pressed
    // console.log(event.keyCode);
    if (event.keyCode == 13) {
        chatSendHandler();
    }
}

function chatSendHandler() { // handle sending chat, and updating local message display
    sendChat();
    messages[getCurrentChatKey()].push({"sender": "You", "message": document.getElementById("chatbox").value});
    updateMessagesUI();
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
        messages[chatKey] = []
    }

    for (let message of messages[chatKey]) { // for each message in the current message group
        let th = document.createElement('th'); // create a new th
        th.innerText = message['sender'] + " " + message['message']; // set the content to the message

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
    tr.classList.add('selected'); // set the tr as selected (global chat selected as default)
    tr.setAttribute('onclick', 'selectChatGroup(-1)'); // give it an onclick to select it
    
    groupsTable.appendChild(tr); // add the tr to the table

    for (let chat in activeChats) { // for each chat in the activeChats variable
        let th = document.createElement('th'); // create a new th
        th.innerText = activeChats[chat]['participantDigest']; // set the content to the groups keys

        let tr = document.createElement('tr'); // create a new tr
        tr.appendChild(th); // append the th to the tr
        tr.setAttribute('onclick', 'selectChatGroup('+chat+')'); // add an onclick to select that group
        groupsTable.appendChild(tr); // add the tr to the table
    }
}

updateGroupsUI() // update the groups on page load
updateMessagesUI() // update the messages on page load