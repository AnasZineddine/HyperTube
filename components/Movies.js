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

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Movies() {
  /* const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data, error } = useSWR(
    "https://yts.mx/api/v2/list_movies.json?sort_by=rating&limit=50",
    fetcher
    );
    const color = useColorModeValue("#F9FAFB", "gray.600");
    if (error) return <div>failed to load</div>;
    if (!data) return <div>Loading...</div>;
    console.log(data);
    return (
      <Wrap spacing="5px" justify="center" w="full" p={30} bg={color}>
      {data.data.movies.map((movies) => (
        <WrapItem key={movies.id}>
          <Image
          key={movies.id}
            src={movies.medium_cover_image}
            width={230}
            height={345}
            />
        </WrapItem>
        ))}
        </Wrap>
        ); */

  const getKey = (pageIndex, previousPageData) => {
    pageIndex = pageIndex + 1;
    if (previousPageData && !previousPageData.length) return null; // reached the end
    return `https://yts.mx/api/v2/list_movies.json?page=${pageIndex}&sort_by=rating&limit=50`; // SWR key
  };
  const {
    data: paginatedData,
    size,
    setSize,
  } = useSWRInfinite(getKey, fetcher);
  const color = useColorModeValue("#F9FAFB", "gray.600");
  if (!paginatedData) return "loading";
  console.log({ paginatedData, size });

  /* return (
    <Wrap spacing="5px" justify="center" w="full" p={30} bg={color}>
      {data.movies.map((movies) => (
        <WrapItem key={movies.id}>
          <Image
            key={movies.id}
            src={movies.medium_cover_image}
            width={230}
            height={345}
          />
        </WrapItem>
      ))}
    </Wrap>
  ); */

  return <button onClick={() => setSize(size + 1)}>load more</button>;
}
