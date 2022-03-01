const fs = require('fs');
const { log } = require("console");
require("dotenv").config();
const urlRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;

const file = fs.readFileSync('input.txt').toString();
const link = file.replace(/\r\n/g, '\n').split("\n");

var YoutubeMp3Downloader = require("youtube-mp3-downloader");
var YD = new YoutubeMp3Downloader({
  "ffmpegPath": process.env.FFMPEG_PATH,
  "outputPath": process.env.OUTPUT_PATH,
  "youtubeVideoQuality": "highestaudio",
  "queueParallelism": 2,
  "progressTimeout": 2000,
  "allowWebm": false
});

const downloadPromise = (ytID, index) => {
  return new Promise((resolve, reject) => {
    YD.download(ytID, (index+1)+".mp3");
    YD.on("finished", (err, data) => {
      resolve(data);
    });
  });
}

const finishedDownload = async (links) => {
  var downloads = 0;
  return new Promise(async (resolve, reject) => {
    for (i = 0; i < links.length; i++){
      if(urlRegex.test(links[i])){
        const ytID = urlRegex.exec(links[i])[6];
        await downloadPromise(ytID, i).then(data => {
          if(typeof data == "object"){
            let fileName = `${i+1} - ${data.videoTitle}.mp3`;
            fs.renameSync(`${process.env.OUTPUT_PATH}/${i+1}.mp3`, `${process.env.OUTPUT_PATH}/${fileName}`);
            log(`\✅ Finished Downloading "${data.videoTitle}"!`);
          }
        });
        downloads++;
      }else{
        log(`\❌ "${links[i]}" is not a valid YouTube link!`);
      }
    }
    resolve(downloads);
  });
}

// ---- MAIN ---- \\
log("Download of all videos started...\n");

finishedDownload(links)
.then((downloads) => {
  log(`\n\nFinished downloading ${downloads} YouTube videos.`);
});
