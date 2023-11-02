import { FocusEventHandler } from "react";

interface InputProps {
  title: string;
  type: string;
  valid: boolean;
  onInputValidation?: (input: string) => boolean;
  onChange?: (inputValue: string) => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  inputValue: string;
}

const TextInput = (props: InputProps) => {
  return (
    <div className={`text-input${!props.valid ? " invalid" : ""}`}>
      <label>{props.title}</label>
      <input
        type={props.type}
        onChange={(event) => {
          props.onChange && props.onChange(event.target.value);
        }}
        onBlur={props.onBlur}
        value={props.inputValue}
      ></input>
    </div>
  );
};

export default TextInput;
