"use client";
import ErrorMessage from "./ErrorMessage";
import IconButton from "./IconButton";

type DefaultTextFieldProps = {
  errorMessage: string;
  iconPath: string;
  alt: string;
  handleIconClick: () => {};
  placeholder: string;
  onChange: () => {};
  value: string;
};

export default function DefaultTextField(props: DefaultTextFieldProps) {
  const {
    errorMessage,
    iconPath,
    alt,
    handleIconClick,
    placeholder,
    onChange,
    value,
  } = props;

  return (
    <div>
      <input
        placeholder={placeholder}
        value={value}
        type="text"
        onChange={onChange}
      />
      <IconButton handleClick={handleIconClick} alt={alt} iconPath={iconPath} />
      <ErrorMessage>{errorMessage}</ErrorMessage>
    </div>
  );
}
