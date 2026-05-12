import SuggestionChips from "@ui/components/SuggestionChips";
import TypingIndicator from "@ui/components/TypingIndicator";
import { SUGGESTION_GROUPS } from "@ui/config/suggestions";
import MessageListItem from "./MessageListItem";
import type { Message } from "@ui/types";

export type MessageListProps = {
  messages: Message[];
  isProcessing: boolean;
  statusText: string;
  onSuggestionSelect: (value: string) => void;
};

function MessageList({
  messages,
  isProcessing,
  statusText,
  onSuggestionSelect,
}: MessageListProps) {
  if (!messages.length) {
    return (
      <div className="flex h-full flex-col p-4">
        <div className="flex flex-1 flex-col items-center justify-center gap-1.5">
          <p className="text-sm font-semibold text-gray-800">Lumina</p>
          <p className="text-center text-xs text-gray-400">
            你的 Figma 檔案 AI 導覽助理
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs text-gray-600">試試這些問題：</p>
          <SuggestionChips
            groups={SUGGESTION_GROUPS}
            onSelect={onSuggestionSelect}
          />
          {isProcessing && (
            <div className="mt-3">
              <TypingIndicator statusText={statusText} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-3">
      {messages.map((message) => (
        <MessageListItem key={message.id} message={message} />
      ))}
      {isProcessing && <TypingIndicator statusText={statusText} />}
    </div>
  );
}

export default MessageList;
