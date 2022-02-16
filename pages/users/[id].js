import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import useSWR, { SWRConfig } from "swr";
import UploadUi from "../../components/Upload";

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
import { useSession, getSession, signIn } from "next-auth/react";
import React from "react";
import { useRouter } from "next/router";
import Profile from "../../components/Profile";

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
export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { data, error } = useSWR(`/api/users/${router.query.id}`, fetcher);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(schema),
  });
  const color = useColorModeValue("white", "gray.700");
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  const { id } = router.query;
  if (data.error === "User not found") {
    return <h1>user not found</h1>; //TODO: do it better
  }

  const onSubmit = async (values) => {
    // use swr to patch changes using cache
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
        duration: 3500,
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
    router.back();
  };

  const onChange = async (formData) => {
    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event) => {
        console.log(
          `Current progress:`,
          Math.round((event.loaded * 100) / event.total)
        );
      },
    };
    const response = await axios.post("/api/upload", formData, config);

    console.log("response", response.data);
  };

  if (id === session.id) {
    return (
      <Flex
        //minH={"100vh"}
        align={"center"}
        justify={"center"}
        //bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack
          spacing={5}
          w={"full"}
          maxW={"md"}
          bg={color}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={12}
        >
          <Center w="full">
            <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
              User Profile Edit
            </Heading>
          </Center>
          <FormControl id="userName">
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
                <Stack>
                  <UploadUi
                    label="Upload Single File"
                    uploadFileName="theFiles"
                    onChange={onChange}
                  />
                  <Button onClick={() => router.push("/forgotpassword")}>
                    Change password
                  </Button>
                </Stack>
              </Center>
            </Stack>
          </FormControl>
          <FormControl isInvalid={errors.firstName?.message} p="1" isRequired>
            <FormLabel htmlFor="firstName">First name</FormLabel>
            <Input
              type="text"
              name="firstName"
              //placeholder={data2.data.firstName}
              defaultValue={data.content.firstName}
              {...register("firstName")}
            />
            <FormErrorMessage>{errors?.firstName?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.lastName?.message} p="1" isRequired>
            <FormLabel htmlFor="lastName">Last name</FormLabel>
            <Input
              type="text"
              name="lastName"
              defaultValue={data.content.lastName}
              {...register("lastName")}
            />
            <FormErrorMessage>{errors?.lastName?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.username?.message} p="1" isRequired>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              type="text"
              name="username"
              defaultValue={data.content.username}
              {...register("username")}
            />
            <FormErrorMessage>{errors?.username?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.email?.message} p="1" isRequired>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              type="email"
              name="email"
              defaultValue={data.content.email}
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
              onClick={() => router.back()}
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
  } else {
    return <Profile data={data.content} />;
  }
}

ProfilePage.auth = true;
