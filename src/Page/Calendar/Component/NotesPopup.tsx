import { useState } from "react";

import Button from "../../../Component/ReusableComponent/Button";
import DropdownSelector from "../../../Component/ReusableComponent/DropdownSelector";
import ModalPopup from "../../../Component/ReusableComponent/ModalPopup";
import DeleteConfirmation from "../../../Component/ReusableComponent/DeleteConfirmation";

import { PRIORITY_LIST } from "../Constant/CalendarConstant";
import { AgendaData } from "../Type/CalendarItemList";
import useGetAgenda from "../Hooks/useGetAgenda";

interface NotesPopupProps {
  type: "add" | "update";
  date: Date;
  agendaId?: string;
  onClickAdd?: (data: AgendaData) => void;
  onClickUpdate?: (data: AgendaData) => void;
  onClickCancel?: () => void;
  onClickDelete?: () => void;
}

const NotesPopup = (props: NotesPopupProps) => {
  const priority_options = PRIORITY_LIST.map((p, idx) => {
    return { key: p, value: idx.toString() };
  });

  const [onDelete, setOnDelete] = useState(false);

  const { thisAgendaData, agendaIsFetched, priorityRef } = useGetAgenda(
    props.agendaId
  );

  // console.table(thisAgendaData);

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formDataObject: AgendaData = {
      id: "new-id",
      date: props.date,
      description: formData.get("description")?.toString() || "",
      agenda: formData.get("agenda")?.toString() || "",
      priority: Number(formData.get("priority")),
    };

    switch (props.type) {
      case "add":
        props.onClickAdd && props.onClickAdd(formDataObject);
        break;
      case "update":
        props.onClickUpdate && props.onClickUpdate(formDataObject);
        break;
      default:
        break;
    }
  };

  const onCancelOrDelete = () => {
    switch (props.type) {
      case "add":
        props.onClickCancel && props.onClickCancel();
        break;
      case "update":
        setOnDelete(true);
        break;
      default:
        break;
    }
  };

  return agendaIsFetched ? (
    <>
      <form className="notes" onSubmit={onSubmitHandler}>
        <div className="notes__header">
          <label htmlFor="agenda" className="form-label">
            Title
          </label>
          <div className="dates-section">
            <div className="form-label">Date:</div>
            <div className="date-display">
              {props.date.toLocaleDateString("en-UK", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
        <input
          type="text"
          id="agenda"
          name="agenda"
          placeholder="Test"
          defaultValue={thisAgendaData?.agenda}
        />
        <label htmlFor="description" className="form-label">
          Notes
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Test note"
          defaultValue={thisAgendaData?.description}
        />
        <div className="dropdown-area">
          <DropdownSelector
            name="priority"
            label="Priority"
            options={priority_options}
            defaultValue={"0"}
            ref={priorityRef}
          ></DropdownSelector>
        </div>
        <div className="button-area">
          <Button type="submit">
            {props.type === "add" ? "Add" : "Update"}
          </Button>
          <Button onClickHandler={onCancelOrDelete}>
            {props.type === "add" ? "Cancel" : "Delete"}
          </Button>
        </div>
      </form>
      {onDelete && (
        <ModalPopup>
          <DeleteConfirmation
            onConfirm={() => {
              props.onClickDelete && props.onClickDelete();
            }}
            onCancel={() => setOnDelete(false)}
            className="notes-delete"
          >
            Delete Notes?
          </DeleteConfirmation>
        </ModalPopup>
      )}
    </>
  ) : (
    <div></div>
  );
};

export default NotesPopup;
