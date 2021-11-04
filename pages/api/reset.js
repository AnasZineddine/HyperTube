const crypto = require("crypto");
import { PrismaClient } from "@prisma/client";
import set from "date-fns/set";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log(req);
    try {
      const result = await prisma.user.findFirst({
        where: {
          resetPasswordToken: "asdasd",
          resetPasswordExpires: { gt: set(Date.now()) },
        },
      });

      if (!result)
        return res
          .status(401)
          .json({ message: "Password reset token is invalid or has expired." });
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
