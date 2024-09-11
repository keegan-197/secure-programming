import asyncio
import websockets
import json

# Store connected clients
clients = set()
pub_keys = set()

async def relay_message(websocket, path):
    # Register new client
    clients.add(websocket)
    try:
        async for message in websocket: 
            loaded = json.loads(message)
            if (loaded["type"] == "client_list_request"):
                client_list = {
                    "type": "client_list",
                    "servers": [
                        {
                            "address": "temp",
                            "clients": []
                        }
                    ]
                }

                for keys in list(pub_keys):
                    client_list["servers"][0]["clients"].append(keys)


                await websocket.send(json.dumps(client_list))
            elif (loaded["type"] == "signed_data"):
                if (loaded["data"]["type"] == "hello"):
                    pub_keys.add(loaded["data"]["public_key"])


            # Relay message to all other clients
            for client in clients:
                if client != websocket:
                    await client.send(message)
    except websockets.exceptions.ConnectionClosed as e:
        print(f"Client disconnected: {e}")
    finally:
        # Unregister client
        clients.remove(websocket)


async def main():
    async with websockets.serve(relay_message, "localhost", 8765):
        print("Server started on ws://localhost:8765")
        await asyncio.Future()  # run forever

asyncio.run(main())
