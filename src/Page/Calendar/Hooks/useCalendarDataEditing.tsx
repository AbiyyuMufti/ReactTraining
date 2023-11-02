import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addNewAgenda,
  removeAgenda,
  updateAgenda,
} from "../API/CalendarDataAPI";

const useCalendarDataEditing = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: addNewAgendaHandler } = useMutation({
    mutationFn: addNewAgenda,
    onSuccess: () => {
      queryClient.invalidateQueries(["getCalendarAgenda"]);
    },
  });

  const { mutateAsync: updateAgendaHandler } = useMutation({
    mutationFn: updateAgenda,
    onSuccess: () => {
      queryClient.invalidateQueries(["getCalendarAgenda"]);
    },
  });

  const { mutateAsync: removeAgendaHandler } = useMutation({
    mutationFn: removeAgenda,
    onSuccess: () => {
      queryClient.invalidateQueries(["getCalendarAgenda"]);
    },
  });

  return {
    addNewAgendaHandler,
    updateAgendaHandler,
    removeAgendaHandler,
  };
};

export default useCalendarDataEditing;
