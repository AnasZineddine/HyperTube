import { useState } from "react";
import {
  Textarea,
  Button,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";

import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

const schema = Yup.object().shape({
  comment: Yup.string() //TODO:it acceots whitespace only, use regex...
    .min(1, "Must have 1 character minimum")
    .max(1000, "Must be shorter than 1000"),
});

const CommentForm = ({ movieId }) => {
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

  const onSubmit = async (values) => {
    const response = await fetch(`/api/comments/${movieId}`, {
      method: "POST",
      body: JSON.stringify({
        username: "azineddi",
        body: values.comment,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.success === true) {
      router.reload();
      //console.log(data);
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
    console.log(data);
  };
  return (
    <>
      <FormControl isInvalid={errors.comment?.message} p="1">
        <Textarea {...register("comment")}></Textarea>
        <FormErrorMessage>{errors?.comment?.message}</FormErrorMessage>
      </FormControl>
      <Button
        variant="solid"
        size="md"
        onClick={handleSubmit(onSubmit)}
        disabled={errors.comment}
      >
        Submit
      </Button>
    </>
  );
};

export default CommentForm;
