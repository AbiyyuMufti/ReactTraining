import { useCallback, useEffect, useState } from "react";
import mqtt, { MqttClient } from "precompiled-mqtt";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers } from "../API/ChatAPI";
import { TMessageRender, UserType } from "../Type/Posts";
import { TUserContext } from "../../../Component/Context/AuthProvider";
import { PASSWORD, USERNAME } from "../Constant/MQTTConstants";

const connectingMQTT = (
  thisUserName: string,
  clientSetter: (client: MqttClient) => void,
  messageSetter: (payload: TMessageRender) => void
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
    }
  });
  clientSetter(thisClient);
};

type TMessageState = {
  messages: Record<string, TMessageRender[]>;
  selectedUser: string | null;
};

export default function useChatMessages(user: TUserContext | null) {
  const queryClient = useQueryClient();
  const [stateMessages, setStateMessages] = useState<TMessageState>({
    messages: {},
    selectedUser: null,
  });

  const [client, setClient] = useState<MqttClient | null>(null);

  const selectUserAndMarkAsRead = (targetUser: string) => {
    setStateMessages((prev) => {
      const { messages } = prev;
      const thisUserMessages = messages[targetUser] || [];
      thisUserMessages.forEach((e) => {
        e.read = true;
      });
      return { messages, selectedUser: targetUser };
    });
  };

  const { data: users } = useQuery({
    queryKey: ["getUsers"],
    queryFn: async (): Promise<UserType[] | null> => {
      const users = await getUsers();

      const user_list = users
        ? users?.filter((e) => e.id !== user!.user_id)
        : [];

      if (!client) {
        connectingMQTT(user!.user_name, setClient, (payload) => {
          setStateMessages((prev) => {
            const { messages, selectedUser } = prev;
            const modPayload = {
              ...payload,
              read: selectedUser === payload.sender,
            };
            const prevMessages = messages[payload.sender] || [];
            return {
              messages: {
                ...messages,
                [payload.sender]: [...prevMessages, modPayload],
              },
              selectedUser,
            };
          });
        });
      }

      if (Object.keys(stateMessages.messages).length === 0) {
        const init = user_list.reduce(
          (obj: TMessageState, cur) => {
            obj.messages[cur.name] = [];
            return obj;
          },
          { messages: {}, selectedUser: null }
        );
        setStateMessages(init);
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
    (targetUser: string, payload: TMessageRender) => {
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
        setStateMessages((prev) => {
          const { messages, selectedUser } = prev;
          const prevMessages = messages[targetUser] || [];
          return {
            messages: {
              ...messages,
              [targetUser]: [...prevMessages, { ...payload, read: true }],
            },
            selectedUser,
          };
        });
      }
    },
    [client]
  );

  return {
    users,
    selectUserAndMarkAsRead,
    stateMessages,
    sendMessage,
  };
}
