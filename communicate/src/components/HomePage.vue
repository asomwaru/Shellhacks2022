<template>
  <div class="full">
    <div class="half blue">
      <div class="flex">
        <v-select :items="languages" label="Language" id="l1"></v-select>
      </div>
    </div>
    <div class="half">
      <div class="flex">
        <v-select :items="languages" label="Language" id="l2"></v-select>
      </div>
    </div>
    
    <button @click="toggleRecord" class="recorder" id="button"></button>
  </div>
</template>

<script>
// import { ref } from 'vue';

export default {
  name: 'HomePage',
  setup() {
    let ready = false;
    let recording = false;
    let turn = true;
    let mediaRecorder;
    let audioChunks = [];
    
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        ready = true;
        mediaRecorder = new MediaRecorder(stream);
       
        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });
        
        let l1 = document.getElementById("l1");
        let l2 = document.getElementById("l2");
        // console.log(l1.value, l2.value)
        
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks, { 'type': 'audio/mp3' });
          const formData = new FormData();
          formData.append('file', audioBlob)
          formData.append('fromLang', turn ? l1.value : l2.value);
          formData.append('target', turn ? l2.value : l1.value);
          fetch('http://localhost:8081/translate/stts', {
            method: 'POST',
            body: formData
          }).then(async (res) => {
            const url = window.URL.createObjectURL(await res.blob());
            new Audio(url).play()
          });
          turn = !turn;
        });
      });
    
    const toggleRecord = () => {
      if (ready) {
        recording = !recording;
        document.getElementById("button").classList.toggle('square');
        if (recording) {
          audioChunks = [];
          mediaRecorder.start();
        } else {
          mediaRecorder.stop();
        }
      }
    }


    let languages = [
      "af",
      "ar",
      "bn",
      "bg",
      "ca",
      "yue",
      "cs",
      "da",
      "nl",
      "en",
      "fil",
      "fi",
      "fr",
      "de",
      "el",
      "gu",
      "hi",
      "hu",
      "is",
      "id",
      "it",
      "ja",
      "kn",
      "ko",
      "lv",
      "ms",
      "ml",
      "cmn",
      "nb",
      "pl",
      "pt",
      "pa",
      "ro",
      "ru",
      "sr",
      "sk",
      "es",
      "sv",
      "ta",
      "te",
      "th",
      "tr",
      "uk",
      "vi"
    ];
    return { languages, toggleRecord };
  },
  // mounted() {
    // let rec = document.createElement('script')
    // rec.setAttribute('src', 'https://cdn.rawgit.com/mattdiamond/Recorderjs/08e7abd9/dist/recorder.js')
    // document.head.appendChild(rec)
  // },

}
</script>

<style scoped>
.full {
  width: 100%;
  height: 100%;
  background: #E09F3E;
  color: white;
}

.half {
  display: inline-block;
  width: 50vw;
  height: 100vh;
}

.blue {
  background: #335C67;
}

.v-input {
  margin: 0 40%;
  /*display: inline;*/
}

.flex {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.recorder {
  background: #9E2A2B;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: absolute;
  bottom: 100px;
  left: 50%;
  z-index: 2;
  border: 5px solid white;
  transform: translate(-50%);
  transition: border-radius .5s;
}

.square {
  border-radius: 10px !important;
}
</style>
