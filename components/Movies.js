import fetch from "unfetch";

import Image from "next/image";
import {
  useColorModeValue,
  Wrap,
  WrapItem,
  Button,
  Stack,
} from "@chakra-ui/react";
import useSWRInfinite from "swr/infinite";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter } from "next/router";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Movies() {
  const getKey = (pageIndex, previousPageData) => {
    pageIndex = pageIndex + 1;
    if (
      previousPageData &&
      previousPageData.data.movie_count / previousPageData.data.limit <=
        previousPageData.data.page_number
    )
      return null; // reached the end
    return `https://yts.mx/api/v2/list_movies.json?page=${pageIndex}&sort_by=download_count&limit=35&query_term=&genre=`; // SWR key
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

  if (paginatedData[0].data.movie_count !== 0) {
    return (
      <Stack>
        <InfiniteScroll
          next={() => setSize(size + 1)}
          dataLength={paginatedData.length}
          hasMore={true}
          //loader={<h1>loading ...</h1>} //TODO: do not display when reach end, or comment that shit :D
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
                      alt="Movie picture"
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
      </Stack>
    );
  } else
    return (
      <>
        <h2>Your search did not match any movie Suggestions:</h2>

        <ul>
          <li>Make sure that all words are spelled correctly.</li>
          <li>Try different keywords.</li>
          <li>Try more general keywords. Try fewer keywords.</li>
        </ul>
      </>
    );
}
