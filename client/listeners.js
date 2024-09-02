function addListeners() {
    const priv_entry = document.getElementById('priv-entry');
    priv_entry.addEventListener('input', updateKeys);

    const pub_entry = document.getElementById('pub-entry');
    pub_entry.addEventListener('input', updateKeys);

    const hello = document.getElementById('hello');
    hello.addEventListener('click', sendHello);
}