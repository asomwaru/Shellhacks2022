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
//=======

const { v4: uuidv4 } = require('uuid');

const express = require("express");
const router = express.Router();

const { translate, stt, tts, storage } = require("../gcp/index");

// aux just in case we need it later

// async function createBucket() {
//   // Creates the new bucket
//   await storage.createBucket(bucketName);
//   console.log(`Bucket ${bucketName} created.`);
// }
// createBucket();

function getRouter() {
  // converts speech to text
  router.post("/st", async (req, res) => {
    const { fromLang } = req.body;
    res.status(200).send(await getTranscript(from, req.files.file));
  });
  
  // converts speech to text and translates it
  router.post("/stt", async (req, res) => {
    const { fromLang, target } = req.body;
    const transcript = await getTranscript(from, req.files.file);
    res.status(200).send(await translateTranscript(transcript, target));
  });
  
  // converts speech to text, translates it, and brings back speech
  router.post("/stts", async (req, res) => {
    const { fromLang, target } = req.body;
    const transcript = await getTranscript(fromLang, req.files.file);
    // run translations on transcript
    const translation = await translateTranscript(transcript, target);

    
    // create tts output from translation
    const response = await toSpeech(translation, target);

    // send back binary data
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-disposition': 'attachment;filename=' + 'output.mp3',
      'Content-Length': response.audioContent.length
    });
    res.end(Buffer.from(response.audioContent, 'binary'));
  });
  
  // translates text
  router.post("/tt", async (req, res) => {
    const { target, transcript } = req.body;
    res.status(200).send(await translateTranscript(transcript, target));
  });
  
  // translates text and converts it to speech
  router.post("/tts", async (req, res) => {
    const { target, transcript } = req.body;
    const translation = await translateTranscript(transcript, target);
    const response = await toSpeech(translation, target);
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-disposition': 'attachment;filename=' + 'output.mp3',
      'Content-Length': response.audioContent.length
    });
    res.end(Buffer.from(response.audioContent, 'binary'));
  });
  
  //converts text to speech
  router.post("/ts", async (req, res) => {
    const { target, transcript } = req.body;
    const response = await toSpeech(translation, target);
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

async function getTranscript(fromLang, file) {
  // we can use req.files.file.encoding to get the encoding for the file
  // might allow for modular encoding
  // worst comes to worst we only allow mp3
  
  // upload file to gcs. needs to be tested
  
  const bucketName = 'audio-processing-files';
  const destFileName = uuidv4();
  const generationMatchPrecondition = 0;
  
  async function uploadFile() {
    // TODO set TTL
    const gcsFile = storage.bucket(bucketName).file(destFileName);
    await gcsFile.save(file.data);

  }
  await uploadFile();
  
  
  // run stt to get text
  // TODO: make frequency and encoding modular
  // Also need to test this vvvvv
  const gcsUri = 'gs://' + bucketName + '/' + destFileName;

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = { uri: gcsUri };
  // TODO: make modular
  const config = {
    encoding: 'LINEAR16',
    // sampleRateHertz: 16000,
    languageCode: fromLang,
  };
  let request = { audio: audio, config: config };

  // Detects speech in the audio file
  console.log("test")
  let [response] = await stt.recognize(request);
  console.log("2")
  return response.results.map(res => res.alternatives[0].transcript).join('\n');
}

async function translateTranscript(transcription, target) {
  return await translate.translate(transcription, target);
}

async function toSpeech(translation, target) {
  const request = {
    input: { text: translation },
    voice: { languageCode: target, ssmlGender: 'NEUTRAL' },
    // select the type of audio encoding. mp3 works so why not
    audioConfig: { audioEncoding: 'MP3' },
  };
  return (await tts.synthesizeSpeech(request))[0];
}