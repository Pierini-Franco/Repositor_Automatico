# Repositor Automatico

## Index

* [Description](#description)
* [Demo and overview](#demo-and-overview)
* [Notes](#notes)

# Description
Autonomus warehouse robot capable of storing and bringing goods pallets using a realtime order products. The goal is to develop a system meant to automate warehouses and track the stock of the goods, as well as the employees's orders.

# Demo and overview
MQTT broker receiving employee's order in JSON format.

https://github.com/Pierini-Franco/Repositor_Automatico/assets/105557226/09ac5b65-eae8-4226-86f4-ccc1e2ff2913

The `React app` provides a way to order multiple products in a single order. At the same time, employees can order a single product 

| Order multiples products | Order a single product |
|         :---:            |          :---:         |
| ![client-and-mqtt-broker-gif-1](https://github.com/Pierini-Franco/Repositor_Automatico/assets/105557226/2f59dbdc-3959-4e8f-99a4-67fed2ebf63f) | ![client-and-mqtt-broker-gif-2](https://github.com/Pierini-Franco/Repositor_Automatico/assets/105557226/e300a218-32c6-4131-8a59-f00c9db813b6) |

> [!NOTE]
> 
> _The React client order is sent throught websocket to a `Node.js server`, which re-send the products order to the `MQTT broker`_.

# Notes
This project is being develop and we will be posting the latest updates.

Leave a ⭐ if you are interested in this repo!

