import { useCallback, useEffect, useRef, useState } from "react";
import Button from "../../Component/ReusableComponent/Button";
import DatePickerCustom from "../../Component/ReusableComponent/DatePickerCustom";
import DropdownCustom from "../../Component/ReusableComponent/DropdownCustom";
import DropdownSelector from "../../Component/ReusableComponent/DropdownSelector";
import "./style.scss";

const options = [
  { key: "select-1", value: "1" },
  { key: "select-2", value: "2" },
  { key: "select-3", value: "3" },
];

function DatePickerTest() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [opt, setOpt] = useState<string>();

  const updateForm = useCallback((data: any) => {
    setSelectedOptions(data);
    console.log(data);
  }, []);

  const siteRef = useRef<HTMLSelectElement>(null);
  useEffect(() => {
    console.log(siteRef.current!.selectedOptions[0]?.value);
  }, [opt]);

  return (
    <form
      name="my-form"
      id="my-form"
      className="date-picker-test"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: Record<string, any> = {};
        for (const [key, value] of formData.entries()) {
          data[key] = value;
        }
        data["selected-date"] = selectedDate;
        data["selected-options"] = selectedOptions;
        console.log(data);
      }}
    >
      <Button type="submit">submit</Button>
      <DatePickerCustom
        onSelectionChanged={(date) => setSelectedDate(date)}
      ></DatePickerCustom>
      <DropdownSelector
        name="text-dropdown"
        label="Test Dropdown"
        options={options}
        clearOption={true}
        ref={siteRef}
        onSelectionChange={(data) => setOpt(data)}
      ></DropdownSelector>
      <DropdownCustom
        name="test-custom-dropdown"
        label="Test Custom Dropdown"
        options={options}
        isMultiple={true}
        onSelectionChange={updateForm}
      />
    </form>
  );
}

export default DatePickerTest;
