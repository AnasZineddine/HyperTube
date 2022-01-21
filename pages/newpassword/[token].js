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
  password: Yup.string()
    .required("Must enter a password")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .max(255, "Must be shorter than 255")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
});

export default function NewPassword({ csrfToken, providers }) {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(schema),
  });

  const router = useRouter();
  const { token } = router.query;
  const url = `/api/reset/${token}`;
  //TODO: check token validity before ??

  const onSubmit = async (values) => {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.success === true) {
      //TODO: ADD email
      router.push("/signin");
      toast({
        title: "Done",
        description: "New Password confirmed",
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
        <FormControl isInvalid={errors.password?.message} p="1" isRequired>
          <FormLabel htmlFor="password">New password</FormLabel>
          <Input
            type="password"
            name="password"
            placeholder="Enter your new password"
            {...register("password")}
          />
          <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
        </FormControl>
        <Button
          variant="solid"
          size="md"
          onClick={handleSubmit(onSubmit)}
          disabled={errors.password}
        >
          Confirm
        </Button>
      </Stack>
    </Flex>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  /* if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } */
  return {
    props: { session },
  };
}
