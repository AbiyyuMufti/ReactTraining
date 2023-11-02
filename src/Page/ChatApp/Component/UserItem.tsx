export default function UserItem(props: {
  selected?: boolean;
  user: string;
  onSelect: (data: string) => void;
  unread: number;
  lastMessage?: string;
}) {
  const { selected, user, onSelect, unread, lastMessage } = props;
  return (
    <div
      className={`user-item ${selected ? "selected" : ""}`}
      onClick={() => onSelect(user)}
    >
      <div className="user-name-section">
        <div className="user-name">{user}</div>
        <div className={`message-overview ${!lastMessage ? "no-message" : ""}`}>
          {lastMessage || "No Message"}
        </div>
      </div>
      {unread ? <div className="notification-section">{unread}</div> : null}
    </div>
  );
}
