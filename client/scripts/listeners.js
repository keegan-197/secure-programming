async function addListeners() {
    const hello = document.getElementById('hello');
    hello.addEventListener('click', () => sendHello());

    const fileupload = document.getElementById('fileupload');
    fileupload.addEventListener('click', uploadFile);
}