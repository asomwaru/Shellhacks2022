const express = require("express");
const router = express.Router();

const { translate } = require("../gcp/translate");

function getRouter() {
  router.get("/", async (req, res) => {
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