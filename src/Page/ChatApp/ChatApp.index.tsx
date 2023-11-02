import { useContext } from "react";

import AuthContext from "../../Component/Context/AuthProvider";
import InputMessage from "./Component/InputMessage";
import UserItem from "./Component/UserItem";
import useChatMessages from "./Hooks/useChatMessages";
import { MessageSection } from "./Component/MessageSection";

import "./style.scss";

function ChatApp() {
  const { user: thisUser } = useContext(AuthContext);
  const { stateMessages, sendMessage, selectUserAndMarkAsRead } =
    useChatMessages(thisUser);

  const { messages, selectedUser: targetUser } = stateMessages;
  const users = Object.keys(stateMessages.messages).filter(
    (username) => username !== thisUser?.user_name
  );

  return (
    <div className="chat-main">
      <div className="container users-container">
        {users.map((username) => {
          return (
            <UserItem
              user={username}
              key={username}
              onSelect={(user) => selectUserAndMarkAsRead(user)}
              selected={username === targetUser}
              unread={
                messages[username]
                  ? messages[username]!.filter((e) => !e.read).length
                  : 0
              }
              lastMessage={messages[username]?.at(-1)?.payload}
            />
          );
        })}
        <div className="empty-space"></div>
      </div>
      <div className="container messages-container">
        <MessageSection
          targetUser={targetUser}
          thisUser={thisUser?.user_name || ""}
          messages={messages}
        />
        <InputMessage
          onSendMessage={(payload) =>
            targetUser && sendMessage(targetUser, payload)
          }
          user={thisUser?.user_name}
          target={targetUser}
        />
      </div>
    </div>
  );
}

export default ChatApp;
