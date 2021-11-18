import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import useSWR, { SWRConfig } from "swr";

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  FormErrorMessage,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { useSession, signIn } from "next-auth/react";
import React from "react";

const schema = Yup.object().shape({
  firstName: Yup.string()
    //.min(1, "Must have 1 character minimum")
    .max(255, "Must be shorter than 255")
    .required("Must enter a firstname"),
  lastName: Yup.string()
    //  .min(1, "Must have 1 character minimum")
    .max(255, "Must be shorter than 255")
    .required("Must enter a lastname"),
  username: Yup.string()
    // .min(1, "Must have a character")
    .max(255, "Must be shorter than 255")
    .required("Must enter a username"),
  email: Yup.string()
    .email("Must be a valid email adress")
    .max(255, "Must be shorter than 255")
    .required("Must enter an email"),
});

const fetcher = (url) => fetch(url).then((res) => res.json());
const API = "http://localhost:3000/api/users/kjsdfkddkdk";

export default function profile() {
  const { data: session, loading } = useSession();
  console.log(session);
  if (typeof window !== "undefined" && loading) return null;
  const { content, error } = useSWR(API, fetcher);

  if (!session) {
    return <h1>not auth</h1>;
  }
  console.log(content);
  if (error) return "An error has occurred.";
  if (!content) return "Loading...";
  //const [content, setContent] = useState();
  const toast = useToast();

  /* useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/users/kdkddkkdkd");
      const json = await res.json();
      if (json.content) {
        setContent(json.content);
      }
    };
    fetchData();
  }, [session]); */

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (values) => {
    const response = await fetch("/api/users/kdkddkkdkd", {
      method: "PATCH",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.success === true) {
      //TODO: ADD email
      toast({
        title: "Done",
        description: "Data saved successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } else {
      toast({
        title: "Error",
        description: data.error,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  console.log(content);

  return (
    <Flex
      //minH={"100vh"}
      align={"center"}
      justify={"center"}
      //bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          User Profile Edit
        </Heading>
        <FormControl id="userName">
          <FormLabel>User Icon</FormLabel>
          <Stack direction={["column", "row"]} spacing={6}>
            <Center>
              <Avatar
                size="xl"
                name={session.user.name}
                src={session.user.image}
              >
                <AvatarBadge
                  as={IconButton}
                  size="sm"
                  rounded="full"
                  top="-10px"
                  colorScheme="red"
                  aria-label="remove Image"
                  icon={<SmallCloseIcon />}
                />
              </Avatar>
            </Center>
            <Center w="full">
              <Button w="full">Change Image</Button>
            </Center>
          </Stack>
        </FormControl>
        <FormControl isInvalid={errors.firstName?.message} p="1" isRequired>
          <FormLabel htmlFor="firstName">First name</FormLabel>
          <Input
            type="text"
            name="firstName"
            //placeholder={data2.data.firstName}
            defaultValue={content.firstName}
            {...register("firstName")}
          />
          <FormErrorMessage>{errors?.firstName?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.lastName?.message} p="1" isRequired>
          <FormLabel htmlFor="lastName">Last name</FormLabel>
          <Input
            type="text"
            name="lastName"
            defaultValue={content.lastName}
            {...register("lastName")}
          />
          <FormErrorMessage>{errors?.lastName?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.username?.message} p="1" isRequired>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            type="text"
            name="username"
            defaultValue={content.username}
            {...register("username")}
          />
          <FormErrorMessage>{errors?.username?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.email?.message} p="1" isRequired>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            type="email"
            name="email"
            defaultValue={content.email}
            {...register("email")}
          />
          <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
        </FormControl>
        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            bg={"red.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "red.500",
            }}
          >
            Cancel
          </Button>
          <Button
            bg={"blue.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "blue.500",
            }}
            onClick={handleSubmit(onSubmit)}
            disabled={
              errors.email ||
              errors.firstName ||
              errors.lastName ||
              errors.username
            }
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
