const crypto = require("crypto");
const passwordComplexity = require("joi-password-complexity");
import set from "date-fns/set";
const argon2 = require("argon2");
import validate from "../../middlewares/validation";

import prisma from "../../../prisma/db";
import Joi from "joi";

const complexityOptions = {
  min: 8,
  max: 30,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

const schema = Joi.object({
  password: passwordComplexity(complexityOptions).required(),
});

async function handler(req, res) {
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
    res.status(405).json({ message: "METHOD NOT ALLOWED" });
  }
}

export default validate({ body: schema }, handler);
