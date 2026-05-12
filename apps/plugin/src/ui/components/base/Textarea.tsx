import { clsx } from "clsx";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={clsx(
        "field-sizing-content min-h-16 w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus-visible:border-slate-900 focus-visible:ring-1 focus-visible:ring-slate-900",
        className,
      )}
      {...props}
    />
  );
}

export default Textarea;
