import { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';
import { mqttConfig } from '../config/mqttConfig';

function parsePayload(raw) {
  const str = raw.toString();
  try {
    const json = JSON.parse(str);
    return json.value ?? json;
  } catch {
    return isNaN(Number(str)) ? str : Number(str);
  }
}

export function useMqtt(topics) {
  const [status, setStatus] = useState('connecting');
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  
  // Use ref to hold the client instance across re-renders
  const clientRef = useRef(null);

  useEffect(() => {
    if (clientRef.current) return;

    setStatus('connecting');
    const client = mqtt.connect(mqttConfig.brokerUrl, mqttConfig.options);
    clientRef.current = client;

    client.on('connect', () => {
      setStatus('connected');
      setError(null);
      // Subscribe to all requested topics
      client.subscribe(topics, { qos: 0 }, (err) => {
        if (err) {
          console.error('MQTT subscription error:', err);
        }
      });
    });

    client.on('reconnect', () => {
      setStatus('reconnecting');
    });

    client.on('error', (err) => {
      setStatus('error');
      setError(err);
      console.error('MQTT error:', err);
    });

    client.on('offline', () => {
      setStatus('offline');
    });

    client.on('close', () => {
      setStatus('offline');
    });

    client.on('message', (topic, payload) => {
      const value = parsePayload(payload);
      const lastUpdated = new Date();
      setData((prev) => ({
        ...prev,
        [topic]: { value, lastUpdated }
      }));
    });

    return () => {
      if (clientRef.current) {
        clientRef.current.end(true); // force close on unmount
        clientRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Topics is static in this app

  return { status, data, error };
}
