import { clsx } from "clsx";

export type ResetSessionButtonProps = {
  disabled?: boolean;
  onConfirm: () => void;
};

function ResetSessionButton({ disabled, onConfirm }: ResetSessionButtonProps) {
  const handleClick = () => {
    const confirmed = window.confirm("確定要重置對話嗎？");
    if (confirmed) onConfirm();
  };

  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className={clsx(
        "text-xs text-gray-400",
        "not-disabled:cursor-pointer not-disabled:hover:text-gray-600",
        "disabled:cursor-not-allowed disabled:opacity-50",
      )}
    >
      重置對話
    </button>
  );
}

export default ResetSessionButton;
