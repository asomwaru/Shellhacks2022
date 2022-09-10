<template>
  <div class="full">
    <p class="title">Gibbri.sh</p>
    <p class="large left" :class="turn ? 'gray' : ''">Tran</p>
    <p class="large right" :class="!turn ? 'gray' : ''">slate</p>
    <div class="half blue" :class="!turn ? 'gray' : ''">
      <div class="flex">
        <v-select v-model="l1.label" :items="langs" label="Language" id="l1" />
      </div>
    </div>
    <div class="half" :class="turn ? 'gray' : ''">
      <div class="flex">
        <v-select v-model="l2.label" :items="langs" label="Language" id="l2" />
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
const l2 = reactive({ label: "español", tag: "es" });

navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  ready = true;
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.addEventListener("dataavailable", (event) => {
    audioChunks.push(event.data);
  });

  mediaRecorder.addEventListener("stop", () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
    const formData = new FormData();
    formData.append("file", audioBlob);
    formData.append("fromLang", turn.value ? l1.tag : l2.tag);
    formData.append("target", turn.value ? l2.tag : l1.tag);
    fetch("http://localhost:8081/translate/stts", {
      method: "POST",
      body: formData,
    }).then(async (res) => {
      const url = window.URL.createObjectURL(await res.blob());
      new Audio(url).play();
      waiting.value = false;
    }).catch((e) => {
      console.log(e)
    });
    turn.value = !(turn.value);
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

const languagesReady = computed(() => {
  return l1.value !== "" && l2.value !== "";
});

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
  label: new Intl.DisplayNames([item], { type: "language" }).of(item),
  tag: item,
}));

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
.title {
  font-family: Pacifico, cursive;
  font-size: 32px;
  position: absolute;
  top: 15px;
  left: 25px;
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

.direction {
  opacity: 0.6;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: auto;
  margin-bottom: auto;
  height: 60px;
  width: 60px;
  transform: translateX(-50%) translateY(-40px) rotateY(0deg);
  transition: transform 0.5s;
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
  left: 42.7%;
}
.right {
  color: #023E8A;
  left: 50.1%;
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
</style>
