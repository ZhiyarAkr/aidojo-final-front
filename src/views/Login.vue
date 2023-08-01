<template>
  <div class="h-screen w-full flex justify-center items-center">
    <div class="rounded-lg p-4 w-1/3 flex flex-col text-black">
      <p v-if="errorMessage != null" class="text-red-500">
        {{ errorMessage }}
      </p>

      <div class="flex flex-col mb-2">
        <label class="text-2xl font-semibold text-gray-700" for="username"
          >Username</label
        >
        <input
          id="username"
          class="border-2 border-gray-300 text-xl mt-2 rounded-lg p-2 outline-none"
          v-model="form.username"
          type="text"
        />
      </div>

      <div class="flex flex-col mb-2">
        <label class="text-2xl font-semibold text-gray-700 mt-2" for="password"
          >Password</label
        >
        <input
          id="password"
          type="password"
          class="border-2 border-gray-300 text-2xl mt-2 rounded-lg p-2 outline-none"
          v-model="form.password"
        />
      </div>

      <button
        @click="login"
        class="bg-orange-500 font-bold text-white mt-6 text-2xl rounded-xl px-4 py-3"
      >
        Login
      </button>
      <div class="pt-3 text-lg">
        Don't have an account?
        <a href="#/auth/signup">
          <span class="text-orange-600 ml-2 font-bold hover:cursor-pointer"
            >Sign Up</span
          >
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import remote from "../remote";
import { useRouter } from "vue-router";

const router = useRouter();
const errorMessage = ref();
const form = ref({
  username: "",
  password: "",
});
const login = async () => {
  errorMessage.value = null;
  try {
    const { data } = await remote.post("/auth/login", {
      ...form.value,
    });
    localStorage.setItem("accessToken", data.token);

    router.push({ name: "home" });
  } catch (e: any) {
    errorMessage.value = e.response.data.message;
  }
};
</script>
