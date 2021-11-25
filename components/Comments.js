import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const fetcher = (url) => fetch(url).then((r) => r.json());

const Comments = ({ movieId }) => {
  const { data: session, status } = useSession();
  const [content, setContent] = useState();

  //console.log(session);
  console.log(movieId);

  // Fetch content from protected route
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/comments/${movieId}`);
      const json = await res.json();
      if (json.content) {
        setContent(json.content);
      }
    };
    fetchData();
  }, [session]);

  if (typeof window !== "undefined" && status === "loading") return null;

  console.log("content", content);

  return (
    <div>
      {content?.comments.map((comments) => (
        <h1 key={comments.id}>{comments.body}</h1>
      ))}
    </div>
  );
};

export default Comments;
