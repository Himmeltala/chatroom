<script setup lang="ts">
import { ref, onMounted } from "vue";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");


</script>

<template>
  <div class="single-chat-room">

  </div>
</template>

<style scoped>
</style>