const fs = require("fs");
var torrentStream = require("torrent-stream");
var path = require("path");

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

  var pathing = path.join(__dirname + "/temp");
  var options = { path: pathing };
  console.log("path: ", pathing);

  var engine = torrentStream(
    "magnet:?xt=urn:btih:E269478A44A9E8C27A9084B86191EC7BB2A5ECD8&tr=udp://tracker.opentrackr.org:1337&tr=udp://tracker.tiny-vps.com:6969&tr=udp://tracker.openbittorrent.com:1337&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://p4p.arenabg.com:1337&tr=udp://tracker.internetwarriors.net:1337&tr=udp://9.rarbg.to:2710&tr=udp://9.rarbg.me:2710&tr=udp://exodus.desync.com:6969&tr=udp://tracker.cyberia.is:6969&tr=udp://tracker.torrent.eu.org:451&tr=udp://open.stealth.si:80&tr=udp://tracker.moeking.me:6969&tr=udp://tracker.zerobytes.xyz:1337"
  );

  engine.on("ready", function () {
    console.log("ready");
    engine.files.forEach(function (file) {
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
    });
  });
});

export default handler; */

export default async function handler(req, res) {
  // Ensure there is a range given for the video
  if (req.method === "GET") {
    var range = req.headers.range;

    // get video stats (about 61MB)
    //const videoPath = "bigbuck.mp4";
    //const videoSize = fs.statSync("bigbuck.mp4").size;

    var pathing = path.join(__dirname + "/temp");
    var options = { path: pathing };
    console.log("path: ", pathing);

    var engine = torrentStream(
      "magnet:?xt=urn:btih:7D962EC9137989D19E346D7E68946E88D41FE991&amp;dn=Venom.Let.There.Be.Carnage.2021.1080p.AMZN.WEBRip.DDP5.1.x264-alfaHD&amp;tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&amp;tr=udp%3A%2F%2F9.rarbg.me%3A2820%2Fannounce&amp;tr=udp%3A%2F%2F9.rarbg.to%3A2910%2Fannounce&amp;tr=udp%3A%2F%2Ftracker.thinelephant.org%3A12770%2Fannounce&amp;tr=udp%3A%2F%2Ftracker.fatkhoala.org%3A13790%2Fannounce&amp;tr=udp%3A%2F%2Ftracker.zer0day.to%3A1337%2Fannounce&amp;tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&amp;tr=udp%3A%2F%2Fcoppersurfer.tk%3A6969%2Fannounce"
    );

    engine.on("ready", function () {
      console.log("ready");
      engine.files.forEach(function (file) {
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
      });
    });
  }

  // stream is readable stream to contai
}
