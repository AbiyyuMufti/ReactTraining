import { ReactNode } from "react";
import Button from "./Button";

interface DeleteConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
  children: ReactNode;
}

const DeleteConfirmation = (props: DeleteConfirmationProps) => {
  return (
    <div
      className={`modal delete-confirmation-box ${
        props.className ? " " + props.className : ""
      }`}
    >
      <div>
        <h1>{props.children}</h1>
      </div>
      <div>
        <Button onClickHandler={() => props.onConfirm()}>Confirm</Button>
        <Button onClickHandler={() => props.onCancel()}>Cancel</Button>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
