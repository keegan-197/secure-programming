activeUsers = [];

async function generateChatObj() { // generate a chat object from the input box
    let participants = [] // TODO add self public key fingerprint before the others
    // let selfFingerprint = await sha256Digest(selfKeys["public"]);
    // participants.push(selfFingerprint);
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
        // console.log("Sending to global not handled yet");
        sendData({
            "type": "public_chat",
            "sender": selfKeys["digest"],
            "message": document.getElementById("chatbox").value
        })
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
        // console.log(participant);
        let participant_rsa_key = await window.crypto.subtle.importKey('spki', _pemToArrayBuffer(participant), importedKeySettings, true, ['encrypt']) // import participant RSA key

        let encrypted_aes_key = await window.crypto.subtle.encrypt(importedKeySettings, participant_rsa_key, _stringToArrayBuffer(b64ExportedKey)); // encrypt the AES key with participant AES key
        
        symm_keys.push(_arrayBufferToBase64(encrypted_aes_key)); // add the b64 encoded, RSA encrypted AES key to the symm_keys list
    }

    // add self public key to the symmetric keys list for testing
    // TODO remove
    // if (true) {
    //     let participant_rsa_key = await window.crypto.subtle.importKey('spki', _pemToArrayBuffer(selfKeys["public"]), importedKeySettings, true, ['encrypt']) // import participant RSA key

    //     let encrypted_aes_key = await window.crypto.subtle.encrypt(importedKeySettings, participant_rsa_key, _stringToArrayBuffer(b64ExportedKey)); // encrypt the AES key with participant AES key
        
    //     symm_keys.push(_arrayBufferToBase64(encrypted_aes_key)); // add the b64 encoded, RSA encrypted AES key to the symm_keys list
    // }

    data = {
        "type": "chat",
        "destination_servers": activeChats[selectedChat]['destinationServers'],
        "iv": _arrayBufferToBase64(new_iv), // each message needs a new IV, encoded in b64
        "symm_keys": symm_keys, // each participant in each message needs a new symmetric key (from the iv)
        "chat": _arrayBufferToBase64(encrypted_message) // encode the encrypted chat message as b64
    }

    // console.log(data);
    
    sendData(data);
}

async function sendData(data) {
    // increase counter on all signed_data sends
    selfKeys["counter"] += 1;

    // called in all data send functions
    // wraps the data with counter, signature, type as per https://github.com/xvk-64/2024-secure-programming-protocol?tab=readme-ov-file#sent-by-client
    message = {
        "type": "signed_data",
        "data": data,
        "counter": selfKeys["counter"]
    }

    let signature = await signData(JSON.stringify(message["data"]) + message["counter"], selfKeys.private);

    message["signature"] = _arrayBufferToBase64(signature);

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
        console.log("Received non-json message: " + message); // maybe the server will send us a string?
        return;
    }

    if (message["type"] == "signed_data") {
        // TODO update this to signed_data
        if ("data" in message) { // handle the different types of data messages
            if (message["data"]["type"] == "public_chat") {
                // handle receiving public chat message
                console.log("Received public_chat"); // TODO implement this
                handleGlobal(message);
            } else if (message["data"]["type"] == "chat") {
                // handle receiving private chat message
                console.log("Received chat");
                handleChat(message);
            } else if (message["data"]["type"] == "hello") {
                // handle receving a hello
                // handleHello(message);
                console.log("Received hello");
            }
        }
    } else if (message["type"] == "client_list") {
        // handle receiving client list responses
        console.log("Received client_list");
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
            // console.log("Couldn't decrypt any keys :(");
            continue;
        }
        // if I can decrypt a symm key, then message meant for me, return the symm key
        console.log("Decrypted my key! :)");
        return dec_symm_keys;
    }
    // message not meant for me
    return false;
}

// called when the client receives a client_list update
async function handleClientList(servers) {
    // add a fingerprint to each of the clients so they can be displayed nicely
    activeUsers = [];
    for (let server of servers) {
        let serverUsers = {
            "address": server["address"],
            "clients": [],
            "digests": []
        };
        for (let clientKey of server["clients"]) {
            // console.log("Checking client " + clientKey);
            
            if (selfKeys["public"] == clientKey) {
                // console.log("Found my own key " + selfKeys["public"]);
                continue;
            }

            serverUsers["clients"].push(clientKey);
            let digest = await sha256Digest(clientKey);
            serverUsers["digests"].push(digest);
        }
        activeUsers.push(serverUsers);
    }
    // update the active users table
    // activeUsers = serverUsers;
    updateActiveUsersList();
}

async function handleGlobal(message) {
    // console.log("Global message");
    // console.log(message);

    let digest = message["data"]["sender"];
    let data = message["data"];

    let integrity = await checkMessageIntegrity(message, digest);

    if (!integrity) {
        return;
    }

    messages["global"].push({"sender": data["sender"], "message":data["message"]});
    updateMessagesUI();
}

