import { getSession } from "next-auth/react";
import prisma from "../../../prisma/db";

import Joi from "joi";

const schema = Joi.object({
  firstName: Joi.string().min(1).max(100).required(),
  lastName: Joi.string().min(1).max(100).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
});

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(403).json({ error: "You must sign in" });
  } else {
    if (req.method === "PATCH") {
      const { firstName, lastName, username, email } = req.body;
      const result = await prisma.user.findFirst({
        where: {
          id: session.id,
        },
      });
      if (!result) {
        return res.status(400).json({
          success: false,
          error: "User not found",
        });
      } else {
        const checkIfUserExists = await prisma.user.findFirst({
          where: {
            OR: [{ username: username }, { email: email }],
            NOT: { id: session.id },
          },
        });
        if (checkIfUserExists) {
          return res.status(400).json({
            success: false,
            error: "User already exists",
          });
        }
        const user = await prisma.user.update({
          where: { id: session.id },
          data: {
            firstName: firstName,
            lastName: lastName,
            name: firstName + " " + lastName,
            username: username,
            email: email,
          },
        });
      }
      res.status(200).json({ success: true });
    } else if (req.method === "GET") {
      const result = await prisma.user.findFirst({
        where: {
          id: req.query.id,
        },
        select: {
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          image: true,
          password: false,
        },
      });
      if (!result) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }
      res.status(200).json({ success: true, content: result });
    } else {
      res.status(405).json({ message: "METHOD NOT ALLOWED" });
    }
  }
}
