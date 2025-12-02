import mqtt from "mqtt";
import { useEffect, useState } from "react";

const BROKER_URL = "wss://3f187645294a400cbe2d87a2ec16ec53.s1.eu.hivemq.cloud:8884/mqtt";
const USERNAME = "diegokld";
const PASSWORD = "Don_diego123";
const TOPIC_SIGNALS = "lab/diego/signals";

let client: mqtt.MqttClient | null = null;

export const connectBroker = () => {
  client = mqtt.connect(BROKER_URL, {
    username: USERNAME,
    password: PASSWORD,
    reconnectPeriod: 1000,
  });

  client.on("connect", () => {
    console.log("MQTT conectado desde frontend");
    client?.subscribe(TOPIC_SIGNALS, (err) => {
      if (err) console.error("Error suscribiéndose al tópico", err);
      else console.log("Suscrito al tópico:", TOPIC_SIGNALS);
    });
  });

  client.on("error", (err) => console.error("Error MQTT", err));

  return client;
};

export const mqttClient = () => client;
