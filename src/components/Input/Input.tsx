import { DetailedHTMLProps, FormEvent, HTMLAttributes } from "react";

interface InputProps {
  label?: string;
  value?: string;
  onChange?: (e : FormEvent<HTMLInputElement>) => void;
  error?: string;
  hideArrow?: boolean;
  type?: "text" | "password";
  placeholder?: string;
}

export const Input = ({
  label,
  error,
  value,
  hideArrow,
  type = "text",
  ...props
}: InputProps &
  DetailedHTMLProps<HTMLAttributes<HTMLInputElement>, HTMLInputElement>) => {
  return (
    <div className="w-full">
      <div className="flex flex-row items-center gap-2 border-b border-white py-3">
        <input
          value={value}
          type={type}
          className={`w-full bg-transparent px-2 text-white placeholder-white outline-transparent ${error && "text-errorRed"}`}
          {...props}
        ></input>
      </div>
      {error && <p className={`text-errorRed mt-1.5`}>{error}</p>}
    </div>
  );
};
