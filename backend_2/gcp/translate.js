const {Translate} = require('@google-cloud/translate').v2;

const translate = new Translate({
  projectId: 'shell-hacks-2022',
  keyFilename: '.ignore/shell-hacks-2022-181a9f806470.json'
});

module.exports = translate;