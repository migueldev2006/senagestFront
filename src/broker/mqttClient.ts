// File: src/broker/mqttClient.ts
import mqtt, { MqttClient } from "mqtt";

let client: MqttClient | null = null;
let currentConfig: { url?: string; username?: string; password?: string } | null = null;

const DEFAULT_RECONNECT = 2000;

/**
 * No modificar la URL.
 * El usuario debe ingresar la URL EXACTA del WebSocket del broker.
 * Esto permite compatibilidad TOTAL con cualquier servicio MQTT.
 */
function normalizeWsUrl(url: string): string {
  return url.trim();
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