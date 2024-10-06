/*

Group 8
Cheng Cao, Keegan Jackel, Malte Vollendorff, Po Yu Chen

*/

function receivedMessage(message) { // handle every message received over the socket
    try {
        message = JSON.parse(message); // try to parse the data
    } catch(err) {
        console.log("Received non-json message: " + message); // maybe the server will send us a string?
        return;
    }

    if (message["type"] == "signed_data") {
        if ("data" in message) { // handle the different types of data messages
            if (message["data"]["type"] == "public_chat") {
                // handle receiving public chat message
                console.log("Received public_chat");
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

// called when the client receives a client_list update
async function handleClientList(servers) {
    // add a fingerprint to each of the clients so they can be displayed nicely
    
    // list of users active on the platform
    activeUsers = [];

    // for each server in the received client_list
    for (let server of servers) {

        // set up a new server object to display
        // each server has a list of users and their corresponding SHA-256 digests
        let serverUsers = {
            "address": server["address"],
            "clients": [],
            "digests": []
        };

        // for each public key in the client list of the server
        for (let clientKey of server["clients"]) {
            
            // if the public key is the same as out public key, we skip it because we don't want to display ourselves on client list
            if (selfKeys["pemPublic"] == clientKey) {
                continue;
            }

            // otherwise we add the client's key and digest to the server object
            serverUsers["clients"].push(clientKey);
            let digest = await sha256Digest(clientKey);
            serverUsers["digests"].push(digest);
        }

        // add the server object to the list of all active users
        activeUsers.push(serverUsers);
    }
    // update the active users table
    updateActiveUsersList();
}

async function handleGlobal(message) {
    let digest = message["data"]["sender"];
    let data = message["data"];

    // still need to check message integrity for global messages
    let integrity = await checkMessageIntegrity(message, digest);

    if (!integrity) {
        return;
    }

    messages["global"].push({"sender": data["sender"], "message":data["message"]});
    updateMessagesUI();
}

async function handleChat(message) {
    
    // try to decrypt all symmetric keys with our private RSA key
    // if can decrypt one, then the message is meant for me, use that key
    let decryptedSymmKey = await decryptSymKeys(message["data"]["symm_keys"]);
    
    
    
    if (decryptedSymmKey) { // received a message for me
        
        let b64key = _arrayBufferToString(decryptedSymmKey);
        let aes_buffer = _base64ToArrayBuffer(b64key);
    
        // import the symmetric key
        let symm_key = await window.crypto.subtle.importKey("raw", aes_buffer, {"name": "AES-GCM"}, false, ['decrypt']);
        
        // import the iv used to create the key and setup the AES settings
        let iv_buffer = _base64ToArrayBuffer(message["data"]["iv"]);
        let aes_settings = { name: "AES-GCM", iv: iv_buffer, length: 256 };

        // convert the base64 chat message into an arraybuffer
        let chat = _base64ToArrayBuffer(message["data"]["chat"]);

        // decrypt the chat using the symmetric key, returns an arraybuffer
        let decrypted_chat = await window.crypto.subtle.decrypt(aes_settings, symm_key, chat);
        
        // convert the arraybuffer into string
        let received_chat = _arrayBufferToString(decrypted_chat);
        console.log("Received a message for me!");
        console.log(received_chat);
        
        // parse the chat as it is a stringified object
        let parsed = JSON.parse(received_chat);

        // load the digest of the message sender
        let digest = parsed["participants"][0];

        // check the integrity of the message
        let integrity = await checkMessageIntegrity(message, digest);
        if (!integrity) {
            return;
        }

        // if the message integrity is valid, add the message to the DOM
        await addChatToDOM(received_chat);
    } else { // received a message not meant for me
        console.log("Received a message not for me :(");
    }
}

async function checkMessageIntegrity(message, digest) {
    // convert digest of message sender into public key
    // taken from the local list of clients through client_list and hello
    let pub = _digestToPub(digest);
    if (pub == null) {
        console.error("Could not find a public key to use to check message integrity");
        return false;
    }


    // check counter
    if (counters[digest] == undefined) {
        // if first time seeing a msg from someone, start their counter
        // potentially unsafe, but not specified in protocol
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

async function decryptSymKeys(symm_keys) {
    // Use my RSA priv key to check if a message is for me
    let importedKeySettings = { // RSA settings
        "name": "RSA-OAEP",
        "hash": "SHA-256"
    }

    for (symm_key of symm_keys) { // loop through all encrypted symm keys in the message
        let unencoded_key = _base64ToArrayBuffer(symm_key); // convert the b64 key into an arraybuffer so it can be used
        // import my own RSA private key
        let self_rsa_priv_key = await window.crypto.subtle.importKey('pkcs8', selfKeys["private"], importedKeySettings, true, ['decrypt']) // import self private RSA key
        let dec_symm_keys;
        try { // try to decrypt the current symm key with my priv RSA key
            dec_symm_keys = await window.crypto.subtle.decrypt(importedKeySettings, self_rsa_priv_key, unencoded_key);
        } catch (err) {
            continue;
        }
        // if I can decrypt a symm key, then message meant for me, return the symm key
        console.log("Decrypted my key! :)");
        return dec_symm_keys;
    }
    // message not meant for me
    return false;
}
