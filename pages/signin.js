import { Formik } from "formik";
import * as Yup from "yup";
import Error from "../utils/formError";
import React from "react";
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

const validationSchema = Yup.object().shape({
  userName: Yup.string()
    .min(1, "Must have a character")
    .max(255, "Must be shorter than 255")
    .required("Must enter a username"),
  password: Yup.string()
    .min(8, "Password is too short - should be 8 chars minimum.")
    .max(255, "Must be shorter than 255")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters.") // TODO:make it stronger
    .required("Must enter a password"),
});

const SignUp = () => {
  return (
    <Flex alignItems="stretch" justifyContent="center">
      <Stack
        spacing={10}
        m={50}
        justifyContent="flex-start"
        alignItems="stretch"
      >
        <Text display="flex" justifyContent="center">
          Sign In
        </Text>
        <FormControl>
          <FormLabel>Firstname</FormLabel>
          <Input placeholder="Enter your firstname" />
          <FormErrorMessage>Error message</FormErrorMessage>
          <FormLabel>Lastname</FormLabel>
          <Input placeholder="Enter your lastname" />
          <FormLabel>Username</FormLabel>
          <Input placeholder="Enter your username" />
          <FormLabel>Email</FormLabel>
          <Input placeholder="Enter your email" />
          <FormLabel>Password</FormLabel>
          <Input />
          <FormHelperText>Please enter a strong password</FormHelperText>
        </FormControl>
        <Button variant="solid" size="md">
          Register
        </Button>
      </Stack>
    </Flex>
  );
};

export default SignUp;
