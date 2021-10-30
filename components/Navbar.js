import { Flex, Box, Text, Stack } from "@chakra-ui/react";

import Link from "next/link";

const Navbar = () => {
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
        <Link href="/signin">Sign In</Link>
        <Link href="/signup">Sign Up</Link>
      </Stack>
    </Flex>
  );
};

export default Navbar;
