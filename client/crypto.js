async function generateAESKey() {
    // generate an IV, AES key, and settings object
    let new_iv = window.crypto.getRandomValues(new Uint8Array(16));

    let aes_settings = { name: "AES-GCM", iv: new_iv, length: 256 };

    let generated_key = await window.crypto.subtle.generateKey(aes_settings, true, ["encrypt", "decrypt"]);

    return [new_iv, generated_key, aes_settings]
}

async function sha256Digest(list) { // create a digest from a list
    // essentially fingerprints the entries of a list
    let digest = await window.crypto.subtle.digest("SHA-256", _stringToArrayBuffer(list.sort().join()));
    let bytes = new Uint16Array(digest);
    return _arrayBufferToBase64(bytes);
}