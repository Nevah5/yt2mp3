# About
This is a small project with the [youtube-mp3-downloader](https://www.npmjs.com/package/youtube-mp3-downloader) npm module. It can download youtube videos and converts them to mp3. The good thing is, that this works for multiple links at once and is faster than other open source web applications.

# Installation
1. rename `.env` to `.env.example`
2. run `npm install`
3. run `npm install -g ffmpeg-static`
4. replace `USER_HERE` in the `FFMPEG_PATH` variable in `.env` with your windows user
5. make sure the path is correct

### Important!
- Do **not** add a "/" after the folder name in the `OUTPUT_PATH` variable, if you change it.