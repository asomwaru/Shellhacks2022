### How To Test
```
git clone https://github.com/asomwaru/Shellhacks2022
cd Shellhacks2022
git checkout backend
cd backend_2 && node index.js
```
You'll need a `json` identifier for the project. It needs to come from the GCP key manager.
Place it inside `backend_2/.ignore/` and name it `shell-hacks-2022-181a9f806470.json`.
Then head to `localhost:8080/test.html`, feed any file and a target language (es, en, ru, it, ...)
Hit submit and play the downloaded file. It's only the test file given by GCP since the billing keeps messing up
##### What we need from the user:
1. Audio file
2. Target language

(see /backend_2/public/test.html and /backend_2/public/test.html for example usage)

##### Process:
1. We take in an audio file from the user
2. The file is uploaded to a bucket so that Google Speech can access it directly
3. We use Google Speech to convert the GCS file to text (speech-to-text or stt)
4. We translate the transcript to the target language through the Google Translate API
5. We pass the translated text to Google TTS
6. We send the binary from TTS back to the user
7. Frontend should decide how the binary is utilized (play or download?)

##### Why this is good:
1. extremely reusable API that can ease bilingual conversations
2. near-realtime translations through efficient use of GCP APIs
3. separates us from google translate quite a bit
4. nearly limitless scalability with miniscule amounts of code (~400 lines total)

##### Some possible use cases:
1. emergency service calls (i.e. 911 operators) with multiple languages being spoken
2. ease connectivity between different cultures due to decreased linguistic barriers
3. provide learning opportunities through very rapid translation
