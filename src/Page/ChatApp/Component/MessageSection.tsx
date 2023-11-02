import { TMessageRender } from "../Type/Posts";
import MessageItem from "./MessageItem";

export function MessageSection(props: {
  targetUser: string | null;
  messages: Record<string, TMessageRender[]>;
  thisUser: string;
}) {
  const { targetUser, messages, thisUser } = props;
  return (
    <div className={`messages-section ${!targetUser ? "center" : ""}`}>
      {targetUser ? (
        messages[targetUser]?.map(({ payload, timestamp, sender }) => (
          <MessageItem
            from_me={sender === thisUser}
            timestamp={timestamp}
            key={timestamp}
          >
            {payload}
          </MessageItem>
        ))
      ) : (
        <div className="center">No User Selected</div>
      )}
    </div>
  );
}
