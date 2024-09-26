/*

Group 8
Cheng Cao, Keegan Jackel, Malte Vollendorff, Po Yu Chen

*/

async function addListeners() {
    const hello = document.getElementById('hello');
    hello.addEventListener('click', () => sendHello());

    const fileupload = document.getElementById('fileupload');
    fileupload.addEventListener('click', uploadFile);
}