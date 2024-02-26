# Repositor Automatico

# Description
Autonomus warehouse robot capable of storing and bringing pallets with goods when employees ask for it using a realtime order products. The goal is to develop a system meant to automate warehouses and track the stock of the goods, as well as the employees's orders.

The realtime orders is being made in a React application which uses websockets, that enables a stateful and a bidirectional communication between the react client and the server. The server side is bing made with Node.js which, at the same time, is connected to a MQTT broker that handles the messages sent to the warehouse robot.
