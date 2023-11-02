import { useQuery } from "@tanstack/react-query";
import { AgendaItemType } from "../Type/AgendaPosts";
import { getAgenda } from "../API/CalendarDataAPI";
import { useEffect, useRef, useState } from "react";
import { AgendaData } from "../Type/CalendarItemList";
import { PRIORITY_NUMBER } from "../Constant/CalendarConstant";

const useGetAgenda = (agendaId: string | undefined) => {
  const [thisAgendaData, setThisAgendaData] = useState<AgendaData | null>(null);
  const priorityRef = useRef<HTMLSelectElement>(null);

  const { data: agenda, isFetched: agendaIsFetched } = useQuery({
    queryKey: ["getAgenda"],
    queryFn: async (): Promise<AgendaItemType | null> => {
      if (agendaId) {
        return await getAgenda(agendaId);
      }
      return null;
    },
  });

  useEffect(() => {
    if (agendaIsFetched) {
      setThisAgendaData(
        agenda
          ? {
              id: agenda.id,
              agenda: agenda.agenda,
              priority: (PRIORITY_NUMBER as any)[agenda.priority],
              date: new Date(Date.parse(agenda.date)),
              description: agenda.description,
            }
          : null
      );
      priorityRef.current!.value = agenda
        ? (PRIORITY_NUMBER as any)[agenda.priority].toString()
        : "0";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agenda]);

  console.log("agenda data", thisAgendaData);
  return { thisAgendaData, agendaIsFetched, priorityRef };
};

export default useGetAgenda;
