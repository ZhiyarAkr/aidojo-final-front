<template>
  <div class="flex flex-1 flex-col">
    <p
      class="block p-2.5 w-full h-full outline-none resize-none"
      :class="{ 'text-right': isRtl }"
      v-text="value"
    />

    <div
      class="flex p-1 justify-end items-center rounded-t-lg border-t-2 border-t-gray-200"
    >
      <div class="flex flex-1 items-center justify-start">
        <Transition name="fade">
          <div
            v-if="showSaveBtn"
            class="flex rounded-full border border-gray-300 p-2 hover:cursor-pointer hover:bg-gray-200"
            @click="saveText"
          >
            <BookmarkIcon class="w-6 h-6 text-green-400" />
            <div class="px-2 font-semibold">Save Summary</div>
          </div>
        </Transition>
      </div>
      <div class="flex flex-1 items-center justify-center">
        <div class="items-center p-1 m-1 border border-orange-400 rounded-lg">
          {{ wordsForCount.length }} Words
        </div>
      </div>
      <div class="flex flex-1 items-center justify-end">
        <Transition name="fade">
          <OrangeButton v-if="showTranslateBtn" @click="onTranslate"
            >Translate to Arabic</OrangeButton
          >
        </Transition>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, watch, ref } from "vue";
import OrangeButton from "./OrangeButton.vue";
import debounce from "lodash.debounce";
import { postText } from "../util/texts";
import { BookmarkIcon } from "@heroicons/vue/24/solid";

const props = defineProps({
  modelValue: String,
  isRtl: Boolean,
  shouldShowTranslateBtn: Boolean,
});

const wordsForCount = ref<String[]>([]);
const isSaved = ref(false);

const emit = defineEmits(["onTranslate"]);

const onTranslate = () => {
  emit("onTranslate");
};

const calculateWordsForCount = debounce(() => {
  if (value.value !== undefined) {
    wordsForCount.value = value.value.split(/\s+/);
  }
}, 500);

const value = computed(() => {
  return props.modelValue;
});

const saveText = async () => {
  try {
    let v = value.value;
    if (v !== undefined) {
      await postText(v);
      isSaved.value = true;
    }
  } catch (e) {
    console.log(e);
  }
};

watch(value, (n) => {
  calculateWordsForCount();
  isSaved.value = false;
});

const showSaveBtn = computed(() => {
  if (value.value === undefined) {
    return false;
  }
  return value.value !== "" && !isSaved.value;
});

const showTranslateBtn = computed(() => {
  return value.value !== "" && props.shouldShowTranslateBtn;
});
</script>
