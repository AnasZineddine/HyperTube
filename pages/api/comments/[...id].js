import { getSession } from "next-auth/react";
import prisma from "../../../prisma/db";
import Joi from "joi";
import validate from "../../middlewares/validation";

/* const schema = Joi.object({
  body: Joi.string().min(1).max(1000).required(),
}); */

const schema = Joi.when(Joi.ref("$method"), {
  is: "POST",
  then: Joi.object().keys({
    body: Joi.string().min(1).max(1000).required(),
  }),
  /* "otherwise": Joi.object().keys({
    "id": Joi.string().forbidden(),
    "name": Joi.string()
  }) */
});

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(403).json({ error: "You must sign in" });
  }

  if (req.method === "POST") {
    const { body } = req.body;
    const movieId = req.query.id[0];

    const checkExisting = await prisma.movie.findFirst({
      where: {
        apiId: movieId,
      },
    });

    if (!checkExisting) {
      const cmt = await prisma.movie.create({
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
      res.status(200).json({ success: true, content: cmt });
    } else {
      const cmt = await prisma.movie.update({
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
      res.status(200).json({ success: true, content: cmt });
    }
  } else if (req.method === "GET") {
    const movieId = req.query.id[0];

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
                id: true,
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
  } else if (req.method === "DELETE") {
    //TODO:
    const commentId = parseInt(req.query.id[1], 10);
    const movieId = req.query.id[0];
    const checkExisting = await prisma.movie.findFirst({
      where: {
        apiId: movieId,
        comments: {
          some: {
            id: {
              equals: commentId,
            },
          },
        },
      },
    });
    if (!checkExisting) {
      return res.status(404).json({
        success: false,
        error: "Comment not found",
      });
    } else {
      await prisma.comment.delete({
        where: {
          id: commentId,
        },
      });
    }
    res.status(200).json({ success: true });
  } else res.status(405).json({ message: "METHOD NOT ALLOWED" });
}
