import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PostType } from "../Type/Currency";
import {
  addCurrency,
  getCurrency,
  removeCurrency,
  updateCurrency,
} from "../API/HistoricalCurrencyAPI";

const useGetCurrencyData = () => {
  const queryClient = useQueryClient();
  const { data: currencyData, isLoading: fetchDataLoading } = useQuery({
    queryKey: ["getCurrency"],
    queryFn: async (): Promise<PostType[] | null> => {
      return await getCurrency();
    },
  });

  const { mutateAsync: addCurrencyData } = useMutation({
    mutationFn: addCurrency,
    onSuccess: () => {
      queryClient.invalidateQueries(["getCurrency"]);
    },
  });

  const { mutateAsync: updateCurrencyData } = useMutation({
    mutationFn: updateCurrency,
    onSuccess: () => {
      queryClient.invalidateQueries(["getCurrency"]);
    },
  });

  const { mutateAsync: removeCurrencyData } = useMutation({
    mutationFn: removeCurrency,
    onSuccess: () => {
      queryClient.invalidateQueries(["getCurrency"]);
    },
  });

  return {
    currencyData,
    fetchDataLoading,
    addCurrencyData,
    updateCurrencyData,
    removeCurrencyData,
  };
};

export default useGetCurrencyData;
