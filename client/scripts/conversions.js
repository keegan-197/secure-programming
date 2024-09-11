// helper functions to vonvert between types
// can mostly ignore


// Convert an ararybuffer to base64 string
// https://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string
function _arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa(binary);
}

// convert a base64 string to an arraybuffer
// useful for loading keys
function _base64ToArrayBuffer(base64) {
    let arr = [];
    let unencoded = window.atob(base64)
    
    for (char of unencoded) {
        arr.push(char.charCodeAt(0));
    }

    let bytes = new Uint8Array(arr);
    return bytes;
}

// Function to convert PEM to ArrayBuffer
// From ChatGPT
function _pemToArrayBuffer(pem) {
    let b64Lines;
    if (pem.includes("PRIVATE")) {
        b64Lines = pem.replace(/-----(BEGIN|END) PRIVATE KEY-----/g, "").trim();
    } else if (pem.includes("PUBLIC")) {
        b64Lines = pem.replace(/-----(BEGIN|END) PUBLIC KEY-----/g, "").trim();
    }
    const b64 = b64Lines.replace(/\n/g, "");
    const binary = atob(b64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

// Convert a string to an array buffer
// https://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers
function _stringToArrayBuffer(string) {
    let enc = new TextEncoder();
    let messageEncoded = enc.encode(string);
    return messageEncoded.buffer;
}

// Convert an array buffer back into a string
function _arrayBufferToString(arrBuff) {
    let dec = new TextDecoder();
    let messageDecoded = dec.decode(arrBuff);
    return messageDecoded;
}

function _arrayBufferToPem(arrBuff, priv) {
    if (priv == 0) {
        return `-----BEGIN PUBLIC KEY-----\n${_RSAArrayBufferToPemRows(arrBuff)}\n-----END PUBLIC KEY-----`
    } else {
        return `-----BEGIN PRIVATE KEY-----\n${_RSAArrayBufferToPemRows(arrBuff)}\n-----END PRIVATE KEY-----`
    }
}

function _RSAArrayBufferToPemRows(buffer) {
    return insertCharEveryN(_arrayBufferToBase64(buffer), "\n", 64);
}

function _digestToPub(digest) {
    // convert a digest into a public key using the activeUsers list
    for (let server = 0; server < activeUsers.length; server++) {
        for (let participant = 0; participant < activeUsers[server]["clients"].length; participant++) {
            if (digest == activeUsers[server]["digests"][participant]) {
                return activeUsers[server]["clients"][participant];
            }
        }
    }

    console.error("Tried converting a digest to a public key, but none was found")
    return null
}