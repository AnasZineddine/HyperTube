import { Flex, Text, Stack, Container, Image, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import useSWR from "swr";

const Movie = () => {
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR(
    `https://yts.mx/api/v2/movie_details.json?movie_id=${id}`,
    fetcher
  );
  if (error) return <div>failed to load</div>;
  if (!data) return <div>Loading...</div>;

  console.log(data);
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
          <Center>
            <Text>Comments</Text>
          </Center>
        </Container>
      </Stack>
    </Flex>
  );
};

export default Movie;
