import { TMessageRender } from "../Type/Posts";

export default function InputMessage(props: {
  onSendMessage: (payload: TMessageRender) => void;
  user?: string;
  target: string | null;
}) {
  const { onSendMessage, user, target } = props;
  return (
    <form
      className="input-section"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const messagePayload = formData.get("messages")?.toString();
        if (messagePayload && user) {
          onSendMessage({
            timestamp: new Date().getTime(),
            payload: messagePayload,
            sender: user,
            read: false,
          });
        }
        e.currentTarget.reset();
      }}
    >
      <input
        type="text-area"
        name="messages"
        id="messages"
        placeholder="Type..."
      />
      <button type="submit" disabled={!target}>
        Send
      </button>
    </form>
  );
}
