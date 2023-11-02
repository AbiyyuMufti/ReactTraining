import { forwardRef } from "react";

const DatePicker = forwardRef<HTMLInputElement>(() => {
  return (
    <input
      className="date-picker"
      type="date"
      id="date-picker"
      name="date-picker"
    />
  );
});

export default DatePicker;
