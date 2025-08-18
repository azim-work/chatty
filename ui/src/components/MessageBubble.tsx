type Props = {
  role: "user" | "assistant";
  content: string;
};

const MessageBubble = ({ role, content }: Props) => {
  const isUser = role === "user";
  return (
    <div
      className={`max-w-xl px-4 py-2 rounded-lg ${
        isUser
          ? "bg-blue-500 text-white self-end ml-auto"
          : "bg-white text-black self-start mr-auto"
      }`}
    >
      {content}
    </div>
  );
};

export default MessageBubble;
