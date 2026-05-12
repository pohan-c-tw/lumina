type TypingIndicatorProps = {
  statusText: string;
};

function TypingIndicator({ statusText }: TypingIndicatorProps) {
  return (
    <div className="flex items-center gap-2 px-1 py-1">
      <div className="flex gap-1">
        <div className="size-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
        <div className="size-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
        <div className="size-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
      </div>
      {statusText && (
        <span className="text-xs text-gray-400">{statusText}</span>
      )}
    </div>
  );
}

export default TypingIndicator;
