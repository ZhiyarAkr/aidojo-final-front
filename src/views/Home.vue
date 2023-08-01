<template>
  <div class="flex flex-col w-screen h-screen">
    <WelcomeText v-model="name"
      ><RouterLink :to="{ name: 'savedTexts' }">
        <div class="rounded-full p-2 hover:bg-white">
          <div class="flex items-center justify-center">
            <BookmarkIcon class="w-6 h-6 text-green-400" />
            <div class="px-2 font-semibold">Saved Summaries</div>
          </div>
        </div>
      </RouterLink>
    </WelcomeText>
    <div class="flex flex-1 p-8 bg-gray-100">
      <Container>
        <div class="flex flex-col flex-1">
          <Header
            @is-english-selected="(b) => (isEnglishSelected = b)"
            @is-short-selected="(b) => (isShortSelected = b)"
            :middle-text="middleText"
          />
          <div class="w-full h-px bg-gray-300" />
          <div class="flex flex-1">
            <div class="flex flex-1">
              <TextArea
                :place-holder="placeholder"
                v-model="input"
                @on-clear="onClear"
                @on-summarize="summarize"
                :is-rtl="!isEnglishSelected"
                :key-words="keyWords"
              />
            </div>
            <div class="flex w-px h-full bg-gray-300"></div>
            <div class="flex flex-1">
              <TextAreaReadOnly
                v-model="text"
                :should-show-translate-btn="shouldShowTranslateBtn"
                :is-rtl="resultIsRtl"
                @on-translate="translate"
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import WelcomeText from "@/components/WelcomeText.vue";
import TextArea from "@/components/TextArea.vue";
import TextAreaReadOnly from "@/components/TextAreaReadOnly.vue";
import Container from "@/components/Container.vue";
import remote from "../remote";
import Header from "@/components/Header.vue";
import { BookmarkIcon } from "@heroicons/vue/24/outline";

import {
  postToArModel,
  postToBartModel,
  postToLdModel,
  postToEnArModel,
  postToKeModel,
} from "../util/model";

import type { Keyword } from "../util/model";

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

const isEnglishSelected = ref(true);
const isShortSelected = ref(true);
const resultIsRtl = ref(false);
const text = ref("");
const input = ref("");
const user = ref<User>();
const keyWords = ref<Array<Keyword>>(Array());
const shouldShowTranslateBtn = ref(false);
const middleText = ref("");

onMounted(async () => {
  try {
    let { data } = await remote.get("/auth/me");
    user.value = data.user;
  } catch (e: any) {
    console.log(e);
  }
});

const placeholder = computed(() => {
  return isEnglishSelected.value
    ? "Paste your text here..."
    : "...الصق نصك هنا";
});

const name = computed(() => {
  return `${user.value?.firstName} ${user.value?.lastName}`;
});

const onClear = () => {
  input.value = "";
  keyWords.value.length = 0;
};

const verifyInput = async () => {
  const trimmedInput = input.value.trim();
  if (trimmedInput === "") {
    return Promise.reject("Invalid, Input is Empty");
  }
  let lang = "";
  try {
    middleText.value = "Detecting Language...";
    lang = await postToLdModel(trimmedInput);
    if (lang !== "ar" && lang !== "en") {
      middleText.value = "";
      return Promise.reject(
        "Invalid language, Pleasee keep it in English or Arabic"
      );
    } else if (lang === "ar" && isEnglishSelected.value) {
      middleText.value = "";
      return Promise.reject("Please switch to Arabic Summarizer");
    } else if (lang === "en" && !isEnglishSelected.value) {
      middleText.value = "";
      return Promise.reject("Please switch to English Summarizer");
    } else {
      middleText.value = "";
      return trimmedInput;
    }
  } catch (e) {
    middleText.value = "";
    return Promise.reject(e);
  }
};

const summarize = async () => {
  try {
    const _isEnglishSelected = isEnglishSelected.value;
    const verifiedInput = await verifyInput();
    if (_isEnglishSelected) {
      try {
        resultIsRtl.value = false;
        middleText.value = "Summarizing...";
        const output_p = postToBartModel(verifiedInput, isShortSelected.value);
        const keOutput_p = postToKeModel(verifiedInput);
        text.value = await output_p;
        shouldShowTranslateBtn.value = true;
        input.value = verifiedInput;
        middleText.value = "Extracting Keywords...";
        keyWords.value = await keOutput_p;
        middleText.value = "";
      } catch (e) {
        text.value = "";
        alert(e);
        middleText.value = "";
      }
    } else {
      try {
        middleText.value = "Summarizing...";
        const output = await postToArModel(verifiedInput);
        resultIsRtl.value = true;
        text.value = output;
        shouldShowTranslateBtn.value = false;
        middleText.value = "";
      } catch (e) {
        text.value = "";
        alert(e);
        middleText.value = "";
      }
    }
  } catch (e) {
    alert(e);
  }
};

const translate = async () => {
  const input = text.value;
  try {
    middleText.value = "Translating...";
    let output = await postToEnArModel(input);
    resultIsRtl.value = true;
    text.value = output;
    shouldShowTranslateBtn.value = false;
    middleText.value = "";
  } catch (e) {
    alert(e);
    middleText.value = "";
  }
};
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