function digestToPub(digest) {
    // convert a digest into a public key using the activeUsers list
    for (let server = 0; server < activeUsers.length; server++) {
        for (let participant = 0; participant < activeUsers[server]["clients"].length; participant++) {
            if (digest == activeUsers[server]["digests"][participant]) {
                return activeUsers[server]["clients"][participant];
            }
        }
    }
}

async function handleChat(message) {
    
    // try to decrypt all symmetric keys
    // if can decrypt one, then the message is meant for me, use that key
    let decryptedSymmKey = await decryptSymKeys(message["data"]["symm_keys"]);
    // console.log(decryptedSymmKey);
    
    
    
    if (decryptedSymmKey) { // received a message for me
        let b64key = _arrayBufferToString(decryptedSymmKey);
        let aes_buffer = _base64ToArrayBuffer(b64key);
    
        let symm_key = await window.crypto.subtle.importKey("raw", aes_buffer, {"name": "AES-GCM"}, false, ['decrypt']);
        // decrypt the chat data

        let iv_buffer = _base64ToArrayBuffer(message["data"]["iv"]);
        let aes_settings = { name: "AES-GCM", iv: iv_buffer, length: 256 };

        let chat = _base64ToArrayBuffer(message["data"]["chat"]);

        let decrypted_chat = await window.crypto.subtle.decrypt(aes_settings, symm_key, chat);
        let received_chat = _arrayBufferToString(decrypted_chat);
        console.log("Received a message for me!");
        console.log(received_chat);
        
        let parsed = JSON.parse(received_chat);

        let digest = parsed["participants"][0];

        let integrity = await checkMessageIntegrity(message, digest);
        
        if (!integrity) {
            return;
        }

        await addChatToDOM(received_chat);
    } else { // received a message not meant for me
        console.log("Received a message not for me :(");
    }
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

async function uploadFile() {

    // get the data from the file
    const fileSelect = document.getElementById('file');
    const file = fileSelect.files[0];

    if (!file) {
        alert("Please select a file.");
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        // create a XMLHttpRequest object
        let req = new XMLHttpRequest();
        // open a POST request to the server
        // port subject to change
        req.open("POST", `http://${selfKeys["server"]}:8764`, true);
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status == 200) { // 200 means the server responds with the file url
                    alert(JSON.parse(req.responseText)["body"]["file_url"]);
                    console.log(req.responseText);
                } else if (req.status == 413) { // 413 means the upload was too large
                    console.log("File too large");
                } else { // other errors
                    console.log("File upload failed");
                }
            }
        }
        // send the request
        req.send(formData);
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while uploading the file.');
    }

}

async function signData(data, key) {
    let signingParams = { // Signing settings
        "name": "RSA-PSS",
        "saltLength": 32
    }

    let importedKeySettings = { // RSA settings
        "name": "RSA-PSS",
        "hash": "SHA-256"
    }

    let keyBuffer = await window.crypto.subtle.importKey('pkcs8', _pemToArrayBuffer(key), importedKeySettings, true, ['sign']);

    let signed = await window.crypto.subtle.sign(signingParams, keyBuffer, _stringToArrayBuffer(data));

    return signed;
}

async function verifySignedData(signed_data, key) {
    let signingParams = { // Signing settings
        "name": "RSA-PSS",
        "saltLength": 32
    }

    let importedKeySettings = { // RSA settings
        "name": "RSA-PSS",
        "hash": "SHA-256"
    }

    // load the data from the signed_data message
    let data = JSON.stringify(signed_data["data"]) + signed_data["counter"];
    
    let dataBuffer = _stringToArrayBuffer(data);

    // load the signature
    let signature = _base64ToArrayBuffer(signed_data["signature"]);
    
    // load the key
    let keyBuffer = await window.crypto.subtle.importKey('spki', _pemToArrayBuffer(key), importedKeySettings, true, ['verify']);

    // verify
    let verified = await window.crypto.subtle.verify(signingParams, keyBuffer, signature, dataBuffer);

    return verified;
}

async function checkMessageIntegrity(message, digest) {
    // convert digest of message sender into public key
    // taken from the local list of clients through client_list and hello
    let pub = digestToPub(digest);

    // check counter
    if (counters[digest] == undefined) {
        // if first time seeing a msg from someone, start their counter
        counters[digest] = message["counter"];
        console.log("Setup new counter");
    } else if (message["counter"] <= counters[digest]) {
        // if the counter is not greater than the expected, deny message
        console.log("Received invalid counter");
        return false;
    }
    console.log("Counter check passed");

    // verify the signature
    let verified = await verifySignedData(message, pub);
    if (!verified) {
        console.log("Unverified message received");
        return false;
    }

    console.log("Signature check passed");

    // if correct counter and message valid, increase their counter
    counters[digest] = message["counter"];
    console.log("Increased counter to " + message["counter"]);
    return true;
}

// send hello
function sendHello() {
    let serverAddress = document.getElementById("server-entry").value;
    connectToServer(serverAddress);
}

// send client_list_request
function refreshActive() {
    sendMessage({"type":"client_list_request"});
}