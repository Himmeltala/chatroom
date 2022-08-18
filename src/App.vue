<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { checkCookie } from "./utils";

onMounted(() => {
  const router = useRouter();
  checkCookie("USERID", {
    notExsit: () => {
      router.push("/login");
    },
  });
});
</script>

<template>
  <div class="app">
    <router-view v-slot="{ Component }">
      <Transition name="fade">
        <component :is="Component" />
      </Transition>
    </router-view>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
