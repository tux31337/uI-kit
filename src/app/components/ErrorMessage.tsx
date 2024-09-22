import { ReactNode } from "react";

type ErrorMessageProps = {
  children: ReactNode;
};

export default function ErrorMessage({ children }: ErrorMessageProps) {
  return <p className="text-xs text-gv-status-error">{children}</p>;
}
