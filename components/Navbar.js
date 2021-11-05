import { Flex, Box, Text, Stack } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";

import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();
  if (!session) {
    return (
      <Flex alignItems="stretch" justifyContent="space-between">
        <Box p={30}>
          <Text>Hypertube</Text>
        </Box>
        <Stack
          spacing={2}
          alignItems="stretch"
          justifyContent="flex-start"
          isInline
          p={30}
        >
          <Link href="/api/auth/signin">Sign In</Link>
          <Link href="/signup">Sign Up</Link>
        </Stack>
      </Flex>
    );
  }
  return (
    <Flex alignItems="stretch" justifyContent="space-between">
      <Box p={30}>
        <Text>Hypertube</Text>
      </Box>
      <Stack
        spacing={2}
        alignItems="stretch"
        justifyContent="flex-start"
        isInline
        p={30}
      >
        <button onClick={() => signOut()}>Sign out</button>
      </Stack>
    </Flex>
  );
};

export default Navbar;
