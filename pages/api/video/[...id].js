var torrentStream = require("torrent-stream");
var path = require("path");
const axios = require("axios");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

const yifysubtitles = require("yifysubtitles");

export default async function handler(req, res) {
  if (req.method === "GET") {
    const movieId = req.query.id[0];
    if (!movieId.includes("-1111")) {
      const range = req.headers.range;
      var pathing = path.join(__dirname + "/temp");
      console.log(pathing);

      console.log(req.query);
      /*  const results = await yifysubtitles(movieId, {
        path: "/tmp",
        langs: ["en", "fr"],
      });
      console.log(results); */

      try {
        const response = await axios.get(
          `http://popcorn-time.ga/movie/${movieId}`
        );
        var engine = torrentStream(response.data.torrents.en["1080p"]?.url, {
          path: "/Users/azineddi/goinfre/HyperTube/movies",
        });

        engine.on("ready", function () {
          engine.files.forEach(function (file) {
            var extension = file.path.split(".").pop();
            console.log(file.name);
            if (extension === "mp4") {
              //file.select(file.name);
              const fileSize = file.length;
              if (range) {
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                const chunksize = end - start + 1;
                const head = {
                  "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                  "Accept-Ranges": "bytes",
                  "Content-Length": chunksize,
                  "Content-Type": "video/mp4",
                };
                res.writeHead(206, head);
                console.log("Streaming===============>:", file.name);

                const s = file.createReadStream({ start, end });
                s.pipe(res);
                engine.on("idle", () => {
                  console.log("done");
                });
              }
            }
          });
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      const range = req.headers.range;
      var pathing = path.join(__dirname + "/temp");
      console.log(pathing);
      const correctId = movieId.replace("-1111", "");

      /*  const results = await yifysubtitles(movieId, {
        path: "/tmp",
        langs: ["en", "fr"],
      });
      console.log(results); */

      try {
        const response = await axios.get(
          `https://yts.mx/api/v2/movie_details.json?movie_id=${correctId}`
        );
        const theChosenOne = response.data.data.movie.torrents.filter((obj) => {
          return obj.quality === "1080p";
        });
        //console.log(theChosenOne[0]);
        var engine = torrentStream(
          `magnet:?xt=urn:btih:${theChosenOne[0].hash}&dn=${theChosenOne[0].url}&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337`,
          {
            path: "/Users/azineddi/goinfre/HyperTube/movies",
          }
        );

        engine.on("ready", function () {
          engine.files.forEach(function (file) {
            var extension = file.path.split(".").pop();
            console.log(file.name);
            if (extension === "mp4") {
              //file.select(file.name);
              const fileSize = file.length;
              if (range) {
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                const chunksize = end - start + 1;
                const head = {
                  "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                  "Accept-Ranges": "bytes",
                  "Content-Length": chunksize,
                  "Content-Type": "video/mp4",
                };
                res.writeHead(206, head);
                console.log("Streaming===============>:", file.name);

                const s = file.createReadStream({ start, end });
                s.pipe(res);
                engine.on("idle", () => {
                  console.log("done");
                });
              }
            }
          });
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
}
