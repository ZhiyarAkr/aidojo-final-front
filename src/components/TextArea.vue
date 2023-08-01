<template>
  <div class="flex flex-col flex-1">
    <textarea
      v-if="!shouldShowKeyWordDiv"
      id="message"
      :class="{ 'text-right': isRtl }"
      class="block p-2.5 flex-1 outline-none resize-none no-scrollbar"
      :placeholder="placeHolder"
      v-model="value"
    />
    <p
      v-else
      id="message"
      role="textbox"
      class="overflow-y-auto p-2.5 flex-1 outline-none resize-none no-scrollbar"
    >
      <span v-for="(item, index) in words" :key="index">
        <span
          v-if="keywordLocation[index]"
          class="bg-orange-200 text-orange-950 px-2 rounded-md items-center"
          >{{ item }}</span
        >
        <span v-else>{{ item }}</span>
      </span>
    </p>
    <div
      class="flex p-1 items-center rounded-t-lg border-t-2 border-t-gray-200"
    >
      <div class="flex flex-1 items-center">
        <Transition name="fade">
          <XMarkIcon
            v-if="showClearIcon"
            class="h-10 w-10 rounded-full text-red-700 hover:bg-gray-300 hover:cursor-pointer"
            @click="onClear"
          />
        </Transition>
      </div>
      <div
        class="flex p-1 m-1 border border-orange-500 rounded-lg"
        v-if="!shouldShowKeyWordDiv"
      >
        {{ count }} Words
      </div>
      <div v-else class="flex flex-wrap items-center justify-center">
        <div
          v-for="i in keyWords"
          class="p-1 m-1 border border-gray-200 bg-orange-100 rounded-lg"
        >
          {{ i.word }}
        </div>
        <div class="p-1 m-1 border border-orange-500 rounded-lg">
          {{ count }} Words
        </div>
      </div>
      <div class="flex flex-1 items-center justify-end">
        <OrangeButton @click="onSummarize">Summarize</OrangeButton>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { XMarkIcon } from "@heroicons/vue/24/solid";
import OrangeButton from "./OrangeButton.vue";
import type { Keyword } from "@/util/model";
import debounce from "lodash.debounce";

const props = defineProps({
  modelValue: String,
  label: String,
  placeHolder: String,
  isRtl: Boolean,
  keyWords: Array<Keyword>,
});

const showKeyWordDiv = ref(true);
const words = ref<String[]>([]);
const wordsForCount = ref<String[]>([]);
const keywordLocation = ref<Boolean[]>([]);
const emit = defineEmits(["update:modelValue", "onClear", "onSummarize"]);

const count = computed(() => {
  let trimmed = value.value?.trim();
  if (trimmed !== undefined) {
    if (trimmed === "") {
      return 0;
    }
    return wordsForCount.value.length;
  } else {
    return 0;
  }
});

const shouldShowKeyWordDiv = computed(() => {
  if (props.keyWords !== undefined) {
    return showKeyWordDiv.value && props.keyWords.length > 0;
  } else {
    return false;
  }
});

const keywords = computed(() => {
  return props.keyWords;
});

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

// no need for debounce here
const calculateWords = debounce(() => {
  let v = value.value;
  let first = 0;
  words.value.length = 0;
  keywordLocation.value.length = 0;
  if (v !== undefined) {
    if (props.keyWords !== undefined) {
      props.keyWords.forEach((i) => {
        //@ts-ignore
        words.value.push(v.substring(first, i.start));
        keywordLocation.value.push(false);
        first = i.end;
        //@ts-ignore
        words.value.push(v.substring(i.start, i.end));
        keywordLocation.value.push(true);
      });
      if (v.substring(first) != "") {
        words.value.push(v.substring(first));
        keywordLocation.value.push(false);
      }
    }
  }
}, 500);

const calculateWordsForCount = debounce(() => {
  let trimmed = value.value?.trim();
  if (trimmed !== undefined) {
    wordsForCount.value = trimmed.split(/\s+/);
  }
}, 500);

watch(keywords, () => {
  if (keywords !== undefined) {
    calculateWords();
  }
});

watch(value, () => {
  calculateWordsForCount();
});

const showClearIcon = computed(() => {
  return value.value !== "";
});

const onClear = () => {
  emit("onClear");
};

const onSummarize = () => {
  emit("onSummarize");
};
</script>
<style>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
