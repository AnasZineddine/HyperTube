const yifysubtitles = require("yifysubtitles");
import fs from "fs";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const movieId = req.query.id[0];
    console.log(movieId);
    const results = await yifysubtitles(movieId, {
      path: "/tmp",
      langs: ["en", "fr"],
    });
    res.writeHead(200, {
      "Content-Type": "text/vtt",
    });
    console.log(results);
    if (typeof results !== "undefined" && results.length !== 0) {
      // the array is defined and has no elements
      var readStream = fs.createReadStream(results[0].path);
      readStream.pipe(res);
    }
  }
}
