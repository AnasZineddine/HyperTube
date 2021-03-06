import {
  Flex,
  Text,
  Stack,
  Container,
  Divider,
  Center,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Comments from "../../components/Comments";

import { useSession } from "next-auth/react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Movie = () => {
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const correctId = id?.replace("-1111", "");
  const { data, error } = useSWR(
    `https://yts.mx/api/v2/movie_details.json?movie_id=${correctId}&with_cast=true`,
    fetcher
  );
  const { data: data2, error: error2 } = useSWR(
    `/api/watched/${correctId}`,
    fetcher
  );

  if (error || error2) return <div>failed to load</div>;
  if (!data || !data2) return <div>Loading...</div>;

  const { locale } = router;
  //console.log(locale);
  //console.log("watched", data2);

  //console.log("movieData1", data);

  return (
    <Flex alignItems="stretch" justifyContent="center">
      <Stack spacing={10} m={50} justifyContent="center" alignItems="stretch">
        <Stack spacing={10}>
          <Container>
            <Center>
              {/* <iframe
                width="1200"
                height="700"
                title={data.data.movie.title}
                src={`https://www.youtube.com/embed/${data.data.movie.yt_trailer_code}`}
                allowFullScreen
              /> */}
              <video
                id="videoPlayer"
                width="650"
                controls
                muted="muted"
                autoPlay
                src={`/api/video/${id}`}
              >
                {/*  <source src={`/api/video/${id}`} type="video/mp4" /> */}

                <track
                  label="English"
                  kind="subtitles"
                  srcLang="en"
                  src={`/api/subtitles/${data.data.movie.imdb_code}/en`}
                  default={locale === "en" ? true : false}
                ></track>
                <track
                  label="French"
                  kind="subtitles"
                  srcLang="fr"
                  src={`/api/subtitles/${data.data.movie.imdb_code}/fr`}
                  default={locale === "fr" ? true : false}
                ></track>
                <track
                  label="Arabic"
                  kind="subtitles"
                  srcLang="ar"
                  src={`/api/subtitles/${data.data.movie.imdb_code}/ar`}
                ></track>
              </video>
            </Center>
          </Container>
          <Container>
            <Center>
              {data2.watched === true ? <FiEye /> : <FiEyeOff />}

              <Text textAlign="justify">
                - {data.data.movie.title} - {data.data.movie.year}
              </Text>
            </Center>
          </Container>
          <Container>
            <Divider />
            <Text textAlign="justify">{data.data.movie.description_full}</Text>
            <Divider />
            <Container>
              <Center>
                <Text textAlign="justify">
                  Rating : {data.data.movie.rating} / 10
                </Text>
              </Center>
            </Container>
          </Container>
          <Container>
            <Divider />

            {data.data.movie.cast.map((actor) => (
              <Text textAlign="Center" key={actor.imdb_code}>
                {actor.name}
              </Text>
            ))}

            <Divider />
          </Container>
        </Stack>
        <Container>
          <Comments movieId={correctId} />
        </Container>
      </Stack>
    </Flex>
  );
};

export default Movie;

Movie.auth = true;
