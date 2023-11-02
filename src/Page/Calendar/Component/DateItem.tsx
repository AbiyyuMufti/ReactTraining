import { useState } from "react";

import Button from "../../../Component/ReusableComponent/Button";
import ModalPopup from "../../../Component/ReusableComponent/ModalPopup";

import EditAgenda from "../../../Media/Image/EditAgenda.png";

import NotesPopup from "./NotesPopup";
import AgendaItem from "./AgendaItem";

import { CalendarItem } from "../Type/CalendarItemList";
import useCalendarDataEditing from "../Hooks/useCalendarDataEditing";
import { PRIORITY_LIST } from "../Constant/CalendarConstant";
import { useQueryClient } from "@tanstack/react-query";

const DateItem = (props: CalendarItem) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [selectedAgendaId, setSelectedAgendaId] = useState<string | null>(null);
  // const [agendaList, setAgendaList] = useState<Agenda[]>(props.agenda);
  const { addNewAgendaHandler, updateAgendaHandler, removeAgendaHandler } =
    useCalendarDataEditing();
  const queryClient = useQueryClient();
  return (
    <div key={props.id} className="date-item">
      {!props.empty && (
        <>
          <div className="date-holder">
            <h1 className={props.weekend ? "is-weekend" : ""}>
              {props.date.getDate()}
            </h1>
            <Button onClickHandler={() => setIsAddingNote(true)}>
              <img src={EditAgenda} alt="" />
            </Button>
          </div>
          <div className="agenda-holder">
            {props.agenda.map((ag) => (
              <AgendaItem
                key={ag.id}
                priority={ag.priority}
                onClickHandler={() => {
                  setSelectedAgendaId(ag.id);
                  queryClient.invalidateQueries(["getAgenda"]);
                }}
                date={props.date}
              >
                {ag.agenda}
              </AgendaItem>
            ))}
          </div>
        </>
      )}
      {isAddingNote && (
        <ModalPopup onClickOutside={() => setIsAddingNote(false)}>
          <NotesPopup
            type="add"
            date={props.date}
            onClickCancel={() => setIsAddingNote(false)}
            onClickAdd={(data) => {
              const payload = {
                title: data.agenda,
                priority: PRIORITY_LIST[data.priority]!.toUpperCase(),
                description: data.description,
                date: `${props.date.getFullYear()}-${
                  props.date.getMonth() + 1
                }-${props.date.getDate()}`,
              };
              console.table(payload);
              addNewAgendaHandler(payload).then(() => setIsAddingNote(false));
            }}
          ></NotesPopup>
        </ModalPopup>
      )}
      {selectedAgendaId && (
        <ModalPopup onClickOutside={() => setSelectedAgendaId(null)}>
          <NotesPopup
            type="update"
            date={props.date}
            agendaId={selectedAgendaId}
            onClickDelete={() => {
              removeAgendaHandler(selectedAgendaId).then(() =>
                setSelectedAgendaId(null)
              );
            }}
            onClickUpdate={(data) => {
              const payload = {
                title: data.agenda,
                priority: PRIORITY_LIST[data.priority]!.toUpperCase(),
                description: data.description,
                date: `${props.date.getFullYear()}-${
                  props.date.getMonth() + 1
                }-${props.date.getDate()}`,
              };
              updateAgendaHandler({ payload, id: selectedAgendaId }).then(() =>
                setSelectedAgendaId(null)
              );
            }}
          ></NotesPopup>
        </ModalPopup>
      )}
    </div>
  );
};

export default DateItem;
