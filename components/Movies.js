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
import {
  MdDeleteForever,
  MdSignalCellularConnectedNoInternet2Bar,
} from "react-icons/Md";

import { filterDeep } from "deepdash-es/standalone";
import { mutate } from "swr";

import { useEffect, useState } from "react";

const fetcher1 = (url) => fetch(url).then((r) => r.json());
const fetcher2 = (url) => fetch(url).then((r) => r.json());

//TODO: fix infinite scroll loading a lot of data
//TODO: check for null img
export default function Movies() {
  const router = useRouter();
  console.log(router);

  let { keyword, genre, sort_by, order_by, ratingGap, year_gap } = router.query;
  if (!keyword) {
    keyword = "";
  }

  if (!genre) {
    genre = "";
  }

  console.log("query", year_gap);

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
    mutate: mutate1,
  } = useSWRInfinite(getKey1, fetcher1);
  const {
    mutate: mutate2,
    data: paginatedData2,
    error: error2,
    size: size2,
    setSize: setSize2,
  } = useSWRInfinite(getKey2, fetcher2);

  if (year_gap) {
    const yearArray = year_gap.split(",").map(Number);
  }

  useEffect(() => {
    if (year_gap && paginatedData && paginatedData2) {
      const yearArray = year_gap.split(",").map(Number);
      console.log(yearArray);

      var filteredPaginatedDataFull = paginatedData.map((data) => {
        if (data) {
          return {
            ...data,
            data: {
              ...data.data,
              movies: data.data.movies.filter((movie) => {
                return movie.year <= yearArray[1] && movie.year >= yearArray[0];
              }),
            },
          };
        }
        return data;
      });

      var filteredPaginatedDataFull2 = paginatedData2.map((data) => {
        return data.filter((movie) => {
          return movie.year <= yearArray[1] && movie.year >= yearArray[0];
        });
      });

      console.log(
        { filteredPaginatedDataFull2 },
        { filteredPaginatedDataFull }
      );

      mutate1(filteredPaginatedDataFull, false);
      mutate2(filteredPaginatedDataFull2, false);
      // mutate1();
    } else {
      console.log(
        "year_gap ceased to exist in this absurd universe and it left behind a sad developper",
        year_gap
      );
      mutate1(paginatedData, true);
      mutate2(paginatedData2, true);
    }
  }, [year_gap, paginatedData, paginatedData2]);

  if (error1 || error2) return <div>failed to load</div>;
  if (!paginatedData2 || !paginatedData) {
    return (
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    );
  }

  /*if (year_gap) {
    const yearArray = year_gap.split(",").map(Number);

    var filteredPaginatedDataFull = paginatedData.map((data) => {
      if (data) {
        return {
          ...data,
          movies: data.data.movies.filter(
            (movie) => movie.year >= yearArray[0]
          ),
        };
      }
      return data;
    });
    console.log({ filteredPaginatedDataFull }, { paginatedData });
    mutate1(filteredPaginatedDataFull, false);
    // mutate1();

  }*/
  if (ratingGap) {
    const ratingArray = ratingGap.split(",").map(Number);
  }
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
              onClick={() => {
                router.push("/");
              }}
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
            {paginatedData[0].data.movie_count !== 0 &&
              paginatedData.map((data) =>
                data.data.movies.map((movies) => {
                  return (
                    movies.medium_cover_image && (
                      <WrapItem key={movies.id}>
                        <Button //as={Button}
                          //rounded={"full"}
                          variant={"link"}
                          //cursor={"pointer"}
                          minW={0}
                          onClick={() => {
                            router.push(`/movie1/${movies.id}-1111`);
                          }}
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
                  );
                })
              )}
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
