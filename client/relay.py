import asyncio
import websockets

# Store connected clients
clients = set()


async def relay_message(websocket, path):
    # Register new client
    clients.add(websocket)
    try:
        async for message in websocket:
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
