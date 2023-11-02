import { useState } from "react";
import Button from "../../../Component/ReusableComponent/Button";

import first_icon from "../../../Media/Image/first-icon.PNG";
import last_icon from "../../../Media/Image/last-icon.PNG";
import next_icon from "../../../Media/Image/next-icon.PNG";
import previous_icon from "../../../Media/Image/previous-icon.PNG";
import { COLOR_CODE } from "../Constant/MachineConstant";
import StatusLegend from "./StatusLegend";

const PaginationSection = (props: {
  onPageChange: (data: number) => void;
  pageLimit: number;
  dataLength: number;
}) => {
  const { onPageChange, pageLimit, dataLength } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil((dataLength || 1) / pageLimit);
  return (
    <div className="mu-main__pagination">
      <div className="status-section">
        <StatusLegend color={COLOR_CODE["Running"]}>Running</StatusLegend>
        <StatusLegend color={COLOR_CODE["Idle"]}>Idle</StatusLegend>
        <StatusLegend color={COLOR_CODE["Down"]}>Down</StatusLegend>
        <StatusLegend color={COLOR_CODE["Offline"]}>Offline</StatusLegend>
      </div>
      <div className="pagination-section">
        <Button
          customClass="button-with-image"
          onClickHandler={() => {
            onPageChange(1);
            setCurrentPage(1);
          }}
        >
          <img src={first_icon} alt=""></img>
        </Button>
        <Button
          customClass="button-with-image"
          onClickHandler={() => {
            const prevPage = currentPage - 1 >= 1 ? currentPage - 1 : 1;
            onPageChange(prevPage);
            setCurrentPage(prevPage);
          }}
        >
          <img src={previous_icon} alt=""></img>
        </Button>
        <div className="current-page">{`${currentPage}/${totalPages}`}</div>
        <Button
          customClass="button-with-image"
          onClickHandler={() => {
            const nextPage =
              currentPage + 1 <= totalPages ? currentPage + 1 : totalPages;
            onPageChange(nextPage);
            setCurrentPage(nextPage);
          }}
        >
          <img src={next_icon} alt=""></img>
        </Button>
        <Button
          customClass="button-with-image"
          onClickHandler={() => {
            onPageChange(totalPages);
            setCurrentPage(totalPages);
          }}
        >
          <img src={last_icon} alt=""></img>
        </Button>
      </div>
    </div>
  );
};

export default PaginationSection;
