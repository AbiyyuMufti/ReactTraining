import { ReactNode } from "react";
import { PRIORITY_COLOR } from "../Constant/CalendarConstant";
// import { AgendaData } from "../Type/CalendarItemList";

interface AgendaProps {
  priority: number;
  children: ReactNode;
  date: Date;
  onClickHandler: () => void;
}
const AgendaItem = (props: AgendaProps) => {
  return (
    <div
      className="agenda-item"
      style={{ backgroundColor: PRIORITY_COLOR[props.priority] }}
      onClick={() => props.onClickHandler()}
    >
      {props.children}
    </div>
  );
};

export default AgendaItem;
