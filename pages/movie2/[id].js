import { Flex, Text, Stack, Container, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Comments from "../../components/Comments";

import { useSession } from "next-auth/react";

const Movie = () => {
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR(`http://popcorn-ru.tk/movie/${id}`, fetcher);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>Loading...</div>;

  console.log("movieData2", data);

  return (
    <Flex alignItems="stretch" justifyContent="center">
      <Stack spacing={10} m={50} justifyContent="center" alignItems="stretch">
        <Stack spacing={20}>
          <Container>
            <Center>
              <video
                controls
                src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
                poster="https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217"
                width="620"
              >
                Sorry, your browser doesn't support embedded videos, but don't
                worry, you can{" "}
                <a href="https://archive.org/details/BigBuckBunny_124">
                  download it
                </a>
                and watch it with your favorite video player!
              </video>
            </Center>
          </Container>
          <Container>
            <Text textAlign="justify">{data.synopsis}</Text>
          </Container>
        </Stack>
        <Container>
          <Comments movieId={id} />
        </Container>
      </Stack>
    </Flex>
  );
};

export default Movie;

Movie.auth = true;
