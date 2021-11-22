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
            direction={["column", "row"]}
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
          </Stack>
        </FormControl>
        <FormControl p="1" isRequired>
          <FormLabel htmlFor="firstName">First name</FormLabel>
          <Input
            type="text"
            name="firstName"
            //placeholder={data2.data.firstName}
            defaultValue={props.data.firstName}
          />
        </FormControl>
      </Stack>
    </Flex>
  );
};

export default Profile;

Profile.auth = true;
