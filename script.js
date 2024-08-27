var activeChats = [ // this will be updated by the client to add new chats
    {
        "destinationServers": ["192.168.1.1", "192.168.1.2"],
        "participantKey": ["rsakey1", "rsakey2", "rsakey3"]
    },
    {
        "destinationServers": ["192.168.1.2"],
        "participantKey": ["rsakey2"]
    },
    {
        "destinationServers": ["192.168.1.1"],
        "participantKey": ["rsakey3"]
    }
]

var selectedChat = -1; // global is default

function selectChatGroup(selectedGroup) {
    // called when a chat group is selected -- done
    // needs to change chat group color on UI -- done
    // needs to update the messages in the chat table -- todo
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
}

function sendChat(chat) {
    // called when user sends chat
    // needs to send chat to their server as per https://github.com/xvk-64/2024-secure-programming-protocol?tab=readme-ov-file#chat
    // get participants from the selected group from selectChatGroup()


    sendMessage();
}

function sendData(data) {
    // called in all data send functions
    // wraps the data with counter, signature, type as per https://github.com/xvk-64/2024-secure-programming-protocol?tab=readme-ov-file#sent-by-client


}

function getConnectedUsers() {
    // send a request to the server for all clients connected to neighbourhood as per https://github.com/xvk-64/2024-secure-programming-protocol?tab=readme-ov-file#client-list
    // returns the response from the websocket request


    return ;
}

function updateMessagesUI() {
    // updates the table containing the messages of the current chat
    // called on every message receive, and when switching chat groups


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
        th.innerText = activeChats[chat].participantKey; // set the content to the groups keys

        let tr = document.createElement('tr'); // create a new tr
        tr.appendChild(th); // append the th to the tr
        tr.setAttribute('onclick', 'selectChatGroup('+chat+')'); // add an onclick to select that group
        groupsTable.appendChild(tr); // add the tr to the table
    }
}

updateGroupsUI() // update the groups on page load