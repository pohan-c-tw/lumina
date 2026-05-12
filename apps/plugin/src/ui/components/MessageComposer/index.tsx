import Textarea from "@ui/components/base/Textarea";
import ResetSessionButton from "@ui/components/MessageComposer/ResetSessionButton";
import { clsx } from "clsx";

export type MessageComposerProps = {
  value: string;
  onChange: (value: string) => void;
  isProcessing: boolean;
  onSubmit: (value: string) => void;
  onResetSession: () => void;
};

function MessageComposer({
  value,
  onChange,
  isProcessing,
  onSubmit,
  onResetSession,
}: MessageComposerProps) {
  const handleSubmit = () => {
    const text = value.trim();
    if (text && !isProcessing) onSubmit(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-2 p-3">
      <Textarea
        value={value}
        placeholder="輸入問題⋯"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isProcessing}
      />
      <div className="flex items-center justify-between">
        <ResetSessionButton
          onConfirm={onResetSession}
          disabled={isProcessing}
        />
        <button
          onClick={handleSubmit}
          disabled={isProcessing || !value.trim()}
          className={clsx(
            "rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
            "bg-slate-900 text-white",
            "not-disabled:cursor-pointer not-disabled:hover:bg-slate-700",
            "disabled:cursor-not-allowed disabled:opacity-40",
          )}
        >
          送出
        </button>
      </div>
    </div>
  );
}

export default MessageComposer;
