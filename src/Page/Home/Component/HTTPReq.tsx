import { useHTTPReq } from "../Hooks/useHTTPReq";

function HTTPReq() {
    const { postData } = useHTTPReq();
    return (
        <div>
            {postData === null ? (
                <span> Failed to get posts data </span>
            ) : (
                <pre>{JSON.stringify(postData, null, 4)}</pre>
            )}
        </div>
    );
}

export default HTTPReq;
