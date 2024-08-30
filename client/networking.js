var exampleUsers = [
    {
        "public": `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1KZRFjZs2cbrOpj64U5P
AwGJrl/dyCZKyg8i+bMDKpL1HnLleFnYNW2PoLZH1c9M+wW/CaqU8S2rVlPNiAzT
3gdG5+kdgo9Dop+YTN7XWFXfuTKQ6kE9QFfsX+HVBGu5rHb8qdQFwsDAOoVrlRH+
pOWvJd1TW6rn00qnTq3foPdnVzEpUasfmydBgTZMvk48HgJHTCU+r78g/5ZfDv16
/8ukKn1KEqvcB2aoM+fXY0RxvrQYcL6wK16f3v4JdA9MSb0Eb53lzw96b9lyfGtV
P5gNRhqeoHmeQ4Ms3kBhPkKoIb+2Kqe18piAvyNOjaiYODBDz++bZ9l6ao0zMY15
SwIDAQAB
-----END PUBLIC KEY-----`,
        "private": `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA1KZRFjZs2cbrOpj64U5PAwGJrl/dyCZKyg8i+bMDKpL1HnLl
eFnYNW2PoLZH1c9M+wW/CaqU8S2rVlPNiAzT3gdG5+kdgo9Dop+YTN7XWFXfuTKQ
6kE9QFfsX+HVBGu5rHb8qdQFwsDAOoVrlRH+pOWvJd1TW6rn00qnTq3foPdnVzEp
UasfmydBgTZMvk48HgJHTCU+r78g/5ZfDv16/8ukKn1KEqvcB2aoM+fXY0RxvrQY
cL6wK16f3v4JdA9MSb0Eb53lzw96b9lyfGtVP5gNRhqeoHmeQ4Ms3kBhPkKoIb+2
Kqe18piAvyNOjaiYODBDz++bZ9l6ao0zMY15SwIDAQABAoIBAQDQUWYaRpL3/SCv
tPIBCj/pB/ai9pND4g9eRtnSmAXADVtHyvL1pb5jCMOtgyR4Vq5pM0Xk6FEku8Kf
vVUZtMdROPvDcOFR55swkvwWQi/f/7A9s0W31tV0VS3g+FFAFXA9fgsjK+vA0CcA
rXeo/4ngbInapClnIdQdb4LbVwY+npZaufcIucr/KAe7LIgDPYOBj0YrsF8nj38i
sofPdrTRb2yM5AbbbkoqXs9YJl61eSKRQAqXeCDbYn6cdBoAZnG3PJgmVw1GZAuj
qo2/ZeYRrpQASEz8MuSw/JxW9C7yNKu0OvQ2m0UxQcjZ8U6+fcieM2t0byRqRRNY
PjrmGTaBAoGBAOuAaK4w8YOBlh4pAvbV+72F9tU/ng/fEfCmtl4zVDmAIew4FVeU
/54s/+fXgBTTE5etB6meWW4k3GMqrDVJoaZfCt3GYhPyUTKdGvv24m3KOnbKj9ey
qEybofHM8CY76oUbykxLB1ZdgOUvn5EiZV+zrfrTfu6yuLakNd5pH4JrAoGBAOco
tRAuv9z2nf1taZuHV5yC3lEoKqnb6x5c96mjKlfiKsZ3wkNfsNxTiP8YWWjtQfk/
xAHS5y66cH4+50Rs55tRyxMmohEMkCVjmRhjDZNVanPWJJcsd+jb6Q6Fn8u4B0Ox
S5Rv3H0KECii7LnOpI6fNWCReKuFiUbDmXhJGlyhAoGAM2Ow9BnwCc9UT76JTA3D
wkaiZ0RbnIED7Cyk7QdsYKPKQz61wYfdA8o0CYZoB6NLyjRS0LuiLjvS77zXGUW5
BZIF0AFDU7Dz8QSBZ+wm2uhfO57WJq5wtU7c1uPun5lBgsxep6lTr4/12Y0717LW
xjxyQaK3NyU+03Qf4Sm1W4MCgYBTjRsk5kDjFSC14T4ywRChuYuxudrx2lN5fhDm
d9tuOIlNgyvsPkIm4Oq7iYmHq3oVJT8riZeWBD105DejO9nbAg1stqINl4TifsVv
Ux4tCsqXY+eF3MTaneH3JcVEVRgLF6JB3MzNRT3h8kGuR0qjYlhgtzPuiy27Lifi
mkm1AQKBgBrE/T0BnebrB+G5bzTLl7lpugvmr68wlNuloWSvMIFjySNeOUBJVCrX
YnKTOk2Mac2oskdHM6BQw5RKRLe9z0w6fml7+646xLwbonQJ7XF5Mk/Lz9tNf4lu
eGHvVHHGpB/y+MHFlmy9c0lFcwL3NmYN8s2gUCvAA532YeJEDCk6
-----END RSA PRIVATE KEY-----`
    }
]


var activeChats = [ // this will be updated by the client to add new chats
    {
        "destinationServers": ["192.168.1.1", "192.168.1.2"],
        "participantKey": ["rsakey1", "rsakey2", "rsakey3"],
        "participantDigest": "Q+6fz2lL2yQDOM7U7lAtkQ=="
    },
    {
        "destinationServers": ["192.168.1.2"],
        "participantKey": [`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1KZRFjZs2cbrOpj64U5P
AwGJrl/dyCZKyg8i+bMDKpL1HnLleFnYNW2PoLZH1c9M+wW/CaqU8S2rVlPNiAzT
3gdG5+kdgo9Dop+YTN7XWFXfuTKQ6kE9QFfsX+HVBGu5rHb8qdQFwsDAOoVrlRH+
pOWvJd1TW6rn00qnTq3foPdnVzEpUasfmydBgTZMvk48HgJHTCU+r78g/5ZfDv16
/8ukKn1KEqvcB2aoM+fXY0RxvrQYcL6wK16f3v4JdA9MSb0Eb53lzw96b9lyfGtV
P5gNRhqeoHmeQ4Ms3kBhPkKoIb+2Kqe18piAvyNOjaiYODBDz++bZ9l6ao0zMY15
SwIDAQAB
-----END PUBLIC KEY-----`],
        "participantDigest": "R/GsfSEVhCrHWvrGvW+fEQ=="
    },
    {
        "destinationServers": ["192.168.1.1"],
        "participantKey": ["rsakey3"],
        "participantDigest": "78+3guWNvj5uUe6yBBqn4w=="
    }
]

var selectedChat = -1; // global is default

var socket;


function connectToServer(server) {
    socket = new WebSocket(`ws://${server}:8765`)

    socket.addEventListener("open", (event) => { // Connection opened
        socket.send("Hello Server!");
    });

    socket.addEventListener("message", (event) => { // Listen for messages
        console.log("Message from server ", event.data);
    });
}

connectToServer('localhost') // initialise connection
