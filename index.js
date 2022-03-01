const path = "./output";

var YoutubeMp3Downloader = require("youtube-mp3-downloader");

var YD = new YoutubeMp3Downloader({
    "ffmpegPath": "C:/Users/Noah/AppData/Roaming/npm/node_modules/ffmpeg-static/ffmpeg.exe",
    "outputPath": path,
    "youtubeVideoQuality": "highestaudio",
    "queueParallelism": 2,
    "progressTimeout": 2000,
    "allowWebm": false
});

const urlRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
const fs = require('fs');
const { log } = require("console");

const file = fs.readFileSync('input.txt').toString();
const arr = file.replace(/\r\n/g, '\n').split("\n");

const downloadPromise = (ytID, index) => {
  return new Promise((resolve, reject) => {
    YD.download(ytID, (index+1)+".mp3");
    YD.on("finished", async (err, data) => {
      resolve(data);
    });
  });
}

const start = async (arr) => {
  for (i = 0; i < arr.length; i++){
    if(urlRegex.test(arr[i])){
      const ytID = urlRegex.exec(arr[i])[6];
      const data = await downloadPromise(ytID, i).then(data => {
        if(typeof data == "object"){
          let fileName = `${i+1} - ${data.videoTitle}.mp3`;
          fs.renameSync(`${path}/${i+1}.mp3`, `${path}/${fileName}`);
          log(`Finished Downloading "${data.videoTitle}"`);
        }
      });
    }else{
      log(`"${arr[i]}" is not a valid YouTube link!`);
    }
  }
}

start(arr);
