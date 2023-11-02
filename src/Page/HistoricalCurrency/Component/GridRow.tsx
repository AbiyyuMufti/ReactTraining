import { FocusEventHandler, MouseEventHandler } from "react";

const GridRow = (
  props: {
    data: string[];
    onClick: MouseEventHandler<HTMLTableRowElement>;
    onBlur?: FocusEventHandler<HTMLTableRowElement>;
    className: string;
  },
  key: string
) => {
  return (
    <tr
      onClick={props.onClick}
      onBlur={props.onBlur}
      className={props.className}
    >
      {props.data.map((col, idx) => (
        <td key={`${key}${idx}`}>{col}</td>
      ))}
    </tr>
  );
};

export default GridRow;
