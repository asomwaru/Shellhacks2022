// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client using Application Default Credentials
const storage = new Storage({
  projectId: 'shell-hacks-2022',
  keyFilename: '.ignore/shell-hacks-2022-181a9f806470.json'
});

module.exports = storage;