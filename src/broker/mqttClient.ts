// File: src/broker/mqttClient.ts
import mqtt, { MqttClient } from 'mqtt';

const BROKER_URL = 'wss://3f187645294a400cbe2d87a2ec16ec53.s1.eu.hivemq.cloud:8884/mqtt';
const USERNAME = 'diegokld';
const PASSWORD = 'Don_diego123';
const RECONNECT_PERIOD = 2000;

let client: MqttClient | null = null;

export const connectBroker = (): MqttClient => {
  if (client && client.connected) return client;

  client = mqtt.connect(BROKER_URL, {
    username: USERNAME,
    password: PASSWORD,
    reconnectPeriod: RECONNECT_PERIOD,
    // ws uses wss path; if using mqtts on Node backend, change accordingly
  });

  client.on('connect', () => {
    console.log('MQTT frontend conectado');
  });

  client.on('error', (err) => {
    console.error('MQTT frontend error', err);
  });

  client.on('reconnect', () => {
    console.log('MQTT frontend reconectando...');
  });

  return client;
};

export const mqttClient = () => client;

export const publish = (topic: string, payload: string) => {
  const c = client ?? connectBroker();
  if (!c) return;
  c.publish(topic, payload, { qos: 0 }, (err) => {
    if (err) console.error('Error publicando MQTT', err);
  });
};
