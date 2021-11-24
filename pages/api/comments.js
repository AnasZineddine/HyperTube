import { getSession } from "next-auth/react";
import prisma from "../../prisma/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    /*  const session = await getSession({ req });
    if (!session) {
      res.status(403).json({ error: "You must sign in" });
    } */
    const { username, body, movieId } = req.body;

    const checkExisting = await prisma.movie.findFirst({
      where: {
        apiId: movieId,
      },
    });

    if (!checkExisting) {
      const movie = await prisma.movie.create({
        data: {
          apiId: movieId,
          comments: {
            create: [
              {
                username: username,
                body: body,
              },
            ],
          },
        },
      });
      console.log(movie);
    }
    res.status(200).json({ success: true });
  } else res.status(405).json({ message: "METHOD NOT ALLOWED" });
}
