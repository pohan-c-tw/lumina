import { clsx } from "clsx";
import ReactMarkdown from "react-markdown";
import type { Message } from "@ui/types";

function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl bg-slate-900 px-3 py-2 text-sm text-white">
        {text}
      </div>
    </div>
  );
}

function AssistantMessage({
  text,
  variant,
}: {
  text: string;
  variant: "info" | "error";
}) {
  return (
    <div className="flex justify-start">
      <div
        className={clsx(
          "max-w-[90%] rounded-2xl px-3 py-2 text-sm",
          variant === "error"
            ? "border border-red-200 bg-red-50 text-red-700"
            : "bg-gray-100 text-gray-800",
        )}
      >
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            strong: ({ children }) => (
              <strong className="font-semibold">{children}</strong>
            ),
            ul: ({ children }) => (
              <ul className="mb-2 list-disc pl-4 last:mb-0">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-2 list-decimal pl-4 last:mb-0">{children}</ol>
            ),
            li: ({ children }) => <li className="mb-0.5">{children}</li>,
            h1: ({ children }) => (
              <h1 className="mb-1 text-sm font-bold">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="mb-1 text-sm font-bold">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                {children}
              </h3>
            ),
            code: ({ children }) => (
              <code className="rounded bg-gray-200 px-1 py-0.5 font-mono text-xs">
                {children}
              </code>
            ),
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export type MessageListItemProps = {
  message: Message;
};

function MessageListItem({ message }: MessageListItemProps) {
  if (message.role === "user") {
    return <UserMessage text={message.text} />;
  }

  return (
    <AssistantMessage
      text={message.text}
      variant={message.variant === "error" ? "error" : "info"}
    />
  );
}

export default MessageListItem;
