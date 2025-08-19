import ReactMarkdown from "react-markdown";

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
        <div className={bubbleClass}>
          {isUser ? (
            content
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="mb-3 leading-relaxed">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold">{children}</strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
                code: ({ children }) => (
                  <code className="bg-neutral-200 text-sm px-1.5 py-0.5 rounded font-mono">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-neutral-100 text-sm p-4 rounded-lg my-4 overflow-x-auto font-mono">
                    {children}
                  </pre>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
