import { Flex, Text, Stack, Container, Image, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Comments from "../../components/Comments";

import { useSession } from "next-auth/react";

const Movie = () => {
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR(
    `https://yts.mx/api/v2/movie_details.json?movie_id=${id}&with_cast=true`,
    fetcher
  );
  if (error) return <div>failed to load</div>;
  if (!data) return <div>Loading...</div>;

  console.log("movieData1", data);

  return (
    <Flex alignItems="stretch" justifyContent="center">
      <Stack spacing={10} m={50} justifyContent="center" alignItems="stretch">
        <Stack spacing={20}>
          <Container>
            <Center>
              <iframe
                width="1200"
                height="700"
                title={data.data.movie.title}
                src={`https://www.youtube.com/embed/${data.data.movie.yt_trailer_code}`}
                allowFullScreen
              />
            </Center>
          </Container>
          <Container>
            <Text textAlign="justify">{data.data.movie.description_full}</Text>
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
