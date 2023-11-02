import { TimelineData } from "../Type/MachineUtilsPosts";
import TimelineChart from "./TimelineChart";

const UtilizationContainer = (props: {
  series: TimelineData[];
  value: number;
}) => {
  const { series, value } = props;
  return (
    <div className="utilization-container">
      <div className="utilization-percentage">
        <div className="percentage-box">
          <h3>
            Utilization
            <br />
            {`${Math.round(value)}%`}
          </h3>
        </div>
      </div>
      <div className="utilization-schedule">
        <TimelineChart data={series} />
      </div>
    </div>
  );
};

export default UtilizationContainer;
