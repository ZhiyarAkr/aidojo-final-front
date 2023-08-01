<template>
  <div class="flex w-full p-2 items-center justify-center">
    <p class="flex flex-1 font-semibold text-lg">Summarizer</p>
    <p class="flex flex-1 text-orange-600 items-center justify-center text-lg">
      {{ middleText }}
    </p>
    <div class="flex flex-1 items-center">
      <div class="flex flex-1 items-center justify-center">
        <div
          class="flex items-center justify-end p-0.5 rounded-full border-2 border-orange-500"
        >
          <OrangeToggleBtn
            @click="isEnglishSelected = true"
            :is-selected="isEnglishSelected"
          >
            English
          </OrangeToggleBtn>
          <OrangeToggleBtn
            @click="isEnglishSelected = false"
            :is-selected="!isEnglishSelected"
          >
            Arabic
          </OrangeToggleBtn>
        </div>
      </div>
      <div class="flex flex-1 items-center justify-center">
        <Transition name="fade">
          <div
            v-if="isEnglishSelected"
            class="flex items-center justify-end p-0.5 rounded-full border-2 border-cyan-500"
          >
            <BlackToggleBtn
              @click="isShortSelected = true"
              :is-selected="isShortSelected"
            >
              Short
            </BlackToggleBtn>
            <BlackToggleBtn
              @click="isShortSelected = false"
              :is-selected="!isShortSelected"
            >
              Long
            </BlackToggleBtn>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import OrangeToggleBtn from "./OrangeToggleBtn.vue";
import BlackToggleBtn from "./BlackToggleBtn.vue";

const emit = defineEmits(["isEnglishSelected", "isShortSelected"]);
defineProps({
  middleText: String,
});
const isEnglishSelected = ref(true);
const isShortSelected = ref(true);

watch(isEnglishSelected, (n, o) => {
  emit("isEnglishSelected", n);
});

watch(isShortSelected, (n, o) => {
  emit("isShortSelected", n);
});
</script>
