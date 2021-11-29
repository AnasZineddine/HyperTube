import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Box, Text, Stack, Avatar, useColorModeValue } from "@chakra-ui/react";
import CommentForm from "./CommentForm";

var moment = require("moment");
import Link from "next/link";

const fetcher = (url) => fetch(url).then((r) => r.json());

const Comments = ({ movieId }) => {
  const { data: session, status } = useSession();
  const [content, setContent] = useState();
  const color = useColorModeValue("white", "gray.900");

  //console.log(session);

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

  return (
    <>
      {content?.comments.map((comments) => (
        <Box
          //maxW={"445px"}
          w={"full"}
          bg={color}
          boxShadow={"2xl"}
          rounded={"md"}
          p={6}
          overflow={"hidden"}
          key={comments.id}
        >
          <Stack mt={6} direction={"row"} spacing={4} align={"center"}>
            <Avatar src={comments.author.image} alt={"Author"} />
            <Stack direction={"column"} spacing={0} fontSize={"sm"}>
              <Text fontWeight={600}>{comments.author.username}</Text>

              <Text color={"gray.500"}>
                {moment(comments.createdAt).format("MMMM Do YYYY, h:mm a")}
              </Text>
            </Stack>
          </Stack>
          <Stack>
            <Text textAlign="justify">{comments.body}</Text>
          </Stack>
        </Box>
      ))}
      <CommentForm movieId={movieId} />
    </>
  );
};

export default Comments;
