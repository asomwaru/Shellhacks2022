// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Creates a client
const tts = new textToSpeech.TextToSpeechClient({
  projectId: 'shell-hacks-2022',
  keyFilename: '.ignore/shell-hacks-2022-181a9f806470.json'
});

module.exports = tts;