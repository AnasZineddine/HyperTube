import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  Stack,
  Button,
  Text,
  Container,
  Center,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import SearchButton from "../components/SearchButton";

import Link from "next/link";

const Navbar = () => {
  const router = useRouter();
  const { data: session } = useSession();
  if (!session) {
    return (
      <Flex alignItems="center" justifyContent="space-between">
        <Box p={30}>
          <Text fontWeight={900} color="red" fontSize="2xl">
            <Link href="/">HyperTube</Link>
          </Text>
        </Box>
        <Stack
          spacing={2}
          alignItems="strectch"
          justifyContent="flex-start"
          isInline
          p={30}
        >
          <Link href="/signin">Sign In</Link>
          <Link href="/signup">Sign Up</Link>
        </Stack>
      </Flex>
    );
  }
  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Stack p={30} direction="row" alignItems="center">
        <Text fontWeight={900} color="red" fontSize="2xl">
          <Link href="/">HyperTube</Link>
        </Text>
        {router.pathname === "/" && <SearchButton />}
      </Stack>

      <Stack
        spacing={10}
        alignItems="center"
        justifyContent="center"
        isInline
        p={30}
      >
        <Button
          //as={Button}
          rounded={"full"}
          variant={"link"}
          //cursor={"pointer"}
          minW={0}
          onClick={() => router.push(`/users/${session.id}`)}
        >
          <Avatar name={session.user.name} src={session.user.image} />
        </Button>

        <Button
          colorScheme="red"
          onClick={() =>
            signOut({ callbackUrl: "http://localhost:3000/signin" })
          }
        >
          Sign out
        </Button>
      </Stack>
    </Flex>
  );
};

export default Navbar;

/* const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>Logo</Box>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"sm"}
                    src={"https://avatars.dicebear.com/api/male/username.svg"}
                  />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar
                      size={"2xl"}
                      src={"https://avatars.dicebear.com/api/male/username.svg"}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>Username</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem>Your Servers</MenuItem>
                  <MenuItem>Account Settings</MenuItem>
                  <MenuItem>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
 */
