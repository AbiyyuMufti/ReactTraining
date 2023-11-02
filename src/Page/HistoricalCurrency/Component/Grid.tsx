/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, forwardRef } from "react";
import GridHeader from "./GridHeader";
import GridRow from "./GridRow";
import useSingleAndDoubleClick from "../Hooks/useSingleAndDoubleClick";

interface GridItem {
  country: string;
  value: number | null;
}

interface GridData {
  data: GridItem[];
  heading: string[];
  onRowSingleClick?: (selectedRow: number | null) => void;
  onRowDoubleClick?: (selectedRow: number | null) => void;
}

interface RowClickState {
  row: number | null;
  type: number | null;
}

const Grid = forwardRef<HTMLTableElement, GridData>((props: GridData, ref) => {
  const [selection, setSelected] = useState<RowClickState>({
    row: null,
    type: 1,
  });

  const { onRowSingleClick, onRowDoubleClick } = props;

  const { row, type } = selection;

  useEffect(() => {
    if (type === 2) {
      onRowDoubleClick?.(row);
    } else {
      onRowSingleClick?.(row);
    }
  }, [row, type]);

  const rowClickEvent = useSingleAndDoubleClick(
    (_, idx: number) => {
      console.log("single click", idx);
      setSelected((prev) => {
        return prev.row !== idx && idx < props.data.length
          ? { row: idx, type: 1 }
          : { row: null, type: 1 };
      });
    },
    (_, idx: number) => {
      console.log("double click", idx);
      setSelected((prev) => {
        return prev.row !== idx && idx < props.data.length
          ? { row: idx, type: 2 }
          : { row: null, type: 2 };
      });
    }
  );

  const data = [...props.data];
  const fillWithEmpty = (nrToAdd: number) => {
    for (let i = 0; i < nrToAdd; i++) {
      data.push({ country: "", value: null });
    }
    return data;
  };

  if (props.data.length < 6) {
    fillWithEmpty(6 - data.length);
  }

  return (
    <div className="table-container">
      <div className="grid-style">
        <table className="responsive-grid" ref={ref}>
          <thead>
            <GridHeader heading={props.heading} />
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <GridRow
                data={[
                  props.data.length > idx ? (idx + 1).toString() : "",
                  row.country,
                  row.value !== null ? row.value.toString() : "",
                ]}
                key={idx}
                className={
                  idx === selection?.row && selection?.row < props.data.length
                    ? "selected"
                    : ""
                }
                onClick={(e) => {
                  rowClickEvent(e, idx);
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default Grid;
