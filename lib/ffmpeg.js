import ffmpeg from 'fluent-ffmpeg';

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

ffmpeg.setFfmpegPath(ffmpegPath);

const convertStreamToBase64Audio = streamFile => {
  return new Promise((resolve, reject) => {
    let stream = Buffer.alloc(0);
    ffmpeg(streamFile)
      .noVideo()
      .audioCodec('pcm_s16le')
      .audioFrequency(16000)
      .audioChannels(1)
      .format('wav')
      .on('progress', progress => {
        console.log(`[ffmpeg] ${JSON.stringify(progress)}`);
      })
      .pipe(stream, { end: true })
      .on('error', err => {
        console.error(`[ffmpeg] error: ${err.message}`);
        reject(err);
      })
      .on('data', chunk => {
        stream = Buffer.concat([stream, chunk]);
      })
      .on('end', () => {
        console.log('[ffmpeg] finished');
        // eslint-disable-next-line new-cap
        const base64File = new Buffer.from(stream, 'binary').toString('base64');
        resolve(base64File);
      });
  });
};

export { convertStreamToBase64Audio };
