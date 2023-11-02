import { useEffect, useState } from "react";
import mqtt, { IClientOptions, MqttClient } from "mqtt/dist/mqtt";

export default function useMQTTMessaging() {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [connectionStatus, setConnectStatus] = useState("disconnected");

  const mqttConnect = (host: string, mqttOption: IClientOptions) => {
    setConnectStatus("Connecting");
    setClient(mqtt.connect(host, mqttOption));
  };

  useEffect(() => {
    if (client) {
      console.log(client);
      client.on("connect", () => {
        setConnectStatus("Connected");
      });

      client.on("error", (err) => {
        console.error("Connection error: ", err);
        client.end();
      });

      client.on("reconnect", () => {
        setConnectStatus("Reconnecting");
      });

      client.on("message", (topic, message) => {
        const payload = { topic, message: message.toString() };
        console.log(payload);
      });
    }
  }, [client]);

  const mqttSubscribe = (subscription: { topic: string; qos: 0 | 1 | 2 }) => {
    if (client) {
      const { topic, qos } = subscription;
      client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.log("Subscribe to topics error", error);
          return;
        }
      });
    }
  };

  const mqttPublish = (context: {
    topic: string;
    qos: 0 | 1 | 2;
    payload: string;
  }) => {
    if (client) {
      const { topic, qos, payload } = context;
      client.publish(topic, payload, { qos }, (error) => {
        if (error) {
          console.log("Publish error: ", error);
        }
      });
    }
  };

  return { connectionStatus, client, mqttConnect, mqttPublish, mqttSubscribe };
}
