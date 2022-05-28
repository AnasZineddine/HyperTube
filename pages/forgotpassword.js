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

import en from "../utils/en";
import fr from "../utils/fr";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Must be a valid email adress")
    .max(255, "Must be shorter than 255")
    .required("Must enter an email"),
});

export default function ForgotPassword() {
  const toast = useToast();
  const router = useRouter();
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
      //TODO: ADD email ? and signout user if logged in in the new password section ?
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
    router.back();

    //console.log(data);
  };
  const { locale } = router;
  const t = locale === "en" ? en : fr;

  return (
    //
    <Flex alignItems="stretch" justifyContent="center">
      <Stack
        spacing={0}
        m={50}
        justifyContent="flex-start"
        alignItems="stretch"
        w={350}
        spacing={7}
      >
        <Text display="flex" justifyContent="center">
          {t.forgotpassword}
        </Text>

        <FormControl isInvalid={errors.email?.message} p="1" isRequired>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            type="email"
            name="email"
            placeholder={t.enteryouremail}
            {...register("email")}
          />
          <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
        </FormControl>

        <Stack spacing={1}>
          <Button
            variant="solid"
            size="md"
            onClick={handleSubmit(onSubmit)}
            disabled={errors.email}
          >
            {t.send}
          </Button>
          <Button
            bg={"red.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "red.500",
            }}
            onClick={() => router.back()}
          >
            {t.cancel}
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}

/* export async function getServerSideProps(context) {
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
} */
