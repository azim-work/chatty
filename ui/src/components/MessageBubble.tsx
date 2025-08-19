type Props = {
  role: "user" | "assistant";
  content: string;
};

const MessageBubble = ({ role, content }: Props) => {
  const isUser = role === "user";

  const containerClass = "max-w-xl";
  const bubbleClass = isUser
    ? "bg-neutral-800 text-white px-4 py-2 rounded-b-xl rounded-tl-xl"
    : "bg-gray-50 text-gray-800 text-lg px-4 py-2 rounded-b-xl rounded-tr-xl";

  return (
    <div
      className={`flex flex-col ${
        isUser ? "items-end" : "items-start"
      } w-full mt-2`}
    >
      <div className={containerClass}>
        <div className={bubbleClass}>{content}</div>
      </div>
    </div>
  );
};

export default MessageBubble;
