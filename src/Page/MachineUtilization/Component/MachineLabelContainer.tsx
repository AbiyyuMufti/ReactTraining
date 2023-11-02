import { ReactNode } from "react";

interface MachineLableContainerProps {
  children: ReactNode;
  MachineImage: string | undefined;
  MachineTypeLogo?: string;
}
const MachineLabelContainer = (props: MachineLableContainerProps) => {
  return (
    <div className="machine-label-container">
      <div className="machine-name">
        <h1>{props.children}</h1>
      </div>
      <div className="machine-type-icon">
        <img src={props.MachineTypeLogo} alt="" />
      </div>
      <div className="machine-image">
        <div className="machine-image-frame">
          <img src={props.MachineImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default MachineLabelContainer;
