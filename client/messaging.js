activeUsers = [];

async function generateChatObj() { // generate a chat object from the input box
    let participants = [] // TODO add self public key fingerprint before the others
    let selfFingerprint = await sha256Digest(selfKeys["public"]);
    participants.push(selfFingerprint);
    for (participantKey of activeChats[selectedChat]['participantKey']) {
        let fingerprint = await sha256Digest(participantKey);
        participants.push(fingerprint);
    }

    chat = { // TODO include self in participants
        "participants": participants,
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


    let chatObj = await generateChatObj(); // generate a chat object from the textbox and selected group
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

    // add self public key to the symmetric keys list for testing
    // TODO remove
    if (true) {
        let participant_rsa_key = await window.crypto.subtle.importKey('spki', _pemToArrayBuffer(selfKeys["public"]), importedKeySettings, true, ['encrypt']) // import participant RSA key

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
    message = {
        "data": data
    }

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

function receivedMessage(message) { // handle every message received over the socket
    try {
        message = JSON.parse(message); // try to parse the data
    } catch(err) {
        console.log("Received message: " + message); // maybe the server will send us a string?
        return;
    }

    if (message["type"] == "signed_data") {
        // TODO update this to signed_data
        if ("data" in message) { // handle the different types of data messages
            if (message["data"]["type"] == "public_chat") {
                // handle receiving public chat message
                console.log("Received public_chat"); // TODO implement this
            } else if (message["data"]["type"] == "chat") {
                // handle receiving private chat message
                console.log("Received chat");
                handleChat(message); 
            }
        }
    } else if (message["type"] == "client_list") {
        // handle receiving client list responses
        handleClientList(message["servers"]);
    }
}

async function decryptSymKeys(symm_keys) {
    // Use my RSA priv key to check if a message is for me
    let importedKeySettings = { // RSA settings
        "name": "RSA-OAEP",
        "hash": "SHA-256"
    }

    for (symm_key of symm_keys) { // loop through all symm keys
        let unencoded_key = _base64ToArrayBuffer(symm_key); // convert the b64 key into an arraybuffer so it can be used
        // import my own RSA private key
        let self_rsa_priv_key = await window.crypto.subtle.importKey('pkcs8', _pemToArrayBuffer(selfKeys['private']), importedKeySettings, true, ['decrypt']) // import self private RSA key
        let dec_symm_keys;
        try { // try to decrypt the current symm key with my priv RSA key
            dec_symm_keys = await window.crypto.subtle.decrypt(importedKeySettings, self_rsa_priv_key, unencoded_key);
        } catch (err) {
            console.log("Couldnt decrypt");
            continue;
        }
        // if I can decrypt a symm key, then message meant for me, return the symm key
        console.log("Decrypted my key!");
        return dec_symm_keys;
    }
    // message not meant for me
    return false;
}

// called when the client receives a client_list update
async function handleClientList(servers) {
    // add a fingerprint to each of the clients so they can be displayed nicely
    for (let server of servers) {
        server["digest"] = [];
        for (let client of server["clients"]) {
            server["digest"].push(await sha256Digest(client));
        }
    }
    // update the active users table
    activeUsers = servers;
    updateActiveUsersList();
}

async function handleChat(message) {
    // try to decrypt all symmetric keys
    // if can decrypt one, then the message is meant for me, use that key
    let decryptedSymmKey = await decryptSymKeys(message["data"]["symm_keys"]);
    console.log(decryptedSymmKey);
    
    
    let b64key = _arrayBufferToString(decryptedSymmKey);
    let aes_buffer = _base64ToArrayBuffer(b64key);

    let symm_key = await window.crypto.subtle.importKey("raw", aes_buffer, {"name": "AES-GCM"}, false, ['decrypt']);

    if (decryptedSymmKey) { // received a message for me
        // decrypt the chat data

        let iv_buffer = _base64ToArrayBuffer(message["data"]["iv"]);
        let aes_settings = { name: "AES-GCM", iv: iv_buffer, length: 256 };

        let chat = _base64ToArrayBuffer(message["data"]["chat"]);

        let decrypted_chat = await window.crypto.subtle.decrypt(aes_settings, symm_key, chat);
        let received_chat = _arrayBufferToString(decrypted_chat);
        console.log("Received a message for me!");
        console.log(received_chat);
    } else { // received a message not meant for me
        console.log("Received a message not for me :(");
    }
}

// send hello
function sendHello() {
    updateKeys();
    sendData({"type": "hello", "public_key": selfKeys["public"]});
}

// send client_list_request
function refreshActive() {
    sendMessage({"type":"client_list_request"});
}