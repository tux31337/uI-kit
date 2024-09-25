"use client";
import { useState } from "react";
import { cn } from "../lib/utils";
import ErrorMessage from "./ErrorMessage";
import IconButton from "./IconButton";

type DefaultTextFieldProps = {
  errorMessage: string;
  iconPath: string;
  alt: string;
  handleIconClick: () => {};
  placeholder: string;
  handleChange: () => {};
  value: string;
  isError: boolean;
};

export default function DefaultTextField(props: DefaultTextFieldProps) {
  const {
    errorMessage,
    iconPath,
    alt,
    handleIconClick,
    placeholder,
    handleChange,
    value,
    isError,
  } = props;

  const [isFocused, setIsFocused] = useState(false);
  const borderColorClass = !value
    ? " border-b border-gv-primary-yellow"
    : "border-b border-black";
  const borderFoucsedClass = isFocused
    ? "border-b border-blue-600"
    : "border-b border-black";

  console.log("isFouces", isFocused);
  return (
    <div
      className={cn(borderColorClass, borderFoucsedClass)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <input
        placeholder={placeholder}
        value={value}
        type="text"
        onChange={handleChange}
      />
      {!!value && (
        <IconButton
          handleClick={handleIconClick}
          alt={alt}
          iconPath={iconPath}
        />
      )}
      {isError && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </div>
  );
}
