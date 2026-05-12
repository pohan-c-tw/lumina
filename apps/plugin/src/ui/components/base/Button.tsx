import { clsx } from "clsx";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "border px-2 py-1",
        "not-disabled:cursor-pointer not-disabled:hover:bg-gray-200",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export default Button;
