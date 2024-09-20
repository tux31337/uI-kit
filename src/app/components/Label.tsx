interface ILabelProps {
  htmlFor: string;
  children: string;
}

export default function Label({ htmlFor, children }: ILabelProps) {
  return (
    <label htmlFor={htmlFor} className="text-base font-extralight">
      {children}
    </label>
  );
}
