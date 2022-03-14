import fetch from "unfetch";

import { Spinner } from "@chakra-ui/react";

import Image from "next/image";

import {
  useColorModeValue,
  Wrap,
  WrapItem,
  Button,
  Stack,
  Flex,
  Center,
} from "@chakra-ui/react";
import useSWRInfinite from "swr/infinite";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter } from "next/router";
//import { MdDeleteForever } from "react-icons/Md";

const fetcher1 = (url) => fetch(url).then((r) => r.json());
const fetcher2 = (url) => fetch(url).then((r) => r.json());

//TODO: fix infinite scroll loading a lot of data
//TODO: check for null img
export default function Movies() {
  const router = useRouter();
  console.log(router);

  let { keyword, genre, sort_by, order_by } = router.query;
  if (!keyword) {
    keyword = "";
  }
  if (!genre) {
    genre = "";
  }

  /**
   * TODO: fix sort for both sources
   * popcorn sort :  name , rating , released , trending , updated , year .
   * yts sort :  (title, year, rating, peers, seeds, download_count, like_count, date_added)
   * **/

  const color = useColorModeValue("#F9FAFB", "gray.600");
  const getKey1 = (pageIndex, previousPageData) => {
    pageIndex = pageIndex + 1;
    if (
      previousPageData &&
      previousPageData.data.movie_count / previousPageData.data.limit <=
        previousPageData.data.page_number
    )
      return null; // reached the end
    return `https://yts.mx/api/v2/list_movies.json?page=${pageIndex}&sort_by=download_count&order_by=${""}&limit=35&query_term=${keyword}&genre=${genre}`; // SWR key
  };

  const getKey2 = (pageIndex, previousPageData) => {
    pageIndex = pageIndex + 1;
    if (previousPageData && !previousPageData.length) return null; // reached the end
    return `http://popcorn-time.ga/movies/${pageIndex}?sort=${sort_by}&order=${order_by}&keywords=${keyword}&genre=${genre}`; // SWR key
  };
  const {
    data: paginatedData,
    error: error1,
    size,
    setSize,
  } = useSWRInfinite(getKey1, fetcher1);
  const {
    data: paginatedData2,
    error: error2,
    size: size2,
    setSize: setSize2,
  } = useSWRInfinite(getKey2, fetcher2);

  if (error1 || error2) return <div>failed to load</div>;
  if (!paginatedData2 || !paginatedData)
    return (
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    );
  console.log(paginatedData, paginatedData2);
  if (
    paginatedData[0].data.movies &&
    (paginatedData[0].data.movie_count !== 0 || paginatedData2[0].length !== 0)
  ) {
    return (
      <Stack bg={color}>
        <Flex justifyContent="center">
          {router.asPath !== "/" && (
            <Button
              // leftIcon={<MdDeleteForever size={"1.4em"} />}
              onClick={() => router.push("/")}
            >
              Clear all filters
            </Button>
          )}
        </Flex>

        <InfiniteScroll
          next={() => {
            setSize(size + 1);
            setSize2(size2 + 1);
          }}
          dataLength={paginatedData.length + paginatedData2.length}
          hasMore={true}
          //loader={} //TODO: do not display when reach end, or comment that shit :D
        >
          <Wrap spacing="5px" justify="center" w="full" p={30} bg={color}>
            {paginatedData2.length !== 0 &&
              paginatedData2.map((data) =>
                data.map(
                  (data) =>
                    data.images.banner && (
                      <WrapItem key={data._id}>
                        <Button //as={Button}
                          //rounded={"full"}
                          variant={"link"}
                          //cursor={"pointer"}
                          minW={0}
                          onClick={() => router.push(`/movie2/${data._id}`)}
                        >
                          <Image // TODO: see next/image docs for loading}
                            alt="Movie picture"
                            key={data._id}
                            src={data.images.banner}
                            width={230}
                            height={345}
                          />
                        </Button>
                      </WrapItem>
                    )
                )
              )}
            {/*TODO:uncomment this*/}
            {/* {paginatedData[0].data.movie_count !== 0 &&
              paginatedData.map((data) =>
                data.data.movies.map(
                  (movies) =>
                    movies.medium_cover_image && (
                      <WrapItem key={movies.id}>
                        <Button //as={Button}
                          //rounded={"full"}
                          variant={"link"}
                          //cursor={"pointer"}
                          minW={0}
                          onClick={() => router.push(`/movie1/${movies.id}`)}
                        >
                          <Image // TODO: see next/image docs for loading
                            alt="Movie picture"
                            key={movies.id}
                            src={movies.medium_cover_image}
                            width={230}
                            height={345}
                          />
                        </Button>
                      </WrapItem>
                    )
                )
              )} */}
          </Wrap>
        </InfiniteScroll>
      </Stack>
    );
  }
  //TODO: style this below
  else
    return (
      <Stack spacing={5}>
        {router.asPath !== "/" && (
          <Button
            leftIcon={<MdDeleteForever size={"1.4em"} />}
            onClick={() => router.push("/")}
          >
            Clear all filters
          </Button>
        )}
        <h2>Your search did not match any movie Suggestions:</h2>
        <ul>
          <li>Make sure that all words are spelled correctly.</li>
          <li>Try different keywords.</li>
          <li>Try more general keywords. Try fewer keywords.</li>
        </ul>
      </Stack>
    );
}
