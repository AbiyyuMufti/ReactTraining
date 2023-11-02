import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { AuthType, TSignUpPayload, TUserID, authSchema } from "../Type/Posts";

export const authenticateUser = async (
  payload: TUserID
): Promise<AuthType | null> => {
  try {
    const { data }: { data: AuthType } = await axios({
      url: "http://localhost:8000/users/authenticate",
      method: "POST",
      data: payload,
      proxy: { host: "localhost", port: 8000 },
    });
    authSchema.parse(data);
    return data;
  } catch (e) {
    const error = e as Error;
    toast.error(error.message);
    console.log(error.message);
    return null;
  }
};

export const userSignUp = async (payload: TSignUpPayload) => {
  try {
    return await axios({
      url: "http://localhost:8000/users/insert",
      method: "POST",
      data: payload,
    });
  } catch (e) {
    const error = e as AxiosError;
    toast.error(`${error.response?.data}`);
    console.log(error.response?.data);
    return null;
  }
};
