var exampleUsers = [
    {
        "public": `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA50KaF0Pqjk/pBhfr20or
KqKW5iYoCV2lWeBykE98/+qsHTr7EKz7H3BotAHwn9BLvHymXRcZK34accWo7GPR
7B7KNMxHuimQeX5rO5V05Wb2EertCDGDk2K+5KKHpMcwwAVpIV/Xt/RCA5o8x1Qh
2WK8txr2jmBso4k0daJioAR1IfJsmzrBacERnapY5ZbKMbzjnsk+lH5D407DiVf0
9XfT80C8Y7gpD0glHIoBT5dwj1t5eDIZWjWtnZelLKWasT3hYcnuF/eikyky0NgO
b4oAxiCS1jRRMq5kQbSjUtydLWb8P6jT+sp6jNMdDM9r3VMQqasD2xLi6FJJpq4A
hwIDAQAB
-----END PUBLIC KEY-----`,
        "private": `-----BEGIN RSA PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDnQpoXQ+qOT+kG
F+vbSisqopbmJigJXaVZ4HKQT3z/6qwdOvsQrPsfcGi0AfCf0Eu8fKZdFxkrfhpx
xajsY9HsHso0zEe6KZB5fms7lXTlZvYR6u0IMYOTYr7kooekxzDABWkhX9e39EID
mjzHVCHZYry3GvaOYGyjiTR1omKgBHUh8mybOsFpwRGdqljllsoxvOOeyT6UfkPj
TsOJV/T1d9PzQLxjuCkPSCUcigFPl3CPW3l4MhlaNa2dl6UspZqxPeFhye4X96KT
KTLQ2A5vigDGIJLWNFEyrmRBtKNS3J0tZvw/qNP6ynqM0x0Mz2vdUxCpqwPbEuLo
UkmmrgCHAgMBAAECggEAcGZJmJc08JhcTM7hnsKsulst9oyDFxJB5K4XYJaRzZzU
rJxXHKLGp2AuM5dhyXsm5GS9Qy+P1zjCR5vnX4WgqR/J7eF/1zaOds5/9gTNPRZO
8SR6smnGZqMu3tc0EF2UDzBSCZuYsFrynuefNM5qaUr5KBHd1hN9mfp82dPkFZtI
NYCNaruHcO2v9wBt8AkLwKMurDtYYGNRV9U+VY66rJ/BFAKQwAZpK3OmOYtVJE7v
t4jhoBX+L6mpEja7KHI7O5xjti8z1HwjexDjtxNGv9CncB7vuH1sdkRMVC5qNYfB
tevBy5g5GiYd24nmBNLBiMW9+lJyYGCJ+z6MjallcQKBgQD/0PTQDo5cy+H0y867
tfjEH+m7M5NOemI3VVX9m03eSkwygP4xN+WKnZKbrIZRjMP7/XyEZ6VdzppMezuF
BXE0JojvEwbYJ6seonmJXxH7MnCaL92NapQy7o9057yfp0zhGwDx3ugBSdvCPc6X
le/j4ZvE1JCQfPaG1N18M4opKQKBgQDnbSE9Zet5MhAx5SKg85sRXTISSCMu0POy
pPPgmRKU6vKu9VIjHteA+VFJdD7RE7NtkutAotUw964+hSzlzb4bkx/gCP6G0djl
g8hu9cWsuh5I/zBWLAUmljhLcVFwIPsrljNIGUGyjGtEnra2IVBd3ZVXnTHx6xpn
YK3DBjEiLwKBgQCMYqKGrwZHPIfirBnmf0Vmc9Dzr6kOLzFJBmarRxgjfgh0yr80
SWWJfVGgZrxLcoF2/zPfAXYJlcCtag9Ov57RLLiG4p0l8BcDN8yUq3yVqqeKpevi
mHN9w9csI6QqxUf2XLhXA6m0U1DrNrnyDBFasEuoZ7Jx6HHtqlFlwG74iQKBgC1S
xxbCNiqnLlrHOE/zRaRR7zN7Y0CQ9ZlACu8qq2P025B+RRbRvHzq1wues4q45AQK
qP4gpcYQS9S8uj1LXPcDilOTD14SDPtuIrvwcEVSsgmzyKCnwF59PwsvZzahju9L
XEG7iI1SSNPIjZn/zkCD2/Kru5NYavRiD8XJGahLAoGATQ3YE7aWOVmxB279GYCS
QE6ZFFNcnqjPbDcQ82FiRj/f9+3CD0fcCKP53/qHeu3j1KSjLnHJqsU4L6Al/LJw
Dm6gFvLqqZVBsn1VYXXa5XiSlTNCRQoL2pmAokB6E4ruTTJ+mymJAbSHhuKQYePn
uEdhE0EQ4ChJwdsnUcxvFqY=
-----END RSA PRIVATE KEY-----`
    }
]

