import { useEffect, useState } from "react";
import Grid from "./Component/Grid";
import TextInput from "./Component/TextInput";
import Button from "../../Component/ReusableComponent/Button";
import DeleteConfirmation from "../../Component/ReusableComponent/DeleteConfirmation";
import ModalPopup from "../../Component/ReusableComponent/ModalPopup";
import CurrencyChart from "./Component/CurrencyChart";
import PageHeading from "../../Component/ReusableComponent/PageHeading";
import useGetCurrencyData from "./Hooks/useGetCurrencyData";
import "./style.scss";

interface GridItem {
  country: string;
  value: number;
}

function HistoricalCurrency() {
  const [countryInput, setCountry] = useState("");
  const [valueInput, setValue] = useState("");

  const [currencyData, setCurrencyData] = useState<GridItem[]>([]);
  const [idxSelectedRow, setIdxSelectedRow] = useState<number | null>(null);

  const [deleteClicked, setDeleteClicked] = useState(false);
  const [rowDoubleClicked, setRowDoubleClicked] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const {
    currencyData: dbData,
    addCurrencyData,
    removeCurrencyData,
    updateCurrencyData,
  } = useGetCurrencyData();

  useEffect(() => {
    setCurrencyData(
      dbData
        ? dbData.map((e) => {
            return { country: e.country, value: e.currency };
          })
        : []
    );
  }, [dbData]);

  useEffect(() => {
    if (idxSelectedRow !== null && currencyData.length > idxSelectedRow) {
      setCountry(currencyData[idxSelectedRow]?.country || "");
      setValue(currencyData[idxSelectedRow]?.value.toString() || "");
      setEditMode(true);
    }
    if (idxSelectedRow === null) {
      setCountry("");
      setValue("");
      setEditMode(false);
    }
  }, [idxSelectedRow, currencyData, editMode]);

  const onAddCurrencyHandler = () => {
    if (countryInput === "" || isNaN(Number(valueInput))) return;
    addCurrencyData({
      country: countryInput,
      currency: Number(valueInput),
    });
    setCountry("");
    setValue("");
  };

  const onUpdateCurrencyHandler = () => {
    console.log({ countryInput, valueInput });
    if (
      countryInput === "" ||
      isNaN(Number(valueInput)) ||
      idxSelectedRow === null
    )
      return;
    updateCurrencyData({
      country: countryInput,
      currency: Number(valueInput),
    });
  };

  const onDeleteCurrencyHandler = () => {
    return () => {
      if (idxSelectedRow !== null && currencyData.length > idxSelectedRow) {
        console.log("this will be deleted: ", currencyData[idxSelectedRow]);
        if (currencyData[idxSelectedRow]) {
          removeCurrencyData({
            country: currencyData[idxSelectedRow]!.country,
            currency: currencyData[idxSelectedRow]!.value,
          });
        }
        setDeleteClicked(false);
      }
    };
  };

  return (
    <>
      <PageHeading>Historical Currency</PageHeading>
      <div className="hc-main">
        <div className="hc-main__container">
          <Grid
            data={currencyData}
            heading={["No.", "Country", "Value"]}
            onRowSingleClick={(selectedRow) => {
              setIdxSelectedRow(selectedRow);
              console.log("selected row table", selectedRow);
            }}
            onRowDoubleClick={(selectedRow) => {
              setIdxSelectedRow(selectedRow);
              console.log("selected row table", selectedRow);
              setRowDoubleClicked(true);
            }}
          ></Grid>

          <div className="operation">
            <TextInput
              title="Country"
              type="text"
              inputValue={countryInput}
              onChange={(inputValue) => {
                setCountry(inputValue);
              }}
              valid={true}
            />
            <TextInput
              title="Value"
              type="text"
              inputValue={valueInput}
              onInputValidation={(str) => {
                if (typeof str != "string") return false;
                return str != null && str !== "" && !isNaN(Number(str));
              }}
              valid={true}
              onChange={(inputValue) => {
                setValue(inputValue);
              }}
            />
            <Button
              onClickHandler={
                editMode ? onUpdateCurrencyHandler : onAddCurrencyHandler
              }
            >
              {editMode ? "Update" : "Add"}
            </Button>
            <Button
              onClickHandler={() => {
                if (
                  idxSelectedRow !== null &&
                  currencyData.length > idxSelectedRow
                ) {
                  setDeleteClicked(true);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
      {deleteClicked && (
        <ModalPopup>
          <DeleteConfirmation
            onConfirm={onDeleteCurrencyHandler()}
            onCancel={() => setDeleteClicked(false)}
          >
            Are you sure?
          </DeleteConfirmation>
        </ModalPopup>
      )}
      {rowDoubleClicked && (
        <ModalPopup onClickOutside={() => setRowDoubleClicked(false)}>
          <CurrencyChart
            title={currencyData[idxSelectedRow || 0]?.country}
            rate={currencyData[idxSelectedRow || 0]?.value}
          ></CurrencyChart>
        </ModalPopup>
      )}
    </>
  );
}

export default HistoricalCurrency;
