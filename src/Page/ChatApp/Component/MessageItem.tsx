import { ReactNode } from "react";

export default function MessageItem(props: {
  children: ReactNode;
  from_me: boolean;
  timestamp: number;
}) {
  const { children, from_me, timestamp } = props;
  const time = new Date(timestamp);
  const timeString = `${time.getHours().toString().padStart(2, "0")}:${time
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
  return (
    <div className={`message-item ${from_me ? "from-me" : ""}`}>
      <div className="message-content">
        <div className="timestamp-container">{timeString}</div>
        <div className="message-payload">{children}</div>
      </div>
    </div>
  );
}
