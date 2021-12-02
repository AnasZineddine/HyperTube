import fetch from "unfetch";
import useSWR from "swr";
import Image from "next/image";
import { useColorModeValue, Wrap, WrapItem, Button } from "@chakra-ui/react";
import useSWRInfinite from "swr/infinite";
import { Progress } from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter } from "next/router";

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
    console.log("previousPageData", previousPageData);
    if (
      previousPageData &&
      previousPageData.data.movie_count / previousPageData.data.limit <=
        previousPageData.data.page_number
    )
      return null; // reached the end
    return `https://yts.mx/api/v2/list_movies.json?page=${pageIndex}&sort_by=download_count&limit=35&query_term=bat`; // SWR key
  };
  const router = useRouter();
  const {
    data: paginatedData,
    size,
    setSize,
  } = useSWRInfinite(getKey, fetcher);
  const color = useColorModeValue("#F9FAFB", "gray.600");
  if (!paginatedData) return "loading";
  console.log(paginatedData);

  return (
    <InfiniteScroll
      next={() => setSize(size + 1)}
      dataLength={paginatedData.length}
      hasMore={true}
      loader={<h1>loading ...</h1>}
    >
      <Wrap spacing="5px" justify="center" w="full" p={30} bg={color}>
        {paginatedData.map((data) =>
          data.data.movies.map((movies) => (
            <WrapItem key={movies.id}>
              <Button //as={Button}
                //rounded={"full"}
                variant={"link"}
                //cursor={"pointer"}
                minW={0}
                onClick={() => router.push(`/movies/${movies.id}`)}
              >
                <Image // TODO: see next/image docs for loading}
                  alt="movies picture"
                  key={movies.id}
                  src={movies.medium_cover_image}
                  width={230}
                  height={345}
                />
              </Button>
            </WrapItem>
          ))
        )}
      </Wrap>
    </InfiniteScroll>
  );
}
