import axios from "axios";
import { UserType, userSchema } from "../Type/Posts";
import { toast } from "react-toastify";

export const getUsers = async () => {
  try {
    const { data }: { data: UserType[] } = await axios({
      url: `http://localhost:8000/users/`,
      method: "GET",
    });
    userSchema.array().parse(data);
    return data;
  } catch (e) {
    const error = e as Error;
    toast.error(error.message);
    return null;
  }
};
