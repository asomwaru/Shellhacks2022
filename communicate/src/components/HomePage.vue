<template>
  <div class="full">
    <p class="title" :class="turn ? 'gray' : ''">Gibbri.sh</p>
    <p class="large left" :class="turn ? 'gray' : ''">Tran</p>
    <p class="large right" :class="!turn ? 'gray' : ''">slate</p>
    <div class="half blue" :class="!turn ? 'gray' : ''">
      <div class="flex">
        <div class="wrapper left">
          <v-select v-model="l1.label" :items="langs" label="Language" id="l1" />
          <p id="o1">{{ o1 }}</p>
        </div>
      </div>
    </div>
    <div class="half" :class="turn ? 'gray' : ''">
      <div class="flex">
        <div class="wrapper right">
          <v-select v-model="l2.label" :items="langs" label="Language" id="l2" />
          <p id="o2">{{ o2 }}</p>
        </div>
      </div>
    </div>

    <div class="recorder inner" :class="!languagesReady || waiting  ? 'disabled' : ''"></div>
    <button @click="toggleRecord"  class="recorder" id="button" />
    <v-progress-circular :rotate="180"
          :size="82"
          :width="5"
          :model-value="value"
          color="#9E2A2B"
          :class="recording ? 'recording' : ''"
        >
          </v-progress-circular>
          
    <v-progress-circular
      class="recording"
      :rotate="180"
      :size="82"
      :width="4"
      indeterminate
      color="#9E2A2B"
      :class="waiting ? '' : 'no-op'"
    ></v-progress-circular>

    <svg @click="flip" :class="turn ? 'gray' : ''"
      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" id="flip" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>


    <svg @click="play(LATEST_URL)" :class="!  turn ? 'gray' : ''"
      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" id="redo" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  </div>
</template>


<script setup>
import { ref, computed, watch, reactive } from "vue";

let ready = false;
const recording = ref(false);
const turn = ref(true);
let mediaRecorder;
let audioChunks = [];
const waiting = ref(false);
const value = ref(0);

let interval;

const l1 = reactive({ label: "English", tag: "en" });
const l2 = reactive({ label: "Español", tag: "es" });

const o1 = ref('');
const o2 = ref('');

const LATEST_URL = ref('');

navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  ready = true;
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.addEventListener("dataavailable", (event) => {
    audioChunks.push(event.data);
  });

  mediaRecorder.addEventListener("stop", async () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
    const formData = new FormData();
    formData.append("file", audioBlob);
    formData.append("fromLang", turn.value ? l1.tag : l2.tag);
    formData.append("target", turn.value ? l2.tag : l1.tag);
    
    let texts = await (await fetch("http://localhost:8081/translate/stt", {
      method: "POST",
      body: formData,
    })).json();
    
    console.log(texts, turn);
    
    // eslint-disable-next-line
    o1.value = turn.value ? texts.transcript : texts.translation[0];
    // eslint-disable-next-line
    o2.value = turn.value ? texts.translation[0] : texts.transcript;
    
    let audio = await fetch("http://localhost:8081/translate/stts", {
      method: "POST",
      body: formData,
    });
    LATEST_URL.value = window.URL.createObjectURL(await audio.blob());
    play(LATEST_URL.value);
    waiting.value = false;
    turn.value = !(turn.value);
    waiting.value = false;
  });
});

const toggleRecord = () => {
  if (ready && languagesReady.value && !waiting.value) {
    recording.value = !recording.value;
    document.querySelector(".recorder.inner").classList.toggle("square");
    if (recording.value) {
      interval = setInterval(() => {
        value.value += 2/3;
        if (value.value >= 100) {
          clearInterval(interval);
          toggleRecord();
        }
      }, 111)
      audioChunks = [];
      mediaRecorder.start();
    } else {
      clearInterval(interval);
      waiting.value = true;
      mediaRecorder.stop();
      value.value = 0;
    }
  }
};

function play(url) {
  new Audio(url).play();
}

const languagesReady = computed(() => {
  return l1.value !== "" && l2.value !== "";
});

function capitalizeFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
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
  "vi",
].map((item) => ({
  label: capitalizeFirst(new Intl.DisplayNames([item], { type: "language" }).of(item)),
  tag: item,
}));

function flip() {
  turn.value = !turn.value;
}

const langs = languages.map((item) => item.label);

watch(l1, () => {
  l1.tag = languages.filter((item) => item.label === l1.label)[0].tag;
});

watch(l2, () => {
  l2.tag = languages.filter((item) => item.label === l2.label)[0].tag;
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;400;500;700&family=Pacifico&display=swap');
body {
  overflow: hidden;
  font-family: Montserrat;
}

.title {
  font-family: Pacifico, cursive;
  font-size: 32px;
  position: absolute;
  top: 15px;
  left: 25px;
  color: black;
  transition: color 1s;
}

.full {
  width: 100%;
  height: 100%;
  background: #C15D00;
  color: white;
  transition: background 1s;
}

.half {
  display: inline-block;
  width: 50vw;
  height: 100vh;
  transition: background 1s;
}

.blue {
  background: #023E8A;
}

.recorder {
  background: rgba(0,0,0,0);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: absolute;
  bottom: 130px;
  left: 50%;
  z-index: 2;
  border: 3px solid white;
  transform: translate(-50%);
  transition: border-radius 0.5s, transform .5s, background .5s;
  box-shadow: 0px 0px 5px 3px rgba(0,0,0,0.25);
;
}

.square {
  transform: scale(.5) translate(-100%);;
  border-radius: 10px !important;
}

.flip {
  transform: translateX(-50%) translateY(-40px) rotateY(-180deg);
  transition: transform 0.5s;
}

label.v-label.v-field-label {
  transform: translateY(-5px);
}

.large {
  font-size: 50px;
  position: absolute;
  top: 20%;
  /*left: 50%;*/
  /*transform: translateX(-50%);*/
}

.left {
  color: #C15D00;
  right: 50.2%;
}
.right {
  color: #023E8A;
  left: 50.3%;
}

.disabled {
  background: #888 !important;
  cursor: default;
}

.recorder.inner {
  background: #9E2A2B;
  height: 70px;
  width: 70px;
  border: none;
  bottom: 135px;
}

div.gray {
  background: #999;
}

p.large {
  transition: color 1s;
}

p.gray {
  color: #999;
}

.v-progress-circular {
  position: absolute;
  left: 50%;
  transform: translateX(-50%) rotateZ(180deg);
  bottom: 129px;
  /*border-radius: 4px;*/
  z-index: 5;
  opacity: 0;
  pointer-events: none;
  
  transition: opacity .7s;
}

.v-progress-circular.recording {
  opacity: 1;
}

.no-op {
  opacity: 0 !important;
}

#redo {
  position: absolute;
  bottom: 140px;
  left: 58%;
  cursor: pointer;
  width: 60px;
  color: #023E8A;
  transition: color 1s;
}

#flip {
  position: absolute;
  bottom: 140px;
  left: 38.5%;
  cursor: pointer;
  width: 60px;
  color: #C15D00;
  transition: color ;
  transition: color 1s;
}

#flip.gray, #redo.gray {
  color: #999;
}

.title.gray {
  color: white;
}

.flex {
  display: flex;
  /*flex-direction: column;*/
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  /*margin: 50% 0;*/
}

.v-input {
  /*margin: 0 20%;*/
  position: absolute;
  width: 100%;
  height: 20px;
  z-index: 4;
  color: white;
}

#o1, #o2 {
  color: white;
  padding: 60px 17px 10px 17px;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,.1);
  display: inline-block;
  border-radius: 0 0 10px 10px;
}

.wrapper {
  position: absolute;
  /*display: flex-child;*/
  width: 380px;
  bottom: 270px;
  height: 260px;
  /*background: red;*/
  box-shadow: 0px 0px 20px 3px rgba(0,0,0,0.2);
  
}
.wrapper.right {
  right: 1%;
  margin: auto;
}
.wrapper.left {
  left: 13%;
}
</style>
