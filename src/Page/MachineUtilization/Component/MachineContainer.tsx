import { TimelineData } from "../Type/MachineUtilsPosts";
import MachineLabelContainer from "./MachineLabelContainer";
import UtilizationContainer from "./UtilizationContainer";

const MachineContainer = (props: {
  workStation: string;
  workCenter: string;
  data: TimelineData[];
  utilization: number;
}) => {
  const { workStation, workCenter, data, utilization } = props;
  let machineImage;
  try {
    machineImage = require(`../../../Media/Image/${workStation}.jpg`);
  } catch (e) {
    machineImage = undefined;
  }

  return (
    <div className="machine-container">
      <MachineLabelContainer
        MachineImage={machineImage}
        MachineTypeLogo={require("../../../Media/Image/machine-icon.png")}
      >
        {`${workCenter} ${workStation}`}
      </MachineLabelContainer>
      <UtilizationContainer
        series={data}
        value={utilization}
      ></UtilizationContainer>
    </div>
  );
};

export default MachineContainer;
