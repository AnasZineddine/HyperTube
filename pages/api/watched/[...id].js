import prisma from "../../../prisma/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const movieId = req.query.id[0];
    console.log(movieId);
    if (!movieId.includes("-1111")) {
      const checkWatched = await prisma.movie.findFirst({
        where: {
          apiId: movieId,
          watched: true,
        },
      });

      if (checkWatched) {
        return res.status(200).json({ watched: true });
      } else {
        return res.status(200).json({ watched: false });
      }
    } else {
      const correctId = movieId.replace("-1111", "");
      const checkWatched = await prisma.movie.findFirst({
        where: {
          apiId: correctId,
          watched: true,
        },
      });

      if (checkWatched) {
        return res.status(200).json({ watched: true });
      } else {
        return res.status(200).json({ watched: false });
      }
    }
  }
}
