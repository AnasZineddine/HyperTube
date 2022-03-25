const yifysubtitles = require("yifysubtitles");
import fs from "fs";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const movieId = req.query.id[0];
    const locale = req.query.id[1];

    const results = await yifysubtitles(movieId, {
      path: "/tmp",
      langs: ["en", "fr", "ar"],
    });
    res.writeHead(200, {
      "Content-Type": "text/vtt",
    });
    console.log(results);
    const arabic = results.filter((obj) => {
      return obj.lang === "arabic";
    });
    const english = results.filter((obj) => {
      return obj.lang === "english";
    });
    const french = results.filter((obj) => {
      return obj.lang === "french";
    });

    if (locale === "en" && english[0] && english[0].path) {
      // the array is defined and has no elements
      var readStream = fs.createReadStream(english[0].path);
      readStream.pipe(res);
    } else if (locale === "fr" && french[0] && french[0].path) {
      // the array is defined and has no elements
      var readStream = fs.createReadStream(french[0].path);
      readStream.pipe(res);
    } else if (locale === "ar" && arabic[0] && arabic[0].path) {
      // the array is defined and has no elements
      var readStream = fs.createReadStream(arabic[0].path);
      readStream.pipe(res);
    }
  }
}
