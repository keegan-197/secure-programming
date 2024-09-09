async function addListeners() {
    // const priv_entry = document.getElementById('priv-entry');
    // priv_entry.addEventListener('input', await updateKeys);

    // const pub_entry = document.getElementById('pub-entry');
    // pub_entry.addEventListener('input', await updateKeys);

    const hello = document.getElementById('hello');
    hello.addEventListener('click', () => sendHello());

    const fileupload = document.getElementById('fileupload');
    fileupload.addEventListener('click', uploadFile);
}