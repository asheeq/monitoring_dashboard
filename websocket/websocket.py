import asyncio
import websockets


async def send(websocket, path):
    async for message in websocket:
        print(message)
        await websocket.send(message)


start_server = websockets.serve(send, "localhost", 8765)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()

# from time import sleep
# from json import dumps
#
#
# def get_network_data():
#     with open('/proc/net/dev') as file:
#         received = 0
#         transmitted = 0
#
#         for i, line in enumerate(file.readlines()):
#             if i < 2:
#                 continue
#             # Column 1 -> received bytes
#             # Column 9 -> transmitted bytes
#             received += int(line.split()[1])
#             transmitted += int(line.split()[9])
#
#     return received, transmitted
#
#
# def get_network_usage():
#     orcv, otrns = get_network_data()
#     sleep(1)
#     nrcv, ntrns = get_network_data()
#
#     return (nrcv - orcv), (ntrns - otrns)
#
#
# async def hello(websocket, path):
#     while True:
#         orcv, otrns = get_network_usage()
#         ip = websocket.local_address[0]
#         data = dumps({"Received": orcv, "Transmitted": otrns, "Ip": ip})
#         print(websocket.local_address)
#         await websocket.send(data)
