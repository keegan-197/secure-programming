function generateChatObj() { // generate a chat object from the input box
    chat = { // TODO include self in participants
        "participants": activeChats[selectedChat]['participantKey'],
        "message": document.getElementById("chatbox").value
    };
    
    return chat;
}

async function sendChat() {
    // called when user sends chat
    // needs to send chat to their server as per https://github.com/xvk-64/2024-secure-programming-protocol?tab=readme-ov-file#chat
    // get participants from the selected group from selectChatGroup()

    if (selectedChat < 0) { // only use sendChat to group chats
        console.log("Unhandled");
        return;
    }

    let [new_iv, generated_key, aes_settings] = await generateAESKey(); // generate an iv, key, and settings for AES encryption
    let exported_key = await window.crypto.subtle.exportKey('raw', generated_key); // export the generated key
    let b64ExportedKey = _arrayBufferToBase64(exported_key);


    let chatObj = generateChatObj(); // generate a chat object from the textbox and selected group
    let strChatObj = JSON.stringify(chatObj); // turn the chat object into string
    let messageBuffer = _stringToArrayBuffer(strChatObj); // turn the string into an array buffer so it can be encrypted
    let encrypted_message = await window.crypto.subtle.encrypt(aes_settings, generated_key, messageBuffer); // encrypt the array buffer


    let importedKeySettings = {
        "name": "RSA-OAEP",
        "hash": "SHA-256"
    }

    let symm_keys = []
    for (let participant of activeChats[selectedChat]['participantKey']) {
        console.log(participant);
        let participant_rsa_key = await window.crypto.subtle.importKey('spki', _pemToArrayBuffer(participant), importedKeySettings, true, ['encrypt']) // import participant RSA key

        let encrypted_aes_key = await window.crypto.subtle.encrypt(importedKeySettings, participant_rsa_key, _stringToArrayBuffer(b64ExportedKey)); // encrypt the AES key with participant AES key
        
        symm_keys.push(_arrayBufferToBase64(encrypted_aes_key)); // add the b64 encoded, RSA encrypted AES key to the symm_keys list
    }

    data = {
        "type": "chat",
        "destination_servers": activeChats[selectedChat]['destinationServers'],
        "iv": _arrayBufferToBase64(new_iv), // each message needs a new IV, encoded in b64
        "symm_keys": symm_keys, // each participant in each message needs a new symmetric key (from the iv)
        "chat": _arrayBufferToBase64(encrypted_message) // encode the encrypted chat message as b64
    }

    console.log(data);
    
    sendData(data);
}

function sendData(data) {
    // called in all data send functions
    // wraps the data with counter, signature, type as per https://github.com/xvk-64/2024-secure-programming-protocol?tab=readme-ov-file#sent-by-client
    message = data

    sendMessage(message);
}

function sendMessage(message) {
    socket.send(JSON.stringify(message));
}

function getConnectedUsers() {
    // send a request to the server for all clients connected to neighbourhood as per https://github.com/xvk-64/2024-secure-programming-protocol?tab=readme-ov-file#client-list
    // returns the response from the websocket request


    return ;
}