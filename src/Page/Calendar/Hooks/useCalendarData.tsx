import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Agenda, CalendarItem } from "../Type/CalendarItemList";
import { useEffect, useRef, useState } from "react";
import { AgendaType } from "../Type/AgendaPosts";
import { getCalendarAgenda } from "../API/CalendarDataAPI";
import { PRIORITY_NUMBER } from "../Constant/CalendarConstant";

export const generateCalendar = (
  year: number,
  month: number,
  agendas: AgendaType[]
): CalendarItem[] => {
  let calendarList: CalendarItem[] = [];
  let startDate = new Date(year, month);
  const startOffset = (7 + (startDate.getDay() - 1)) % 7;
  startDate.setDate(startDate.getDate() - startOffset);

  let endDate = new Date(year, month + 1);
  endDate.setDate(endDate.getDate() - 1);
  const endOffset = (7 - endDate.getDay()) % 7;
  endDate.setDate(endDate.getDate() + endOffset);

  const lookup_agenda = agendas.reduce(
    (lookup: { [key: string]: AgendaType[] }, cur) => {
      const date = new Date(Date.parse(cur.date)).getDate();
      if (!(date.toString() in lookup)) {
        lookup[date.toString()] = [];
      }
      lookup[date.toString()]!.push(cur);
      return lookup;
    },
    {}
  );
  for (
    let date = startDate;
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const thisAgenda = lookup_agenda[date.getDate().toString()];
    const agendaToInsert: Agenda[] = thisAgenda
      ? thisAgenda.map((e) => {
          return {
            id: e.id,
            agenda: e.agenda,
            priority: (PRIORITY_NUMBER as any)[e.priority],
          };
        })
      : [];
    calendarList.push({
      id: date.getTime(),
      date: new Date(date.getTime()),
      weekend: date.getDay() === 0 || date.getDay() === 6,
      empty: date < new Date(year, month) || new Date(year, month + 1) <= date,
      agenda: agendaToInsert,
    });
  }
  return calendarList;
};

const useCalendarData = () => {
  const queryClient = useQueryClient();

  const monthDropdownRef = useRef<HTMLSelectElement>(null);
  const yearDropdownRef = useRef<HTMLSelectElement>(null);

  const [calendarList, setCalendarList] = useState<CalendarItem[]>([]);

  useEffect(() => {
    yearDropdownRef.current!.value = new Date().getFullYear().toString();
    monthDropdownRef.current!.value = new Date().getMonth().toString();
  }, []);

  const { data: thisMonthAgenda, isFetched } = useQuery({
    queryKey: ["getCalendarAgenda"],
    queryFn: async (): Promise<AgendaType[] | null> => {
      console.log("hello");
      return await getCalendarAgenda(
        Number(yearDropdownRef.current!.value),
        Number(monthDropdownRef.current!.value) + 1
      );
    },
  });

  useEffect(() => {
    // use effect each time a dropdown is changing
    if (isFetched) {
      const list = generateCalendar(
        Number(yearDropdownRef.current!.value),
        Number(monthDropdownRef.current!.value),
        thisMonthAgenda || []
      );
      setCalendarList(list);
    }
    console.log("fetched", isFetched);
    console.log(thisMonthAgenda);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thisMonthAgenda]);

  return {
    queryClient,
    calendarList,
    monthDropdownRef,
    yearDropdownRef,
  };
};

export default useCalendarData;
