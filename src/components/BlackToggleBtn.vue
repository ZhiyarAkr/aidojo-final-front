<template>
  <p
    :class="{
      'bg-cyan-500 hover:bg-cyan-600 text-white': isSelected,
      'hover:bg-gray-100 text-gray-500': !isSelected,
    }"
    class="rounded-full p-2 px-4 hover:cursor-pointer font-semibold select-none"
  >
    <slot />
  </p>
</template>
<script setup lang="ts">
const props = defineProps({
  isSelected: Boolean,
});
</script>
