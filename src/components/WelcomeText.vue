<template>
  <div class="flex flex-col">
    <div class="flex w-full">
      <div class="flex flex-1 items-center justify-start">
        <UserIcon class="h-7 w-7 text-orange-500" />
        <h1 class="text-xl font-normal text-gray-900 p-2 font-sans">
          Welcome
          <Transition name="slide-fade">
            <span
              v-if="shouldShow"
              class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500"
              v-text="value"
            />
          </Transition>
        </h1>
      </div>
      <div class="flex flex-1 items-center justify-end">
        <div class="flex px-2">
          <slot />
        </div>
      </div>
    </div>
    <div class="w-full h-2 bg-gradient-to-r from-orange-500 to-yellow-500" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { UserIcon } from "@heroicons/vue/24/solid";
const props = defineProps(["modelValue"]);

const shouldShow = ref(false);

const addDelay = async () => {
  setTimeout(() => {
    shouldShow.value = true;
  }, 1000);
};

onMounted(addDelay);

const value = computed(() => {
  return props.modelValue;
});
</script>
<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
