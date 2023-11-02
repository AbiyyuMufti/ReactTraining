import PageHeading from "../../Component/ReusableComponent/PageHeading";
import DropdownSelector from "../../Component/ReusableComponent/DropdownSelector";

import DateItem from "./Component/DateItem";
import DateHeaderItem from "./Component/DateHeaderItem";

import { MONTH_LIST, YEAR_LIST, DAY_LIST } from "./Constant/CalendarConstant";

import "./style.scss";
import useCalendarData from "./Hooks/useCalendarData";

const Calendar = () => {
  const { queryClient, calendarList, monthDropdownRef, yearDropdownRef } =
    useCalendarData();

  return (
    <>
      <PageHeading>Calendar</PageHeading>
      <div className="calendar-main">
        <div className="calendar-main__selector">
          <DropdownSelector
            name="Month"
            label="Month:"
            options={MONTH_LIST.map((m, idx) => {
              return { key: m, value: idx.toString() };
            })}
            ref={monthDropdownRef}
            onSelectionChange={() => {
              queryClient.invalidateQueries(["getCalendarAgenda"]);
            }}
          ></DropdownSelector>
          <DropdownSelector
            name="Year"
            label="Year:"
            options={YEAR_LIST.map((m) => {
              return { key: m.toString(), value: m.toString() };
            })}
            ref={yearDropdownRef}
            onSelectionChange={() => {
              queryClient.invalidateQueries(["getCalendarAgenda"]);
            }}
          ></DropdownSelector>
        </div>
        <div className="calendar-main__container">
          {DAY_LIST.map((d, idx) => (
            <DateHeaderItem key={idx}>{d}</DateHeaderItem>
          ))}
          {calendarList.map((c) => (
            <DateItem
              id={c.id}
              empty={c.empty}
              key={c.id}
              date={c.date}
              weekend={c.weekend}
              agenda={c.agenda}
            ></DateItem>
          ))}
        </div>
      </div>
    </>
  );
};

export default Calendar;
