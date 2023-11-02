import { forwardRef } from "react";

import "./DropdownSelector.scss";

interface DropdownProps {
  name: string;
  label: string;
  options?: { value: string; key: string }[];
  onSelectionChange?: (data?: any) => void;
  defaultValue?: string;
  className?: string;
  clearOption?: boolean;
  isMultiple?: boolean;
  autoSelectFirst?: boolean;
}

const DropdownSelector = forwardRef<HTMLSelectElement, DropdownProps>(
  (props, ref) => {
    const { clearOption, isMultiple, autoSelectFirst } = props;

    return (
      <div className={`dropdown-selector ${props.className || ""}`}>
        <label htmlFor={props.name}>{props.label}</label>
        <select
          ref={ref}
          name={props.name}
          id={props.name}
          onChange={(e) => {
            props.onSelectionChange && props.onSelectionChange(e.target.value);
          }}
          defaultValue={props.defaultValue}
          multiple={isMultiple}
          value={
            autoSelectFirst && props.options
              ? props.options[0]?.value
              : undefined
          }
        >
          {clearOption && (
            <option key={null} value={undefined} className="clear-options">
              [none]
            </option>
          )}
          {props.options?.map((opt) => (
            <option key={opt.key} value={opt.value}>
              {opt.key}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

export default DropdownSelector;
