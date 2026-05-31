import { useEffect, useRef } from "react";

interface EditableTextProps {
  value: string;
  placeholder: string;
  className?: string;
  onChange: (value: string) => void;
}

const EditableText = ({
  value,
  placeholder,
  className = "",
  onChange,
}: EditableTextProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  useEffect(() => {
    resize();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className={`editable-text ${className}`}
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
        resize();
      }}
      placeholder={placeholder}
      rows={1}
    />
  );
};

export default EditableText;