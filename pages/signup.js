import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Flex,
  Text,
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  Button,
} from "@chakra-ui/react";

const schema = Yup.object().shape({
  firstName: Yup.string()
    .min(1, "Must have 1 character minimum")
    .max(255, "Must be shorter than 255")
    .required("Must enter a firstname"),
  lastName: Yup.string()
    .min(1, "Must have 1 character minimum")
    .max(255, "Must be shorter than 255")
    .required("Must enter a lastname"),
  username: Yup.string()
    .min(1, "Must have a character")
    .max(255, "Must be shorter than 255")
    .required("Must enter a username"),
  email: Yup.string()
    .email("Must be a valid email adress")
    .max(255, "Must be shorter than 255")
    .required("Must enter an email"),
  password: Yup.string()
    .min(8, "Password is too short - should be 8 chars minimum.")
    .max(255, "Must be shorter than 255")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters.") // TODO:make it stronger
    .required("Must enter a password"),
});

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(schema),
  });

  const onSubmit = (values) => console.log(values);

  return (
    <Flex alignItems="stretch" justifyContent="center">
      <Stack
        spacing={0}
        m={50}
        justifyContent="flex-start"
        alignItems="stretch"
        w={350}
      >
        <Text display="flex" justifyContent="center">
          Sign Up
        </Text>

        <FormControl isInvalid={errors.firstName?.message} p="1" isRequired>
          <FormLabel htmlFor="firstName">First name</FormLabel>
          <Input
            type="text"
            name="firstName"
            placeholder="Enter your firstname"
            {...register("firstName")}
          />
          <FormErrorMessage>{errors?.firstName?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.lastName?.message} p="1" isRequired>
          <FormLabel htmlFor="lastName">Last name</FormLabel>
          <Input
            type="text"
            name="lastName"
            placeholder="Enter your lastname"
            {...register("lastName")}
          />
          <FormErrorMessage>{errors?.lastName?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.username?.message} p="1" isRequired>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            type="text"
            name="username"
            placeholder="Enter a username"
            {...register("username")}
          />
          <FormErrorMessage>{errors?.username?.message}</FormErrorMessage>
        </FormControl>
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
        <FormControl isInvalid={errors.password?.message} p="1" isRequired>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            type="password"
            name="password"
            placeholder="Enter a password"
            {...register("password")}
          />
          <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
        </FormControl>
        <Button
          variant="solid"
          size="md"
          onClick={handleSubmit(onSubmit)}
          disabled={
            errors.email ||
            errors.password ||
            errors.firstName ||
            errors.lastName ||
            errors.username
          }
        >
          Register
        </Button>
      </Stack>
    </Flex>
  );
};

export default SignUp;
