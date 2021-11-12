const crypto = require("crypto");
import set from "date-fns/set";
const { sendResetEmail } = require("../../services/emailService");
import prisma from "../../prisma/db";

//TODO: validate data on register route also

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;
    try {
      const result = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      if (!result) {
        return res.status(400).json({
          success: false,
          error: "This email address is not associated with any account",
        });
      } else {
        const user = await prisma.user.update({
          where: { email: email },
          data: {
            resetPasswordToken: crypto.randomBytes(20).toString("hex"),
            resetPasswordExpires: set(Date.now(), { hours: 1 }),
          },
        });
        console.log(user);
        //TODO:Send email
        sendResetEmail(user);
        return res.status(200).json({ success: true }); //TODO: check status to return 201 for succesful creation
      }
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
