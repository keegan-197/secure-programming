function selectChatGroup() {
    // called when a chat group is selected
    // needs to change chat group color on UI
    // needs to update the messages in the chat table
    // needs to update a variable 

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