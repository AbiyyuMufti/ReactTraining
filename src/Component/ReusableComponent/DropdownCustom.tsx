import { Ref, forwardRef, useState } from "react";
import "./DropdownCustom.scss";
import DropdownArrow from "../../Media/Image/Dropdown-Arrow.png";
import xSymbol from "../../Media/SVG/x-symbol-svgrepo-com.svg";

interface DropdownProps {
  name: string;
  label: string;
  options?: { value: string; key: string }[];
  onSelectionChange: (data?: any) => void;
  defaultValue?: string;
  className?: string;
  clearOption?: boolean;
  isMultiple?: boolean;
  dropdownImage?: string;
}

const SingleDropdown = forwardRef<
  HTMLSelectElement,
  { properties: DropdownProps }
>((properties, ref) => {
  const props = properties.properties;
  const { clearOption } = props;
  return (
    <select
      ref={ref}
      name={props.name}
      id={props.name}
      onChange={(e) => {
        props.onSelectionChange && props.onSelectionChange(e.target.value);
      }}
      defaultValue={props.defaultValue}
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
  );
});

const MultiSelectDropdown = forwardRef<HTMLFieldSetElement, DropdownProps>(
  (props, ref) => {
    const { onSelectionChange } = props;
    const [dropdownDisplayed, setDropdownDisplayed] = useState(false);
    const [selectedList, setSelectedList] = useState<Record<string, boolean>>(
      props.options
        ? props.options?.reduce(
            (obj, cur) => ({ ...obj, [cur.value]: false }),
            {}
          )
        : {}
    );

    const numberSelected = Object.values(selectedList).filter(Boolean).length;

    return (
      <fieldset
        ref={ref}
        className="multiple-dropdown"
        name={props.name}
        id={props.name}
      >
        <div
          className="button-div"
          onClick={() => {
            if (dropdownDisplayed) {
              const valueList = Object.keys(selectedList)
                .filter((k) => selectedList[k])
                .map((e) => Number(e));
              // console.log(valueList);
              onSelectionChange(valueList);
            }

            setDropdownDisplayed((prev) => !prev);
          }}
        >
          {numberSelected ? (
            <button
              className="clear-button"
              onClick={(e) => {
                e.stopPropagation();
                const emptyList: Record<string, boolean> = Object.keys(
                  selectedList
                ).reduce(
                  (obj, key) => ({
                    ...obj,
                    [key]: false,
                  }),
                  {}
                );
                setSelectedList(emptyList);
                const valueList = Object.keys(emptyList)
                  .filter((k) => emptyList[k])
                  .map((e) => Number(e));
                onSelectionChange(valueList);
              }}
            >
              <img src={xSymbol} alt="" />
            </button>
          ) : (
            <></>
          )}
          <div
            className={`dropdown-label ${
              numberSelected === 0 ? "none-selected" : ""
            }`}
          >
            {numberSelected === 0
              ? "select.."
              : numberSelected === 1
              ? props.options?.find(
                  (e) =>
                    e.value ===
                    Object.keys(selectedList).filter((e) => selectedList[e])[0]
                )?.key
              : `${numberSelected} selected`}
          </div>
          <img alt="" src={props.dropdownImage || DropdownArrow} />
        </div>
        {dropdownDisplayed && (
          <div className="dropdown-panel">
            {props.options?.map((list) => (
              <fieldset
                key={list.key}
                className={selectedList[list.key] ? "selected" : ""}
                name="multiple-dropdown-panel"
              >
                <input
                  id={list.key}
                  key={list.key}
                  type="checkbox"
                  onChange={(event) => {
                    setSelectedList({
                      ...selectedList,
                      [list.value]: event.target.checked,
                    });
                  }}
                  checked={selectedList[list.value]}
                />
                <label htmlFor={list.key}>{list.key}</label>
              </fieldset>
            ))}
          </div>
        )}
      </fieldset>
    );
  }
);

const DropdownCustom = forwardRef<HTMLSelectElement, DropdownProps>(
  (props, ref) => {
    return (
      <div className={`dropdown-selector ${props.className || ""}`}>
        {props.isMultiple ? (
          <>
            <div className="label">{props.label}</div>
            <MultiSelectDropdown
              name={props.name}
              label={props.label}
              options={props.options}
              onSelectionChange={(data) => props.onSelectionChange(data)}
              defaultValue={props.defaultValue}
              clearOption={props.clearOption}
              dropdownImage={props.dropdownImage}
            />
          </>
        ) : (
          <>
            <label htmlFor={props.name}>{props.label}</label>
            <SingleDropdown
              properties={props}
              ref={ref as Ref<HTMLSelectElement>}
            />
          </>
        )}
      </div>
    );
  }
);

export default DropdownCustom;
