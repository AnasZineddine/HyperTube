import { getSession } from "next-auth/react";
import prisma from "../../../prisma/db";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(403).json({ error: "You must sign in" });
  }

  if (req.method === "POST") {
    const { username, body } = req.body;
    const movieId = req.query.id;

    const checkExisting = await prisma.movie.findFirst({
      where: {
        apiId: movieId,
      },
    });

    if (!checkExisting) {
      await prisma.movie.create({
        data: {
          apiId: movieId,
          comments: {
            create: [
              {
                authorId: session.id,
                body: body,
              },
            ],
          },
        },
      });
    } else {
      await prisma.movie.update({
        data: {
          comments: {
            create: [
              {
                authorId: session.id,
                body: body,
              },
            ],
          },
        },
        where: {
          id: checkExisting.id,
        },
      });
    }
    res.status(200).json({ success: true });
  } else if (req.method === "GET") {
    const movieId = req.query.id;

    const checkExisting = await prisma.movie.findFirst({
      where: {
        apiId: movieId,
      },
      include: {
        comments: {
          include: {
            author: {
              select: {
                image: true,
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    if (!checkExisting) {
      return res.status(404).json({
        success: false,
        error: "Comments for this movie not found",
      });
    } else {
      //console.log("comments", checkExisting.comments);
      res.status(200).json({ success: true, content: checkExisting });
    }
  } else res.status(405).json({ message: "METHOD NOT ALLOWED" });
}
