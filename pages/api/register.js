// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
const argon2 = require("argon2");

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    /*     res.status(200).json({ success: "true" });
     */
    const { firstName, lastName, username, email, password } = req.body;
    try {
      // i can use findUnique with two... with the @@unique in schema
      // ref : https://github.com/prisma/prisma/discussions/5405
      const result = await prisma.user.findFirst({
        where: {
          OR: [{ username: username }, { email: email }],
        },
      });
      if (result) {
        return res
          .status(400)
          .json({ success: false, error: "User already exists" });
      }
      const user = await prisma.user.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          username: username,
          email: email,
          password: await argon2.hash(password),
        },
      });
      console.log(user);
      return res.status(200).json({ success: true });
    } catch (e) {
      res.send(
        JSON.stringify({
          status: 500,
          error: "In register " + e,
          response: null,
        })
      );
    }
  } else {
    res.status(405).json({ message: "POST METHOD ONLY" });
  }
}
