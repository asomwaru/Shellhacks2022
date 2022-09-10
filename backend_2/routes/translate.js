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

const { v4: uuidv4 } = require("uuid");

const express = require("express");
const router = express.Router();
const ffmpeg = require("ffmpeg");

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
  router.post("/st", async (req, res, next) => {
    const { fromLang } = req.body;

    if (!req.files) {
      return next(new Error("No file attached"));
    }

    res.status(200).send(await getTranscript(fromLang, req.files.file));
  });

  // converts speech to text and translates it
  router.post("/stt", async (req, res, next) => {
    const { fromLang, target } = req.body;

    if (!req.files) {
      return next(new Error("No file attached"));
    }

    const transcript = await getTranscript(fromLang, req.files.file);
    res.status(200).send(await translateTranscript(transcript, target));
  });

  // converts speech to text, translates it, and brings back speech
  router.post("/stts", async (req, res, next) => {
    const { fromLang, target } = req.body;

    if (!req.files) {
      return next(new Error("No file attached"));
    }

    const transcript = await getTranscript(fromLang, req.files.file);
    // run translations on transcript
    const translation = await translateTranscript(transcript, target);

    // create tts output from translation
    const response = await toSpeech(translation, target);

    // send back binary data
    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Content-disposition": "attachment;filename=" + "output.mp3",
      "Content-Length": response.audioContent.length,
    });
    res.end(Buffer.from(response.audioContent, "binary"));
  });

  // translates text
  router.post("/tt", async (req, res, next) => {
    const { target, transcript } = req.body;

    if (!target) {
      return next(new Error("No target language given"));
    }

    res.status(200).send(await translateTranscript(transcript, target));
  });

  // translates text and converts it to speech
  router.post("/tts", async (req, res, next) => {
    const { target, transcript } = req.body;

    if (!target) {
      return next(new Error("No target language given"));
    }

    const translation = await translateTranscript(transcript, target);
    const response = await toSpeech(translation, target);
    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Content-disposition": "attachment;filename=" + "output.mp3",
      "Content-Length": response.audioContent.length,
    });
    res.end(Buffer.from(response.audioContent, "binary"));
  });

  //converts text to speech
  router.post("/ts", async (req, res, next) => {
    const { target, transcript } = req.body;

    if (!transcript) {
      return next(new Error("No transcript given"));
    }

    const response = await toSpeech(transcript, target);
    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Content-disposition": "attachment;filename=" + "output.mp3",
      "Content-Length": response.audioContent.length,
    });
    res.end(Buffer.from(response.audioContent, "binary"));
  });

  return router;
}

module.exports = getRouter;

const fs = require("fs").promises;

async function getTranscript(fromLang, file) {
  // we can use req.files.file.encoding to get the encoding for the file
  // might allow for modular encoding
  // worst comes to worst we only allow mp3

  // upload file to gcs. needs to be tested

  let data;

  if (file.name === "blob") {
    try {
      const uuid = uuidv4();
      await fs.writeFile("./" + uuid + ".mp3", file.data);
      await fs.readFile("./" + uuid + ".mp3");
      let process = await new ffmpeg("./" + uuid + ".mp3");

      await new Promise((resolve, reject) => {
        try {
          resolve(process.fnExtractSoundToMP3("./" + uuid + "_new.mp3"));
        } catch (err) {
          reject(err);
        }
      });
      let d = await fs.readFile("./" + uuid + "_new.mp3");
      data = d;
      fs.unlink("./" + uuid + "_new.mp3", () => {});
      fs.unlink("./" + uuid + ".mp3", () => {});
    } catch (e) {
      console.log(e);
    }
  }

  const bucketName = "audio-processing-files";
  const destFileName = uuidv4();
  const generationMatchPrecondition = 0;

  async function uploadFile() {
    // TODO: set TTL
    const gcsFile = storage.bucket(bucketName).file(destFileName);
    await gcsFile.save(data ?? file.data);
  }
  await uploadFile();

  // run stt to get text
  // TODO: make frequency and encoding modular
  // Also need to test this vvvvv
  const gcsUri = "gs://" + bucketName + "/" + destFileName;

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = { uri: gcsUri };
  // TODO: make modular
  const config = {
    encoding: "mp3",
    sampleRateHertz: 16000,
    languageCode: fromLang,
  };
  let request = { audio: audio, config: config };

  // Detects speech in the audio file
  let [response] = await stt.recognize(request);
  let transcript = response.results
    .map((res) => res.alternatives[0].transcript)
    .join("\n");
  return transcript;
}

async function translateTranscript(transcription, target) {
  return await translate.translate(transcription, target);
}

async function toSpeech(translation, target) {
  console.log("translation:", translation[0]);
  const request = {
    input: { text: translation[0] },
    voice: { languageCode: target, ssmlGender: "NEUTRAL" },
    // select the type of audio encoding. mp3 works so why not
    audioConfig: { audioEncoding: "MP3" },
  };
  return (await tts.synthesizeSpeech(request))[0];
}
