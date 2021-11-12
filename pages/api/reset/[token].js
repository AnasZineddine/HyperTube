const crypto = require("crypto");

import set from "date-fns/set";
const argon2 = require("argon2");

import prisma from "../../../prisma/db";

//TODO:validate data input

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { password } = req.body;
    try {
      const result = await prisma.user.findFirst({
        where: {
          resetPasswordToken: req.query.token,
          resetPasswordExpires: {
            gt: set(Date.now(), { hours: 0 }), //TODO: check veracity of this
          },
        },
      });
      if (!result)
        return res
          .status(401)
          .json({ message: "Password reset token is invalid or has expired." });
      else {
        const user = await prisma.user.update({
          where: { email: result.email },
          data: {
            password: await argon2.hash(password),
            resetPasswordToken: null,
            resetPasswordExpires: null,
          },
        });
        console.log(user);
        return res.status(200).json({ success: true });
      }
    } catch (e) {
      res.send(
        JSON.stringify({
          status: 500,
          error: "In reset " + e,
          response: null,
        })
      );
    }
  } else {
    res.status(405).json({ message: "POST METHOD ONLY" });
  }
}
