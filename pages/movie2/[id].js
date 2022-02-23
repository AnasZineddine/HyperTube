import { Flex, Text, Stack, Container, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Comments from "../../components/Comments";
import Plyr from "plyr";

import { useSession } from "next-auth/react";

const Movie = () => {
  const player = new Plyr("#player");
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
              {/* <iframe
                width="1200"
                height="700"
                title={data.title}
                src={`https://www.youtube.com/embed/${
                  data.trailer.split("=")[1]
                }`}
                allowFullScreen
              /> */}
              <video
                id="videoPlayer"
                width="650"
                controls
                muted="muted"
                autoPlay
              >
                <source src={`/api/video/${id}`} type="video/mp4" />
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
