// ===========================
/* GENERAL LOGIC

1. We take in an audio file from the user
2. The file is uploaded to a bucket so that Google Speech can access it directly
3. We use Google Speech to convert the GCS file to text (speech-to-text or stt)
4. We translate the transcript to the target language through the Google Translate API
5. We pass the translated text to Google TTS
6. We send the binary from TTS back to the user
7. Frontend should decide how the binary is utilized (play or download?)

*/
// ===========================

// TODO:
/*
- confirm that bucket uploads work correctly (fix the billing again alex)
- modular file types, sample frequencies, and encodings
- make objects die after a day in the bucket (manage object lifecycles)

KIND OF DONE?:
- send file back to frontend instead of saving locally
we get back a buffer and can download it. just have to play it on the browser instead

DONE:
- somehow get a file from the frontend to the backend which i completely forgot how to do
  - at the same time pass in a target language to translate to
*/

const uuidv4 = require("uuid");

const express = require("express");
const router = express.Router();

const { translate, stt, tts, storage } = require("../gcp/index");

// aux just in case we need it later
/*
async function createBucket() {
  // Creates the new bucket
  await storage.createBucket(bucketName);
  console.log(`Bucket ${bucketName} created.`);
}
*/

function getRouter() {
  router.post("/", async (req, res) => {
    // get file. pain in the ass but we'll figure it out
    // const file = req.body.file;
    
    // get target language
    console.log(req.files.file);
    // we can use req.files.file.encoding to get the encoding for the file
    // might allow for modular encoding
    // worst comes to worst we only allow mp3
    
    const target = req.body.lang;
    
    // upload file to gcs. needs to be tested
    /*
    const bucketName = 'audio-files';
    const filePath = process.cwd() + '/gcp/test.txt';
    const destFileName = uuidv4();
    const generationMatchPrecondition = 0;
    
    async function uploadFile() {
      TODO set TTL
      const options = {
        destination: destFileName,
        preconditionOpts: {ifGenerationMatch: generationMatchPrecondition},
      };

      await storage.bucket(bucketName).upload(filePath, options);
    }
    await uploadFile();
    */
    
    // run stt to get text
    // TODO: make frequency and encoding modular
    // Also need to test this vvvvv
    // const gcsUri = 'gs://audio-files/destFileName';
    const gcsUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
      uri: gcsUri,
    };
    const config = {
      // TODO: make modular
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    };
    let request = {
      audio: audio,
      config: config,
    };
  
    // Detects speech in the audio file
    let [response] = await stt.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    // run translations on transcript
    const [translation] = await translate.translate(transcription, target);

    // create tts output from translation
    request = {
      input: {text: translation},
      voice: {languageCode: target, ssmlGender: 'NEUTRAL'},
      // select the type of audio encoding. mp3 works so why not
      audioConfig: {audioEncoding: 'MP3'},
    };
  
    // Performs the text-to-speech request
    [response] = await tts.synthesizeSpeech(request);
    
    // Write the binary audio content to a local file
    // uncomment if we want to do this for some reason
    // const fs = require('fs');
    // const util = require('util');
    // const writeFile = util.promisify(fs.writeFile);
    // await writeFile('output.mp3', response.audioContent, 'binary');


    // send back binary data
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-disposition': 'attachment;filename=' + 'output.mp3',
      'Content-Length': response.audioContent.length
    });
    res.end(Buffer.from(response.audioContent, 'binary'));
  });
  
  return router;
}

module.exports = getRouter;