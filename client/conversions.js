
// Convert an ararybuffer to base64 string
// https://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string
function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

// Function to convert PEM to ArrayBuffer
// From ChatGPT
function _pemToArrayBuffer(pem) {
    const b64Lines = pem.replace(/-----(BEGIN|END) PUBLIC KEY-----/g, "").trim();
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