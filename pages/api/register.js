// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../prisma/db";
const argon2 = require("argon2");
const { sendConfirmationEmail } = require("../../services/emailService");

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
      console.log({ result });
      //TODO: return error more descriptiice here below
      if (result) {
        return res
          .status(400)
          .json({ success: false, error: "User already exists" });
      }
      const user = await prisma.user.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          name: firstName + " " + lastName,
          username: username,
          email: email,
          password: await argon2.hash(password),
        },
      });
      sendConfirmationEmail(user, "sdfsdfsdf");
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
