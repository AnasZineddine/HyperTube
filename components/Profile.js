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
  Text,
} from "@chakra-ui/react";

const Profile = (props) => {
  console.log({ props });
  const color = useColorModeValue("white", "gray.700");

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
        <FormControl id="userName">
          <Stack
            direction={["column"]}
            spacing={6}
            align={"center"}
            justify={"center"}
          >
            <Center>
              <Avatar
                size="xl"
                src={props.data.image}
                name={props.data.firstName + " " + props.data.lastName}
              ></Avatar>
            </Center>
            <Text fontSize="xl">{props.data.firstName}</Text>
            <Text fontSize="xl">{props.data.lastName}</Text>
            <Text fontSize="xl">{props.data.username}</Text>
          </Stack>
        </FormControl>
      </Stack>
    </Flex>
  );
};

export default Profile;

Profile.auth = true;
