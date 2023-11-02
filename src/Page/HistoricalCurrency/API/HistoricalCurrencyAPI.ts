import axios from "axios";
import { toast } from "react-toastify";
import { PostType, currencySchema } from "../Type/Currency";

export const getCurrency = async () => {
  try {
    const { data }: { data: PostType[] } = await axios({
      url: "http://localhost:8000/historical-currency",
      method: "GET",
    });
    currencySchema.array().parse(data);
    return data;
  } catch (e) {
    const error = e as Error;
    toast.error(error.message);
    return null;
  }
};

export const addCurrency = async (payload: {
  country: string;
  currency: number;
}) => {
  try {
    const { data } = await axios({
      url: "http://localhost:8000/historical-currency/insert",
      method: "POST",
      data: payload,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return data;
  } catch (e) {
    const error = e as Error;
    console.log(error);
    toast.error(error.message);
    return null;
  }
};

export const updateCurrency = async (payload: {
  country: string;
  currency: number;
}) => {
  try {
    const { data, status } = await axios({
      url: "http://localhost:8000/historical-currency/update",
      method: "POST",
      data: payload,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    console.log(data, status);
    return data;
  } catch (e) {
    const error = e as Error;
    console.log(error);
    toast.error(error.message);
    return null;
  }
};

export const removeCurrency = async (payload: {
  country: string;
  currency: number;
}) => {
  try {
    const { data, status } = await axios({
      url: "http://localhost:8000/historical-currency/remove",
      method: "POST",
      data: payload,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    console.log(data, status);
    return data;
  } catch (e) {
    const error = e as Error;
    console.log(error);
    toast.error(error.message);
    return null;
  }
};
