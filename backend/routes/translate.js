const express = require("express");
const router = express.Router();

const { translate, storage, tts, stt } = require("../gcp/index");

function getRouter() {
  router.post("/", async (req, res) => {
    // console.log(req.body);
    
    const { input, lang } = req.body;
    const [translation] = await translate.translate(input, lang);

    console.log(`text: ${input}, language: ${lang}, translation: ${translation}`)

    res.json({ output: translation});
  });
  
  return router;
}

module.exports = getRouter;