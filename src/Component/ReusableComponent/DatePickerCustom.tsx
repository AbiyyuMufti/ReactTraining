import {
  forwardRef,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import Button from "./Button";
import LeftArrow from "../../Media/SVG/left-arrow-svgrepo-com.svg";
import RightArrow from "../../Media/SVG/right-arrow-svgrepo-com.svg";
import "./DatePickerStyles.scss";

const MONTH_LIST = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_LIST_THREE = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DAY_LIST = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

interface CalenderList {
  id: number;
  date: Date;
  empty: boolean;
}

interface DatePickerState {
  selectedMonth: number;
  selectedYear: number;
  calendarList: CalenderList[];
  changeMonthYear: boolean;
}

interface DatePickerAction {
  type:
    | "next-month"
    | "prev-month"
    | "change-month-year"
    | "month-year-selected";
  payload?: { year: number; month: number };
}

function generateCalendarList(year: number, month: number) {
  let calendar_list = [];
  const startRef = new Date(year, month);
  let startDate = new Date(startRef);
  const startOffset = (7 + (startDate.getDay() - 1)) % 7;
  startDate.setDate(startDate.getDate() - startOffset);

  const endRef = new Date(year, month + 1);
  let endDate = new Date(endRef);
  endDate.setDate(endDate.getDate() - 1);
  const endOffset = (7 - endDate.getDay()) % 7;
  endDate.setDate(endDate.getDate() + endOffset);

  for (
    let date = startDate;
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    calendar_list.push({
      id: date.getTime(),
      date: new Date(date),
      empty: date < startRef || date >= endRef,
    });
  }
  return calendar_list;
}

const dispatchDatePickerActivity = (
  state: DatePickerState,
  action: DatePickerAction
): DatePickerState => {
  switch (action.type) {
    case "next-month":
      const next_month = (12 + (state.selectedMonth + 1)) % 12;
      const next_year =
        state.selectedMonth + 1 > 11
          ? state.selectedYear + 1
          : state.selectedYear;
      return {
        ...state,
        selectedYear: next_year,
        selectedMonth: next_month,
        calendarList: generateCalendarList(next_year, next_month),
      };
    case "prev-month":
      const prev_month = (12 + (state.selectedMonth - 1)) % 12;
      const prev_year =
        state.selectedMonth - 1 < 0
          ? state.selectedYear - 1
          : state.selectedYear;
      return {
        ...state,
        selectedYear: prev_year,
        selectedMonth: prev_month,
        calendarList: generateCalendarList(prev_year, prev_month),
      };
    case "change-month-year":
      return {
        ...state,
        changeMonthYear: !state.changeMonthYear,
      };
    case "month-year-selected":
      return {
        ...state,
        selectedMonth: action.payload!.month,
        selectedYear: action.payload!.year,
        calendarList: generateCalendarList(
          action.payload!.year,
          action.payload!.month
        ),
      };
    default:
      break;
  }
  return state;
};

const genInitialDatePickerState = (selectedDate: Date | null) => {
  const date = selectedDate || new Date();
  return {
    selectedMonth: date.getMonth(),
    selectedYear: date.getFullYear(),
    calendarList: generateCalendarList(date.getFullYear(), date.getMonth()),
    changeMonthYear: false,
  };
};

export default function DatePickerCustom(props: {
  onSelectionChanged: (date: Date) => void;
  defaultDate?: Date;
}) {
  const { onSelectionChanged, defaultDate } = props;
  const [displayPicker, setDisplayPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    defaultDate || new Date()
  );
  return (
    <div className="container">
      <Button
        customClass="date-picker-button"
        onClickHandler={() => setDisplayPicker((prev) => !prev)}
      >
        {`${selectedDate.getDate()}-${
          MONTH_LIST_THREE[selectedDate.getMonth()]
        }-${selectedDate.getFullYear()}`}
      </Button>
      {displayPicker && (
        <DatePickerSelection
          className="floating-div"
          selectedDate={selectedDate}
          onSelectionChange={(date) => {
            setSelectedDate(date);
            onSelectionChanged(date);
          }}
          // defaultYear={selectedDate.getFullYear()}
          // defaultMonth={selectedDate.getMonth() + 1}
        />
      )}
    </div>
  );
}

export function DatePickerSelection(props: {
  className?: string;
  onSelectionChange: (date: Date) => void;
  selectedDate: Date;
}) {
  const { className, onSelectionChange, selectedDate } = props;

  const defaultYear = selectedDate.getFullYear();
  const defaultMonth = selectedDate.getMonth() + 1;

  console.table({
    selectedDate,
    defaultYear,
    defaultMonth,
  });

  const [state, dispatch] = useReducer(
    dispatchDatePickerActivity,
    genInitialDatePickerState(selectedDate)
  );
  const { selectedMonth, selectedYear, calendarList, changeMonthYear } = state;

  const onMonthYearChange = useCallback(
    (year: number, month: number) =>
      dispatch({
        type: "month-year-selected",
        payload: { year, month },
      }),
    []
  );

  return (
    <div className={`date-picker-container ${className || ""}`}>
      <div className="header-selector">
        <Button
          customClass="date-button-ctr left-arrow"
          onClickHandler={() => dispatch({ type: "prev-month" })}
        >
          <img src={LeftArrow} alt="" />
        </Button>
        <Button
          customClass="date-button-ctr"
          onClickHandler={() => dispatch({ type: "change-month-year" })}
        >
          {`${MONTH_LIST[selectedMonth]}, ${selectedYear}`}
        </Button>
        <Button
          customClass="date-button-ctr"
          onClickHandler={() => dispatch({ type: "next-month" })}
        >
          <img src={RightArrow} alt="" />
        </Button>
      </div>
      <div className="parent-selector">
        {changeMonthYear && (
          <DatePickerChangeMonthYear
            defaultYear={defaultYear}
            defaultMonth={defaultMonth}
            onSelectionChange={onMonthYearChange}
          ></DatePickerChangeMonthYear>
        )}
        <DatePickerCalendar
          calendar_list={calendarList}
          onSelectionChange={onSelectionChange}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  );
}

function DatePickerCalendar(props: {
  calendar_list: CalenderList[];
  onSelectionChange: (date: Date) => void;
  selectedDate: Date;
}) {
  const { calendar_list, onSelectionChange, selectedDate: defaultDate } = props;

  const [selectedDate, setSelectedDate] = useState<Date | null>(defaultDate);

  return (
    <div className="calendar-section">
      {DAY_LIST.map((day, idx) => (
        <div className="calender-header" key={idx}>
          {day}
        </div>
      ))}
      {calendar_list.map((e) => {
        if (e.empty) return <div key={e.id}></div>;
        const selected = selectedDate
          ? e.date.getTime() === selectedDate.getTime()
          : false;
        return (
          <div
            key={e.id}
            className={`calender-date${selected ? " selected" : ""}`}
            onClick={() => {
              if (selected) {
                setSelectedDate(null);
                return;
              }
              setSelectedDate(e.date);
              e.date && onSelectionChange(e.date);
            }}
          >
            {e.date.getDate().toString()}
          </div>
        );
      })}
    </div>
  );
}

const yearGenerator = (defaultYear: number) => {
  const prevYears: number[] = [];
  const nextYears: number[] = [];
  for (let i = 1; i < 5; i++) {
    prevYears.unshift(defaultYear - i);
    nextYears.push(defaultYear + i);
  }
  return [...prevYears, defaultYear, ...nextYears];
};

const dispatchChangeMonthYear = (
  state: {
    selectedYear: number | null;
    selectedMonth: number | null;
    onSelectionChange: (year: number, month: number) => void;
  },
  action: {
    type: string;
    payload?: { year?: number | null; month?: number | null };
  }
) => {
  switch (action.type) {
    case "select-year":
      state = {
        ...state,
        selectedYear: action.payload!.year || null,
        selectedMonth: null,
      };
      console.log("selecting year ", action.payload!.year, state.selectedMonth);
      break;
    case "select-month":
      state = {
        ...state,
        selectedMonth: action.payload!.month || null,
      };
      break;
    default:
      break;
  }
  return state;
};

function DatePickerChangeMonthYear(props: {
  defaultYear: number;
  defaultMonth: number;
  onSelectionChange: (year: number, month: number) => void;
}) {
  const {
    defaultYear,
    defaultMonth,
    onSelectionChange: onMonthYearChanged,
  } = props;
  const selectedRef = useRef(null);

  const [state, dispatch] = useReducer(dispatchChangeMonthYear, {
    selectedYear: defaultYear,
    selectedMonth: defaultMonth,
    onSelectionChange: onMonthYearChanged,
  });
  const { selectedYear, selectedMonth, onSelectionChange } = state;

  useEffect(() => {
    if (selectedRef.current) {
      (selectedRef.current as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, []);

  useEffect(() => {
    if (selectedYear && selectedMonth) {
      onSelectionChange(selectedYear, selectedMonth - 1);
    }
    return () => {};
  }, [selectedYear, selectedMonth, onSelectionChange]);

  return (
    <div className="year-month-selection">
      {yearGenerator(defaultYear).map((year, idx) => (
        <div className="selector-flex-item" key={idx}>
          <div
            className={`year-item${selectedYear === year ? " selected" : ""}`}
            onClick={() =>
              dispatch({ type: "select-year", payload: { year: year } })
            }
          >
            {year}
          </div>

          {selectedYear === year && (
            <DatePickerMonthSelector
              ref={selectedRef}
              defaultMonth={selectedMonth}
              onSelectMonth={(month) =>
                dispatch({ type: "select-month", payload: { month: month } })
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}

const DatePickerMonthSelector = forwardRef<
  HTMLDivElement,
  { defaultMonth: number | null; onSelectMonth: (month: number | null) => void }
>((props, ref) => {
  const { defaultMonth, onSelectMonth } = props;

  return (
    <div className="month-selector" ref={ref}>
      {MONTH_LIST_THREE.map((month, idx) => (
        <div
          className={`month-item${
            defaultMonth && defaultMonth - 1 === idx ? " selected" : ""
          }`}
          onClick={() => {
            // setSelectedMonth(idx + 1 !== selectedMonth ? idx + 1 : null);
            const month_selection = idx + 1 !== defaultMonth ? idx + 1 : null;
            onSelectMonth(month_selection);
          }}
          key={idx}
        >
          {month}
        </div>
      ))}
    </div>
  );
});
