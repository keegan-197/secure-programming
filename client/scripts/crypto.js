/*

Group 8
Cheng Cao, Keegan Jackel, Malte Vollendorff, Po Yu Chen

*/

async function generateAESKey() {
    // generate an IV, AES key, and settings object
    let aes_settings = { name: "AES-GCM", iv: selfKeys["iv"], length: 256 };

    let generated_key = await window.crypto.subtle.generateKey(aes_settings, true, ["encrypt", "decrypt"]);

    return [generated_key, aes_settings]
}

async function sha256Digest(cdata) { // create a digest from a piece of data
    data = structuredClone(cdata);
    
    console.log(`Digesting data: ${data}`);
    
    if (data == undefined || data.length == 0) {
        return undefined;
    }

    if (typeof(data) == "object") { // if data is a list, sort and join it before fingerprinting
        data = data.sort().join();
    }
    

    // essentially fingerprints the data
    let digest = await window.crypto.subtle.digest("SHA-256", _stringToArrayBuffer(data));
    let bytes = new Uint8Array(digest);
    let b64 = _arrayBufferToBase64(bytes);
    console.log(`Returning: ${b64}`);
    return b64;
}


// Used to split the b64 PEM into rows of 65 chars
function insertCharEveryN(str, char, n) {
    let new_str = "";

    for (let i = 0; i < str.length; i++) {
        new_str += str[i];
        if ((i+1) % n == 0 && i != str.length-1) {
            new_str += char;
        }
    }

    return new_str;
}

// helper function to generate an RSA key pair
async function genRSAKeyPair() {
    let keySettings = {
        "name": "RSA-OAEP",
        "hash": "SHA-256",
        "modulusLength": 2048,
        "publicExponent": new Uint8Array([0x01, 0x00, 0x01])
    }
    
    let keys = await window.crypto.subtle.generateKey(keySettings, true, ["encrypt", "decrypt"]);
    let exportedPub = await window.crypto.subtle.exportKey('spki', keys.publicKey);
    let exportedPriv = await window.crypto.subtle.exportKey('pkcs8', keys.privateKey);

    return {
        "public": exportedPub,
        "private": exportedPriv
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

    let keyBuffer = await window.crypto.subtle.importKey('pkcs8', key, importedKeySettings, false, ['sign']);

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
