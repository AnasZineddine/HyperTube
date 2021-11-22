import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";

import {
  Flex,
  Text,
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Must be a valid email adress")
    .max(255, "Must be shorter than 255")
    .required("Must enter an email"),
});

export default function ForgotPassword() {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (values) => {
    const response = await fetch("/api/recover", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.success === true) {
      //TODO: ADD email
      //router.push("/signin");
      toast({
        title: "Done",
        description: "We've sent a recover link to your email",
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
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    console.log(data);
  };

  return (
    //
    <Flex alignItems="stretch" justifyContent="center">
      <Stack
        spacing={0}
        m={50}
        justifyContent="flex-start"
        alignItems="stretch"
        w={350}
      >
        <Text display="flex" justifyContent="center">
          Forgot Password
        </Text>

        <FormControl isInvalid={errors.email?.message} p="1" isRequired>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            {...register("email")}
          />
          <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
        </FormControl>

        <Button
          variant="solid"
          size="md"
          onClick={handleSubmit(onSubmit)}
          disabled={errors.email}
        >
          Reset Password
        </Button>
      </Stack>
    </Flex>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}
