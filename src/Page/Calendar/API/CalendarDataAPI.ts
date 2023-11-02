import axios from "axios";
import { toast } from "react-toastify";
import { AgendaEntry } from "../Type/CalendarItemList";
import {
  AgendaItemType,
  AgendaType,
  agendaItemSchema,
  agendaSchema,
} from "../Type/AgendaPosts";

export const getCalendarAgenda = async (year: number, month: number) => {
  try {
    const { data }: { data: AgendaType[] } = await axios({
      url: `http://localhost:8000/calendar/${year}/${month}`,
      method: "GET",
    });
    agendaSchema.array().parse(data);
    return data;
  } catch (e) {
    const error = e as Error;
    toast.error(error.message);
    return null;
  }
};

export const addNewAgenda = async (payload: AgendaEntry) => {
  try {
    const { data } = await axios({
      url: "http://localhost:8000/calendar/insert",
      method: "POST",
      data: payload,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    console.log(data);
    return data;
  } catch (e) {
    const error = e as Error;
    console.log(error);
    toast.error(error.message);
    return null;
  }
};

export const updateAgenda = async ({
  payload,
  id,
}: {
  payload: AgendaEntry;
  id: string;
}) => {
  try {
    const { data } = await axios({
      url: "http://localhost:8000/calendar/update",
      method: "POST",
      data: payload,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      params: { id: id },
    });
    return data;
  } catch (e) {
    const error = e as Error;
    console.log(error);
    toast.error(error.message);
    return null;
  }
};

export const getAgenda = async (id: string) => {
  try {
    const { data }: { data: AgendaItemType[] } = await axios({
      url: `http://localhost:8000/calendar/agenda`,
      method: "GET",
      params: { id: id },
    });
    agendaItemSchema.array().parse(data);
    const agendaData = data.pop() || null;
    console.log("agenda: ", agendaData);
    return agendaData;
  } catch (e) {
    const error = e as Error;
    toast.error(error.message);
    return null;
  }
};

export const removeAgenda = async (id: string) => {
  try {
    const { data } = await axios({
      url: `http://localhost:8000/calendar/agenda`,
      method: "DELETE",
      params: { id: id },
    });
    return data;
  } catch (e) {
    const error = e as Error;
    toast.error(error.message);
    return null;
  }
};
