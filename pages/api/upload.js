import nextConnect from "next-connect";
import multer from "multer";
import fs from "fs";

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
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.array("theFiles"));

apiRoute.post((req, res) => {
  const filenames = fs.readdirSync(outputFolderName);
  const images = filenames.map((name) => name);

  res.status(200).json({ data: images });
});

export const config = {
  api: {
    bodyParser: false,
  },
};
export default apiRoute;
