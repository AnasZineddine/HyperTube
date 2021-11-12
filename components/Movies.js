import fetch from "unfetch";
import useSWR from "swr";
import Image from "next/image";
import {
  chakra,
  Box,
  Flex,
  useColorModeValue,
  Link,
  Grid,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import useSWRInfinite from "swr/infinite";
import { Progress } from "@chakra-ui/react";

export default function Movies() {
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data, error } = useSWR(
    "https://yts.mx/api/v2/list_movies.json?sort_by=rating&limit=50",
    fetcher
  );
  if (error) return <div>failed to load</div>;
  if (!data) return <div>Loading...</div>;
  console.log(data);

  /*  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.data) return null;

    // first page, we don't have `previousPageData`
    if (pageIndex === 0) {
      return `https://yts.mx/api/v2/list_movies.json?sort_by=rating&limit=50`;
    }

    return `https://yts.mx/api/v2/list_movies.json?sort_by=rating&limit=50&page=${pageIndex}`;
  };

  const { data2, size } = useSWRInfinite(getKey, fetcher);
  console.log(data2); */
  return (
    // render data

    /* <Flex
      bg={useColorModeValue("#F9FAFB", "gray.600")}
      p={10}
      w="full"
      alignItems="center"
      justifyContent="center"
    >
      <Grid templateColumns="repeat(5, 1fr)" gap={1}>
        {data.data.movies.map((movies) => (
          <Image
            key={movies.id}
            src={movies.medium_cover_image}
            width={230}
            height={345}
          />
          //<li>{movies.title}</li>
        ))}
      </Grid>
    </Flex> */

    <Wrap
      spacing="5px"
      justify="center"
      w="full"
      p={30}
      bg={useColorModeValue("#F9FAFB", "gray.600")}
    >
      {data.data.movies.map((movies) => (
        <WrapItem>
          <Image
            key={movies.id}
            src={movies.medium_cover_image}
            width={230}
            height={345}
          />
        </WrapItem>
        //<li>{movies.title}</li>
      ))}
    </Wrap>
  );
}
