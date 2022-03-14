import nextConnect from "next-connect";
import multer from "multer";
import { getSession } from "next-auth/react";

import fs from "fs";
import path from "path";
import prisma from "../../prisma/db";
import { ref } from "joi";

const oneMegabyteInBytes = 1000000;
const outputFolderName = "./public/uploads";

const upload = multer({
  limits: { fileSize: oneMegabyteInBytes * 2 },
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
  fileFilter: (req, file, cb) => {
    const acceptFile = ["image/jpeg", "image/png"].includes(file.mimetype);
    cb(null, acceptFile);
  },
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.json({ error: `${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single("TheFile"));

apiRoute.post(async (req, res) => {
  /*  const filenames = fs.readdirSync(outputFolderName);
  const images = filenames.map((name) => name);
  /* const user = await prisma.user.update({
    where: { id: session.id },
    data: {
      image:jkl
    },
  }); */

  // console.log(images);
  try {
    const session = await getSession({ req });
    if (!session) {
      res.status(403).json({ error: "You must sign in" });
    }
    if (!req.file) {
      res.status(200).json({ success: false, error: "Not Allowed" });
    } else {
      const user = await prisma.user.update({
        where: { id: session.id },
        data: {
          image: "http://localhost:3000/uploads/" + req.file.filename,
        },
      });
      console.log(req.file);
      res.status(200).json({ success: true, data: req.file.filename });
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).json({ error });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiRoute;
