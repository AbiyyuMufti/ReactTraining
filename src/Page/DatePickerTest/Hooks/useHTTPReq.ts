import { useQuery } from "@tanstack/react-query";
import { PostType } from "../Type/Posts";
import { getPosts } from "../API/JSONPlaceholder";

export function useHTTPReq() {
    const { data: postData } = useQuery({
        queryKey: ["getPosts"],
        queryFn: async (): Promise<PostType[] | null> => {
            return await getPosts();
        },
    });
    return { postData };
}
