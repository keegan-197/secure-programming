/*

Group 8
Cheng Cao, Keegan Jackel, Malte Vollendorff, Po Yu Chen

*/

async function sendChat() {
    // called when user sends chat
    // needs to send chat to their server as per https://github.com/xvk-64/2024-secure-programming-protocol?tab=readme-ov-file#chat
    // get participants from the selected group from selectChatGroup()

    if (selectedChat < 0) { // only use sendChat to group chats
        sendData({
            "type": "public_chat",
            "sender": selfKeys["digest"],
            "message": document.getElementById("chatbox").value
        })
        return;
    }


    let [generated_key, aes_settings] = await generateAESKey(); // load the aes key
    
    
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

    // encrypt an AES key with every participants RSA public key
    for (let participant of activeChats[selectedChat]['participantKey'].slice(1)) {
        let participant_rsa_key = await window.crypto.subtle.importKey('spki', _pemToArrayBuffer(participant), importedKeySettings, true, ['encrypt']) // import participant RSA key

        let encrypted_aes_key = await window.crypto.subtle.encrypt(importedKeySettings, participant_rsa_key, _stringToArrayBuffer(b64ExportedKey)); // encrypt the AES key with participant AES key
        
        symm_keys.push(_arrayBufferToBase64(encrypted_aes_key)); // add the b64 encoded, RSA encrypted AES key to the symm_keys list
    }    

    data = {
        "type": "chat",
        "destination_servers": activeChats[selectedChat]['destinationServers'],
        "iv": _arrayBufferToBase64(aes_settings["iv"]), // each message needs a new IV, encoded in b64
        "symm_keys": symm_keys, // each participant in each message needs a new symmetric key (from the iv)
        "chat": _arrayBufferToBase64(encrypted_message) // encode the encrypted chat message as b64
    }

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

    let signature = await signData(JSON.stringify(message["data"]) + message["counter"], selfKeys["private"]);

    message["signature"] = _arrayBufferToBase64(signature);

    sendMessage(message);
}

function sendMessage(message) {
    socket.send(JSON.stringify(message));
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
        req.open("POST", `http://${selfKeys["server"].split(":")[0]}:8080`, true);
        req.setRequestHeader("x-filename", file.name);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
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

// send hello
function sendHello() {
    let serverAddress = document.getElementById("server-entry").value;
    connectToServer(serverAddress);
}

// send client_list_request
function refreshActive() {
    sendMessage({"type":"client_list_request"});
}