var selfKeys = {
    "public": `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6rAFjBu8sIIkCylL6b1v
R5lAhRmF3/z6nPULDVz1rY6QfJpIn8pt3MzKL66m4LWIRXvMinaN/CG+buwEgDZy
PXbjRvP0li1/fgAXR8l1VPS8okNlVO0sPpNjyGYpGN1Nq/oJqstdPIcQpL8BC5IQ
xSVcViba+31r1lzDZE1FXAdpF/lK2WLqNvT3DlEB4ldftRQvbFgx11sNhEygKMdF
jYDf1TkpVhLw3h4ydZvtw64PxSahnKa8pTqSrGTfo3eYTzEiL64jnO401EX0dJH2
KvQrItL10e9tFMbCofLdcQXeRQDKAGFCU6TekE4YDdI+B1PN4tm5VFnBzgHTAEsR
AQIDAQAB
-----END PUBLIC KEY-----`,
    "private": `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDqsAWMG7ywgiQL
KUvpvW9HmUCFGYXf/Pqc9QsNXPWtjpB8mkifym3czMovrqbgtYhFe8yKdo38Ib5u
7ASANnI9duNG8/SWLX9+ABdHyXVU9LyiQ2VU7Sw+k2PIZikY3U2r+gmqy108hxCk
vwELkhDFJVxWJtr7fWvWXMNkTUVcB2kX+UrZYuo29PcOUQHiV1+1FC9sWDHXWw2E
TKAox0WNgN/VOSlWEvDeHjJ1m+3Drg/FJqGcprylOpKsZN+jd5hPMSIvriOc7jTU
RfR0kfYq9Csi0vXR720UxsKh8t1xBd5FAMoAYUJTpN6QThgN0j4HU83i2blUWcHO
AdMASxEBAgMBAAECggEAAdWnjHJmz6Ury5XKfvC0+Qz/0+6ItTEawy139TY44i8B
LoUs/ElKgbFs4vGpQqxOnPbwWNR/jIUVwlOYXyl1zAjU8t/7NW2Uf59X7z7qGrR5
UUYoOZFLUU+pBfb0+ymXNukC6HWzpFKMuPH4i87r8EOYEMEX4QOIa1YBLcR8HmGZ
XdOJ9Pi1KLTxMROVpl8vroX0erJhh+/OJizZLmu3ebSbXJJoFR2qQEm85zEzsKhV
PmkM2cSzHRZCI0o3TDPqHR15MUT+zD5l7CnU5uC4nNYlEvePUMYE/tSk7rqlPF9B
KZ7WTBHqNHJOqFZ/+l5gcbajgXhhBwUH+g27drN0MQKBgQD3Cwaei6wqvPvkB9R8
D5O794EX3AmzfmwoWKcnIxnQZacguqyLZfvkSwoBpKZsWyxU5f1OEOt5vTOPUD3l
FU5fSzbblROROeIA7yupCHbq1grxm66QaseVnsLVFDAjH5wjfZFStRYcwyaAGwOn
YMej8qxVDgT/opEnBcJWLW+asQKBgQDzMlDxUZkTZ872mIpWr7YXAL8YXMBvYppX
ZEzxOHKTpQumt3nFHxgFcjK7lDmN2I1FslKzq+/JzkNtJXI7lmTHMffvmRrFvG0n
dyrwd4GEipfhro0Y4HIBcqKTFBvA5iO5R6t4dwEt8O2/u4NPWxIA4Qzs7L+9RjHq
yOSgzcbPUQKBgQDDf6c6Wn/hxnJ0Dzo4/z7DNmejkQ7gS8Cd4SJOV3m7MGalAPVA
z3EaRcPibwEAqNoZSXQ+jic6zN57oF2K52SBBw2fkYbNm4fdg2gCuV8aEk7QyonH
YakWH3BBnVtGwGIYt+sED6gzFMBoCnjGwVDbzlRQburHvkeuIOGcvxId0QKBgCX7
6eCHGh2JzS1+zbyUXSBioXYwpm2/PNQBenMCmgKteJBlf8NmA951466gjAy3kfkc
zQX7CMzARo+5lYnxB3SFPXBSvXe84l+ToUVFpRkKfIZnOOp1w9iuCu5l6Z/LUjES
HJoIHEsMolWb9/phAwLYI6itoZTybcF59xuWiELBAoGBAMhUjXfQVzG72VuTlarR
rZ0/241KcXL53Gx5Nywk8TseKUhh3v4nMZoK4QPF4gPALobxxVALJ8DQZHPHrhvv
0eP6c8X052tur+JatLMGdoXQbAUcbbHZp9SJ6UmRenvqRTUa2US3GCM8fyE450qS
XV8Kus7y57J+zxF9jfyP76PQ
-----END PRIVATE KEY-----`
}

var activeChats = [ // this will be updated by the client to add new chats
    {
        "destinationServers": ["192.168.1.1", "192.168.1.1", "192.168.1.2"],
        "participantKey": ["rsakey1", "rsakey2", "rsakey3"], // actual public keys of each participant
        "participantDigest": "Q+6fz2lL2yQDOM7U7lAtkQ==" // list of participant public keys, sorted, joined, hashed, then b64'd
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
        receivedMessage(event.data); // handle every message received
    });
}

connectToServer('localhost') // initialise connection
