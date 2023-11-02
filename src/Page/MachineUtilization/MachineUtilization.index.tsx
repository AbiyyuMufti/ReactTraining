import PageHeading from "../../Component/ReusableComponent/PageHeading";
import MachineContainer from "./Component/MachineContainer";

import "./style.scss";
import PaginationSection from "./Component/PaginationSection";
import SelectorSection from "./Component/SelectorSection";
import { MachineDataType } from "./Type/MachineUtilsPosts";
import { useState } from "react";

export function MachineUtilization() {
  const [machineData, setMachineData] = useState<MachineDataType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSizeLimit = 5;
  const dataLength = machineData.length;
  const startIndex = (currentPage - 1) * pageSizeLimit;
  const endIndex =
    startIndex + pageSizeLimit <= dataLength
      ? startIndex + pageSizeLimit
      : dataLength;

  return (
    <>
      <PageHeading>Machine Utilization</PageHeading>
      <div className="mu-main">
        <SelectorSection
          onSearch={(data) => {
            setMachineData(data);
            setCurrentPage(1);
          }}
        />
        <div className="mu-main__container">
          {machineData.slice(startIndex, endIndex).map((machine) => (
            <MachineContainer
              key={machine.id}
              workCenter={machine.workCenter}
              workStation={machine.workStation}
              data={
                machine.data.map((d) => ({
                  status: d.x,
                  runtime: [d.y[0]!, d.y[1]!],
                })) || []
              }
              utilization={machine.utilization}
            />
          ))}
        </div>
        <PaginationSection
          onPageChange={(data) => setCurrentPage(data)}
          pageLimit={pageSizeLimit}
          dataLength={dataLength}
        />
      </div>
    </>
  );
}

export default MachineUtilization;
