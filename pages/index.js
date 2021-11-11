import fetch from "unfetch";
import useSWR from "swr";
import Image from "next/image";
import { Grid } from "@chakra-ui/react";
import useSWRInfinite from "swr/infinite";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Home() {
  const { data, error } = useSWR(
    "https://yts.mx/api/v2/list_movies.json?sort_by=rating&limit=50",
    fetcher
  );
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
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

    <Grid templateColumns="repeat(5, 1fr)" gap={0}>
      {data.data.movies.map((movies) => (
        <Image
          src={movies.medium_cover_image}
          width={230}
          height={345}
          key={movies.id}
        />
        //<li>{movies.title}</li>
      ))}
    </Grid>
  );
}
