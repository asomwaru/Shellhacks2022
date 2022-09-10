const express = require("express");
const router = express.Router();

const { translate } = require("../gcp/translate");

function getRouter() {
  router.post("/", async (req, res) => {
    // The text to translate
    const text = 'Привет, мир!';
  
    // The target language
    const target = 'en';
  
    // Translates some text into Russian
    const [translation] = await translate.translate(text, target);

    res.send(`text: ${text}, language: ${target}, translation: ${translation}`);
  });
  
  return router;
}

module.exports = getRouter;