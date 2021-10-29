import { Flex, Box, Text, Stack, Link } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <Flex
      flexDirection="column"
      alignItems="stretch"
      justifyContent="flex-start"
    >
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
          <Link>Sign In</Link>
          <Link>Sign Up</Link>
        </Stack>
      </Flex>
    </Flex>
  );
};

export default Navbar;
