<template>
  <div class="full">
    <p class="title">Gibbri.sh</p>
    <p class="large left">Tran</p>
    <p class="large right">slate</p>
    <div class="half blue">
      <div class="flex">
        <v-select v-model="l1.label" :items="langs" label="Language" id="l1" />
      </div>
    </div>
    <div class="half">
      <div class="flex">
        <v-select v-model="l2.label" :items="langs" label="Language" id="l2" />
      </div>
    </div>

    <button
      @click="toggleRecord"
      :class="languagesReady ? '' : 'disabled'"
      class="recorder"
      id="button"
    />
    <button @click="flipArrow" class="direction" id="arrow">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed, watch, reactive } from "vue";

let ready = false;
let recording = false;
let turn = true;
let mediaRecorder;
let audioChunks = [];

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
    formData.append("fromLang", turn ? l1.tag : l2.tag);
    formData.append("target", turn ? l2.tag : l1.tag);
    fetch("http://localhost:8081/translate/stts", {
      method: "POST",
      body: formData,
    }).then(async (res) => {
      const url = window.URL.createObjectURL(await res.blob());
      new Audio(url).play();
    });
    turn = !turn;
  });
});

const toggleRecord = () => {
  console.log(languagesReady.value, l1.value, l2.value);
  if (ready && languagesReady.value) {
    recording = !recording;
    document.getElementById("button").classList.toggle("square");
    if (recording) {
      audioChunks = [];
      mediaRecorder.start();
    } else {
      document.getElementById("arrow").classList.toggle("flip");
      mediaRecorder.stop();
    }
  }
};

const flipArrow = () => {
  turn = !turn;
  document.getElementById("arrow").classList.toggle("flip");
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

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@100;400;500;700&family=Pacifico&display=swap");

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
  background: #e09f3e;
  color: white;
}

.half {
  display: inline-block;
  width: 50vw;
  height: 100vh;
}

.blue {
  background: #335c67;
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
  background: #9e2a2b;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: absolute;
  bottom: 100px;
  left: 50%;
  z-index: 2;
  border: 5px solid white;
  transform: translate(-50%);
  transition: border-radius 0.5s;
}

.square {
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
  transform: translateX(-50%) translateY(-40px) rotateZ(0deg);
  transition: transform 0.5s;
}

.flip {
  transform: translateX(-50%) translateY(-40px) rotateZ(-180deg);
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
  color: #e09f3e;
  left: 42.7%;
}
.right {
  color: #335c67;
  left: 50.1%;
}

.disabled {
  background: #888;
  cursor: default;
}
</style>
