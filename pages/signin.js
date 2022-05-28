import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  signIn,
  getCsrfToken,
  getProviders,
  getSession,
} from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";

import {
  Flex,
  Text,
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Divider,
} from "@chakra-ui/react";

import en from "../utils/en";
import fr from "../utils/fr";

const schema = Yup.object().shape({
  username: Yup.string()
    .max(255, "Must be shorter than 255")
    .required("Must enter a username"),
  password: Yup.string()
    .required("Must enter a password")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .max(255, "Must be shorter than 255")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters."), // TODO:make it stronger
});

export default function SignIn({ csrfToken, providers }) {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(schema),
  });

  const onSubmit = (values) => {
    signIn("credentials", {
      username: values.username,
      password: values.password,
      callbackUrl: "/",
    });
  };

  const { locale } = router;
  const t = locale === "en" ? en : fr;

  return (
    //
    <Flex alignItems="stretch" justifyContent="center">
      <Stack
        spacing={5}
        m={50}
        justifyContent="flex-start"
        alignItems="stretch"
        w={350}
      >
        {/* <Text display="flex" justifyContent="center">
          Sign In
        </Text> */}

        <Input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <FormControl isInvalid={errors.username?.message} p="1" isRequired>
          <FormLabel htmlFor="username">{t.username}</FormLabel>
          <Input
            type="text"
            name="username"
            placeholder={t.enterausername}
            {...register("username")}
            id="username"
          />
          <FormErrorMessage>{errors?.username?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.password?.message} p="1" isRequired>
          <FormLabel htmlFor="password">{t.password}</FormLabel>
          <Input
            type="password"
            name="password"
            placeholder={t.enterapassword}
            {...register("password")}
            id="password"
          />
          <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
        </FormControl>
        <Link href="/forgotpassword">{t.forgotpassword}</Link>
        <Button
          variant="solid"
          size="md"
          onClick={handleSubmit(onSubmit)}
          disabled={errors.username || errors.password}
        >
          {t.signin}
        </Button>
        <Divider />

        <Stack spacing={1}>
          {Object.values(providers).map(
            (provider) =>
              provider.name != "Credentials" && (
                <Button
                  key={provider.name}
                  variant="solid"
                  size="md"
                  onClick={() => {
                    signIn(provider.id);
                    setLoading(true);
                  }}
                  isLoading={isLoading}
                  loadingText="Submitting"
                >
                  Sign in with {provider.name}
                </Button>
              )
          )}
        </Stack>
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
    props: {
      csrfToken: await getCsrfToken(context),
      providers: await getProviders(),
      session,
    },
  };
}
