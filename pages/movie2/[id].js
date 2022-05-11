import { Flex, Text, Stack, Container, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Comments from "../../components/Comments";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { useSession } from "next-auth/react";

const Movie = () => {
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR(`http://popcorn-time.ga/movie/${id}`, fetcher);
  const { data: data2, error: error2 } = useSWR(`/api/watched/${id}`, fetcher);
  if (error || error2) return <div>failed to load</div>;
  if (!data || !data2) return <div>Loading...</div>;

  console.log("movieData2", data);
  console.log("watched", data2);
  const { locale } = router;

  return (
    <Flex alignItems="stretch" justifyContent="center">
      <Stack spacing={10} m={50} justifyContent="center" alignItems="stretch">
        <Stack spacing={10}>
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
              {/* src={`/api/video/${id}`} */}
              <video
                id="videoPlayer"
                width="650"
                controls
                muted="muted"
                autoPlay
              >
                <source src={`/api/video/${id}`} type="video/mp4" />
                <track
                  label="English"
                  kind="subtitles"
                  srcLang="en"
                  src={`/api/subtitles/${id}/en`}
                  default={locale === "en" ? true : false}
                ></track>
                <track
                  label="French"
                  kind="subtitles"
                  srcLang="fr"
                  src={`/api/subtitles/${id}/fr`}
                  default={locale === "fr" ? true : false}
                ></track>
                <track
                  label="Arabic"
                  kind="subtitles"
                  srcLang="ar"
                  src={`/api/subtitles/${id}/ar`}
                ></track>
              </video>
            </Center>
          </Container>
          <Container>
            <Center>
              {data2.watched === true ? <FiEye /> : <FiEyeOff />}

              <Text textAlign="justify">
                {data.title} - {data.year}
              </Text>
            </Center>
          </Container>

          <Container>
            <Text textAlign="justify">{data.synopsis}</Text>
          </Container>
          <Container>
            <Center>
              <Text textAlign="justify">
                Rating : {data.rating.percentage}%
              </Text>
            </Center>
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
