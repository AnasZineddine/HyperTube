import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Box, Text, Stack, Avatar, useColorModeValue } from "@chakra-ui/react";

var moment = require("moment");

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

  /*<h1>
    {content?.comments.map((comments) => (
      <h1 key={comments.id}>{comments.body}</h1>
    ))}
    </h1>*/

  /*
    {content?.comments.map((comments) => (
      <Box
        maxW={'445px'}
        w={'full'}
        bg={color}
        boxShadow={'2xl'}
        rounded={'md'}
        p={6}
        overflow={'hidden'}>
        <Stack mt={6} direction={'row'} spacing={4} align={'center'}>
          <Avatar
            src={null}
            alt={'Author'}
          />
          <Stack direction={'column'} spacing={0} fontSize={'sm'}>
            <Text fontWeight={600}>{comments.username}</Text>
            <Text color={'gray.500'}>{comments.createdAt}</Text>
          </Stack>
        </Stack>
        <Stack>
        <Text color={'gray.500'}>
            {comments.body}
          </Text>
        </Stack>
      </Box>
    ))}
    */

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
            <Avatar src={null} alt={"Author"} />
            <Stack direction={"column"} spacing={0} fontSize={"sm"}>
              <Text fontWeight={600}>{comments.username}</Text>
              <Text color={"gray.500"}>
                {moment(comments.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
              </Text>
            </Stack>
          </Stack>
          <Stack>
            <Text color={"gray.500"} textAlign="justify">
              {comments.body}
            </Text>
          </Stack>
        </Box>
      ))}
    </>
  );
};

export default Comments;
