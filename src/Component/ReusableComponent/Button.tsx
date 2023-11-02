import { MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  onClickHandler?: MouseEventHandler;
  children: ReactNode;
  customClass?: string;
  type?: "button" | "submit" | "reset";
}

const Button = (props: ButtonProps) => {
  return (
    <button
      onClick={props.onClickHandler}
      type={props.type ? props.type : "button"}
      className={`button-style ${props.customClass || ""}`}
    >
      {props.children}
    </button>
  );
};

export default Button;
