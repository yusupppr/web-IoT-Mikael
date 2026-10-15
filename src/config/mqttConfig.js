const brokerUrl = import.meta.env.VITE_MQTT_BROKER_URL || 'wss://broker.emqx.io:8084/mqtt';

const clientId = `dashboard_${Math.random().toString(16).slice(2, 10)}`;

export const mqttConfig = {
  brokerUrl,
  options: {
    clientId,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 3000,
    keepalive: 30,
  }
};
