var torrentStream = require("torrent-stream");
var path = require("path");
const axios = require("axios");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

const yifysubtitles = require("yifysubtitles");
import prisma from "../../../prisma/db";
import fs from "fs";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const movieId = req.query.id[0];
    if (!movieId.includes("-1111")) {
      const range = req.headers.range;

      const checkDownloaded = await prisma.movie.findFirst({
        where: {
          apiId: movieId,
          downloaded: true,
        },
        select: {
          filename: true,
        },
      });
      if (checkDownloaded) {
        if (!range) {
          res.status(400).send("Requires Range header");
        }

        // get video stats (about 61MB)
        const videoPath =
          `/Users/azineddi/goinfre/HyperTube/movies/${movieId}/` +
          checkDownloaded.filename;
        const videoSize = fs.statSync(videoPath).size;

        // Parse Range
        // Example: "bytes=32324-"
        const CHUNK_SIZE = 10 ** 6; // 1MB
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

        // Create headers
        const contentLength = end - start + 1;
        const headers = {
          "Content-Range": `bytes ${start}-${end}/${videoSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": contentLength,
          "Content-Type": "video/mp4",
        };

        // HTTP Status 206 for Partial Content
        res.writeHead(206, headers);

        // create video read stream for this particular chunk
        const videoStream = fs.createReadStream(videoPath, { start, end });

        // Stream the video chunk to the client
        videoStream.pipe(res);
      } else {
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
            path: `/Users/azineddi/goinfre/HyperTube/movies/${movieId}`,
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

                  const stream = file.createReadStream({ start, end });
                  stream.pipe(res);
                  engine.on("idle", async () => {
                    console.log("doone");
                    console.log(file.path);
                    const checkExisting = await prisma.movie.findFirst({
                      where: {
                        apiId: movieId,
                      },
                    });

                    if (!checkExisting) {
                      await prisma.movie.create({
                        data: {
                          apiId: movieId,
                          downloaded: true,
                          filename: file.path,
                        },
                      });
                    }
                  });
                }
              }
            });
          });
        } catch (error) {
          console.error(error);
        }
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
            path: `/Users/azineddi/goinfre/HyperTube/movies/${correctId}`,
          }
        );

        engine.on("ready", function () {
          engine.files.forEach(function (file) {
            var extension = file.path.split(".").pop();
            console.log(file.name);
            if (extension === "mp4" || extension === "mkv") {
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
                const stream = file.createReadStream({ start, end });
                stream.pipe(res);
                engine.on("idle", async () => {
                  console.log("doone");
                  const checkExisting = await prisma.movie.findFirst({
                    where: {
                      apiId: correctId,
                    },
                  });

                  if (!checkExisting) {
                    await prisma.movie.create({
                      data: {
                        apiId: correctId,
                        downloaded: true,
                      },
                    });
                  }
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
