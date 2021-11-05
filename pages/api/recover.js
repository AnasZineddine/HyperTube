const crypto = require("crypto");
import { PrismaClient } from "@prisma/client";
import set from "date-fns/set";

const prisma = new PrismaClient();

//TODO: validate data on register route also

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { emailToRecover } = req.body;
    try {
      const result = await prisma.user.findFirst({
        where: {
          email: emailToRecover,
        },
      });
      if (!result) {
        return res.status(400).json({
          success: false,
          error: "This email address is not associated with any account",
        });
      } else {
        const user = await prisma.user.update({
          where: { email: emailToRecover },
          data: {
            resetPasswordToken: crypto.randomBytes(20).toString("hex"),
            resetPasswordExpires: set(Date.now(), { hours: 1 }),
          },
        });
        console.log(user);
        return res.status(200).json({ success: true }); //TODO: check status to return 201 for succesful creation
        //TODO:Send email
      }
      console.log({ result });
    } catch (e) {
      res.send(
        JSON.stringify({
          status: 500,
          error: "In recover " + e,
          response: null,
        })
      );
    }
  } else {
    res.status(405).json({ message: "POST METHOD ONLY" });
  }
}
