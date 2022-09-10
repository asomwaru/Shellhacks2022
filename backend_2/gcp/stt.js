// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

// Creates a client
const stt = new speech.SpeechClient({
  projectId: 'shell-hacks-2022',
  keyFilename: '.ignore/shell-hacks-2022-181a9f806470.json'
});

module.exports = stt;