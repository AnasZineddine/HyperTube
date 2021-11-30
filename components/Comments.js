import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  Box,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import CommentForm from "./CommentForm";
import Link from "next/link";

var moment = require("moment");
import { useRouter } from "next/router";

const fetcher = (url) => fetch(url).then((r) => r.json());

const Comments = ({ movieId }) => {
  const { data: session, status } = useSession();
  const [content, setContent] = useState();
  const color = useColorModeValue("white", "gray.900");
  const router = useRouter();

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
            <Button
              //as={Button}
              rounded={"full"}
              variant={"link"}
              //cursor={"pointer"}
              minW={0}
              onClick={() => router.push(`/users/${comments.author.id}`)}
            >
              <Avatar src={comments.author.image} alt={"Author"} />
            </Button>
            <Stack direction={"column"} spacing={0} fontSize={"sm"}>
              <Text fontWeight={600}>
                <Link href={`/users/${comments.author.id}`}>
                  {comments.author.username}
                </Link>
              </Text>

              <Text color={"gray.500"}>
                {moment(comments.createdAt).format("MMMM Do YYYY, h:mm a")}
              </Text>
            </Stack>
          </Stack>
          <Stack p={3} ml={12}>
            <Text textAlign="justify">{comments.body}</Text>
          </Stack>
        </Box>
      ))}
      <CommentForm movieId={movieId} />
    </>
  );
};

export default Comments;
