// File: src/broker/mqttClient.ts
import mqtt, { MqttClient } from "mqtt";

let client: MqttClient | null = null;
let currentConfig: { url?: string; username?: string; password?: string } | null = null;

const DEFAULT_RECONNECT = 2000;

/**
 * Convierte URL MQTT a WebSocket para compatibilidad con navegadores.
 * Para HiveMQ Cloud: mqtts://host:8883 -> wss://host:8884/mqtt
 */
function normalizeWsUrl(url: string): string {
  const trimmed = url.trim();

  // Si ya es una URL WebSocket, devolverla tal cual
  if (trimmed.startsWith('ws://') || trimmed.startsWith('wss://')) {
    return trimmed;
  }

  // Convertir URL MQTT a WebSocket
  if (trimmed.startsWith('mqtt://')) {
    return trimmed.replace('mqtt://', 'ws://').replace(':1883', ':1884') + '/mqtt';
  }

  if (trimmed.startsWith('mqtts://')) {
    return trimmed.replace('mqtts://', 'wss://').replace(':8883', ':8884') + '/mqtt';
  }

  // Si no tiene protocolo, asumir mqtts y convertir
  return `wss://${trimmed.replace(':8883', ':8884')}/mqtt`;
}

export const connectBroker = (
  config?: { url?: string; username?: string; password?: string; reconnectPeriod?: number },
  forceReconnect = false
): MqttClient => {
  const urlInput = config?.url || currentConfig?.url;
  if (!urlInput) throw new Error("MQTT URL no proporcionada");

  const username = config?.username || currentConfig?.username;
  const password = config?.password || currentConfig?.password;
  const reconnectPeriod = config?.reconnectPeriod ?? DEFAULT_RECONNECT;

  // Reiniciar cliente siempre si cambia config
  if (client && (forceReconnect || urlInput !== currentConfig?.url)) {
    try { client.end(true); } catch {}
    client = null;
  }

  const wsUrl = normalizeWsUrl(urlInput);
  console.log("🔧 Usando WebSocket URL:", wsUrl);

  currentConfig = { url: urlInput, username, password };

  client = mqtt.connect(wsUrl, {
    username,
    password,
    reconnectPeriod,
    clean: true,
  });

  client.on("connect", () => console.log("✅ MQTT frontend conectado"));
  client.on("error", (err) => console.error("❌ MQTT frontend error", err));
  client.on("reconnect", () => console.log("🔄 MQTT frontend reconectando..."));

  return client;
};

export const disconnectBroker = () => {
  if (!client) return;
  try { client.end(true); } catch {}
  client = null;
  currentConfig = null;
};

export const getClient = (): MqttClient | null => client;

export const publish = (topic: string, payload: string) => {
  if (!client) return console.warn("No hay cliente MQTT conectado");
  client.publish(topic, payload, { qos: 0 }, (err) => {
    if (err) console.error("Error publicando MQTT", err);
  });
};

export const subscribe = (topic: string, callback?: (topic: string, message: Buffer) => void) => {
  if (!client || !client.connected) return console.warn("No hay cliente MQTT conectado o no está conectado");
  try {
    client.subscribe(topic, { qos: 0 }, (err) => {
      if (err) console.error("Error suscribiéndose MQTT", err);
    });
    if (callback) {
      client.on("message", callback);
    }
  } catch (err) {
    console.error("Error en subscribe:", err);
  }
};

export const unsubscribe = (topic: string) => {
  if (!client || !client.connected) return console.warn("No hay cliente MQTT conectado o no está conectado");
  try {
    client.unsubscribe(topic, (err) => {
      if (err) console.error("Error desuscribiéndose MQTT", err);
    });
  } catch (err) {
    console.error("Error en unsubscribe:", err);
  }
};

export const getConnectionStatus = (): boolean => {
  return client?.connected || false;
};
