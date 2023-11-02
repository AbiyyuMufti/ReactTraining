import { useCallback, useEffect, useState } from "react";
import mqtt, { MqttClient } from "precompiled-mqtt";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers } from "../API/ChatAPI";
import { TMessagePayload, TMessageRender, UserType } from "../Type/Posts";
import { TUserContext } from "../../../Component/Context/AuthProvider";
import { PASSWORD, USERNAME } from "../Constant/MQTTConstants";

const connectingMQTT = (
  thisUserName: string,
  clientSetter: (client: MqttClient) => void,
  messageSetter: (payload: TMessagePayload) => void,
  currentSelected: string | null
) => {
  const thisClient = mqtt.connect("mqtt://localhost:1883", {
    username: USERNAME,
    password: PASSWORD,
    clientId: thisUserName + (Math.random() * 1000).toString(16),
    reconnectPeriod: 1000,
    keepalive: 10,
    connectTimeout: 30000,
    protocol: "mqtt",
  });

  thisClient.subscribe(thisUserName, { qos: 0 }, (e) => {
    if (e) {
      console.log("subscribte to topics error ", e);
      return;
    }
  });

  thisClient.on("connect", (e) => {
    console.log("Connection status", e);
  });
  thisClient.on("error", (err) => {
    console.log("Connection error: ", err);
  });
  thisClient.on("reconnect", () => {
    console.log("Reconnecting");
  });
  thisClient.on("message", (topic, messages) => {
    if (topic === thisUserName) {
      const payload: TMessageRender = JSON.parse(messages.toString());
      messageSetter(payload);
      console.log(currentSelected);
    }
  });
  clientSetter(thisClient);
};

export default function useChatMessages(user: TUserContext | null) {
  const queryClient = useQueryClient();
  const [targetUser, setTargetUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, TMessageRender[]>>(
    {}
  );
  const [client, setClient] = useState<MqttClient | null>(null);

  const { data: users } = useQuery({
    queryKey: ["getUsers"],
    queryFn: async (): Promise<UserType[] | null> => {
      const users = await getUsers();

      const user_list = users
        ? users?.filter((e) => e.id !== user!.user_id)
        : [];

      if (!client) {
        connectingMQTT(
          user!.user_name,
          setClient,
          (payload) => {
            setMessages((prev) => {
              const prevMsg = prev[payload.sender] || [];
              return {
                ...prev,
                [payload.sender]: [...prevMsg, { ...payload, read: false }],
              };
            });
          },
          targetUser
        );
      }

      if (Object.keys(messages).length === 0) {
        setMessages(
          user_list.reduce((obj: Record<string, TMessageRender[]>, cur) => {
            obj[cur.name] = [];
            return obj;
          }, {})
        );
      }

      return user_list;
    },
  });

  useEffect(() => {
    return () => {
      if (client || !user) {
        client!.end(false, {}, () => {
          setClient(null);
          console.log("disconnecting");
          queryClient.invalidateQueries(["getUsers"]);
        });
      }
    };
  }, [client, user, queryClient]);

  const sendMessage = useCallback(
    (targetUser: string, payload: TMessagePayload) => {
      if (client) {
        client.publish(
          targetUser,
          JSON.stringify(payload),
          { qos: 0 },
          (error) => {
            if (error) {
              console.log("Publish error: ", error);
            }
          }
        );

        setMessages((prev) => {
          const prevMsg = prev[targetUser] || [];
          return {
            ...prev,
            [targetUser]: [...prevMsg, { ...payload, read: true }],
          };
        });
      }
    },
    [client]
  );

  const setRead = (target: string) => {
    if (messages[target]) {
      let toRead = messages[target]!.map((e) => {
        e.read = true;
        return e;
      });
      console.log(toRead);
      setMessages((prev) => ({ ...prev, [target]: [...toRead] }));
    }
  };

  return {
    users,
    targetUser,
    setTargetUser,
    messages,
    sendMessage,
    setRead,
  };
}
