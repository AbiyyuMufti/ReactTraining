import { useEffect } from "react";
import ReactDOM from "react-dom";

let instancesCount = 5;

const toBodyPortal = document.getElementsByTagName("BODY")[0]!;
// const overlayRoot = document.getElementById("overlay-root")!;

interface ModalPopupProps {
  onClickOutside?: () => void;
  children: React.ReactNode;
}

const ModalPopup = (props: ModalPopupProps) => {
  const outsideClick = props.onClickOutside || (() => {});
  const index = instancesCount;

  useEffect(() => {
    instancesCount += 2;
    return () => {
      instancesCount -= 2;
    };
  }, []);

  return (
    <>
      {ReactDOM.createPortal(
        <>
          <div
            className="backdrop"
            onClick={() => {
              outsideClick();
            }}
            style={{ zIndex: index }}
          ></div>
        </>,
        toBodyPortal
      )}
      {ReactDOM.createPortal(
        <div className="modal-background" style={{ zIndex: index + 1 }}>
          <>{props.children}</>,
        </div>,
        toBodyPortal
      )}
    </>
  );
};

export default ModalPopup;
