import axios from "axios";
import { toast } from "react-toastify";
import { PostType, postSchema } from "../Type/Posts";

export const getPosts = async (): Promise<PostType[] | null> => {
    try {
        const { data }: { data: PostType[] } = await axios({
            url: "https://jsonplaceholder.typicode.com/posts",
            method: "GET",
        });

        postSchema.array().parse(data);

        return data;
    } catch (e) {
        const error = e as Error;
        toast.error(error.message);
        return null;
    }
};
