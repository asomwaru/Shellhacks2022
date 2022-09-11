const express = require("express");
const router = express.Router();

function getRouter() {
  router.get("/", async (req, res) => {
    
    const projectId = 'shell-hacks-2022';
    
    // Imports the Google Cloud client library
    const {Translate} = require('@google-cloud/translate').v2;
    
    // Instantiates a client
    const translate = new Translate({projectId});
    
    // The text to translate
    const text = 'Hello, world!';
  
    // The target language
    const target = 'ru';
  
    // Translates some text into Russian
    const [translation] = await translate.translate(text, target);

    res.send(`text: ${text}, language: ${target}, translation: ${translation}`);
  });
  
  return router;
}

module.exports = getRouter;