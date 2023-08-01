<template>
  <div class="flex-col h-screen w-screen bg-gray-100 no-scrollbar">
    <WelcomeText v-model="name"
      ><RouterLink :to="{ name: 'home' }">
        <div class="rounded-full p-2 hover:bg-white">
          <div class="flex items-center justify-center">
            <HomeIcon class="w-6 h-6 text-orange-400" />
            <div class="px-2 font-semibold">Home</div>
          </div>
        </div>
      </RouterLink>
    </WelcomeText>
    <div class="flex flex-wrap flex-1 p-4">
      <div
        class="overflow-hidden p-2 w-1/4 h-70"
        v-for="(item, index) in texts"
        :key="index"
      >
        <Container>
          <div class="flex flex-col p-2 overflow-hidden">
            <div class="flex w-full border-b rounded-lg border-gray-200 p-1">
              <div class="flex flex-1">
                <span class="rounded-md p-1 font-bold text-gray-500">
                  {{ formatDateFromDatabaseNumber(item.date) }}
                </span>
              </div>
              <div class="flex flex-1 items-center justify-end">
                <button
                  @click="onDeleteText(item)"
                  class="text-red-500 bg-red-100 rounded-md p-1"
                >
                  <TrashIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <div
              class="flex-1 max-h-52 p-2 overflow-y-auto text-orange-500 no-scrollbar"
            >
              {{ item.text }}
            </div>
          </div>
        </Container>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { fetchAllTexts, deleteText } from "@/util/texts";
import { ref, onMounted } from "vue";
import type { Text } from "@/util/texts";
import Container from "../components/Container.vue";
import { TrashIcon } from "@heroicons/vue/24/solid";
import { HomeIcon } from "@heroicons/vue/24/outline";
import WelcomeText from "@/components/WelcomeText.vue";
import remote from "../remote";

const texts = ref<Text[]>([]);
const name = ref("");

onMounted(async () => {
  try {
    let userName = (await remote.get("/auth/me")).data.user;
    name.value = `${userName.firstName} ${userName.lastName}`;
    let r = await fetchAllTexts();
    texts.value = r;
  } catch (e) {
    console.log(e);
  }
});

function formatDateFromDatabaseNumber(databaseDateNumber: number) {
  const dateObject = new Date(databaseDateNumber);
  const month = dateObject.getMonth() + 1; // Months are 0-based, so we add 1
  const day = dateObject.getDate();
  const year = dateObject.getFullYear();

  // Pad single-digit months and days with a leading zero if necessary
  const formattedMonth = String(month).padStart(2, "0");
  const formattedDay = String(day).padStart(2, "0");

  return `${formattedMonth}/${formattedDay}/${year}`;
}

const onDeleteText = async (text: Text) => {
  try {
    await deleteText(text.id);
    let index = texts.value.indexOf(text);
    texts.value.splice(index, 1);
  } catch (e) {
    console.log(e);
  }
};
</script>
