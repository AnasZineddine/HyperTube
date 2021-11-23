import { Flex, Text, Stack, Container, Image, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";

const Movie = () => {
  const router = useRouter();

  const { id } = router.query;
  console.log({ id });
  return (
    <Flex alignItems="stretch" justifyContent="center">
      <Stack spacing={10} m={50} justifyContent="center" alignItems="stretch">
        <Container>
          <Container>
            <Image
              height="100px"
              width="100px"
              src="https://media.istockphoto.com/vectors/video-player-screen-with-bar-multimedia-interface-with-player-bar-for-vector-id1252447446?k=20&m=1252447446&s=612x612&w=0&h=1tjggag-kjC70w58govLL_OETAxgASJK1f_y5_dyl_Q="
            />
          </Container>
          <Container>
            <Center>
              <Text>Fiml details</Text>
            </Center>
          </Container>
        </Container>
        <Container>
          <Center>
            <Text>Comments</Text>
          </Center>
        </Container>
      </Stack>
    </Flex>
  );
};

export default Movie;
