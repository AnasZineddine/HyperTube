var torrentStream = require("torrent-stream");
var path = require("path");
const axios = require("axios");
var ffmpeg = require("fluent-ffmpeg");

const yifysubtitles = require("yifysubtitles");

export default async function handler(req, res) {
  if (req.method === "GET") {
    const range = req.headers.range;
    var pathing = path.join(__dirname + "/temp");
    console.log(pathing);

    const movieId = req.query.id[0];
    /*  const results = await yifysubtitles(movieId, {
      path: "/tmp",
      langs: ["en", "fr"],
    });
    console.log(results); */

    //console.log(movieId);

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
          } /* else {
            
            ffmpeg()
              .input(stream)
              .outputOptions('-movflags frag_keyframe+empty_moov')
              .outputFormat('mp4')
              .on('start', () => {
                console.log('start')
              })
              .on('progress', (progress) => {
                console.log(`progress: ${progress.timemark}`)
              })
              .on('end', () => {
                console.log('Finished processing')
              })
              .on('error', (err) => {
                console.log(`ERROR: ${err.message}`)
              })
              .inputFormat(realExtension)
              .audioCodec('aac')
              .videoCodec('libx264')
              .pipe(res)
            res.on('close', () => {
              stream.destroy()
            })
          } */
          // stream is readable stream to containing the file content
        });
      });
    } catch (error) {
      console.error(error);
    }
  }
}

/* import nc from "next-connect";

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
}).get((req, res) => {
  var range = req.headers.range;

  // get video stats (about 61MB)
  //const videoPath = "bigbuck.mp4";
  //const videoSize = fs.statSync("bigbuck.mp4").size;

  console.log(range);

  var pathing = path.join(__dirname + "/temp");
  var options = { path: pathing };
  console.log("path: ", pathing);

  var engine = torrentStream(
    "magnet:?xt=urn:btih:E269478A44A9E8C27A9084B86191EC7BB2A5ECD8&tr=udp://tracker.opentrackr.org:1337&tr=udp://tracker.tiny-vps.com:6969&tr=udp://tracker.openbittorrent.com:1337&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://p4p.arenabg.com:1337&tr=udp://tracker.internetwarriors.net:1337&tr=udp://9.rarbg.to:2710&tr=udp://9.rarbg.me:2710&tr=udp://exodus.desync.com:6969&tr=udp://tracker.cyberia.is:6969&tr=udp://tracker.torrent.eu.org:451&tr=udp://open.stealth.si:80&tr=udp://tracker.moeking.me:6969&tr=udp://tracker.zerobytes.xyz:1337"
  );

  engine.on("ready", function () {
    console.log("ready");
    engine.files.forEach(function (file) {
      var extension = file.path
        .slice(((file.path.lastIndexOf(".") - 1) >>> 0) + 2)
        .toLowerCase();
      console.log(extension);
      if (extension === "mp4") {
        console.log("filename:", file.name);
        // console.log('filepath:', file.path);
        console.log("filelength/size:", file.length);

        // var keys = Object.keys(file);
        // console.log('stuff:', keys);
        let filePath = path.join(__dirname, "./temp/movie.mp4");

        // stream is readable stream to containing the file content
        // console.log(file);
        // res.writeHead(206);

        var total = file.length;

        var positions = range.replace(/bytes=/, "").split("-");
        var start = parseInt(positions[0], 10);
        var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        var chunksize = end - start + 1;
        res.writeHead(206, {
          "Content-Range": "bytes " + start + "-" + end + "/" + total,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "video/mp4",
        });

        var stream = file.createReadStream(filePath);
        stream.pipe(res);
      }
    });
  });
});

export default handler; */
