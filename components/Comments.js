import { Text, Textarea } from "@chakra-ui/react";
import React from "react";

const Comments = () => {
  let [value, setValue] = React.useState("");

  let handleInputChange = (e) => {
    let inputValue = e.target.value;
    setValue(inputValue);
  };

  return (
    <>
      <Text mb="8px">Comment: {value}</Text>
      <Textarea
        value={value}
        onChange={handleInputChange}
        placeholder="Comment on the video"
        size="sm"
      />
    </>
  );
};

export default Comments;
