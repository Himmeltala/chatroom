<script setup lang="ts">
import { watch, reactive } from "vue";
import { ConfigMenusData } from "../typescript/standard";

const resets = ["#009688", "#1E9FFF", "#FFB800", "#FF5722", "#5FB878"];
let configs = reactive({
  popColor: "#E9ECED"
});

const emits = defineEmits<{
  (e: "onChange", value: ConfigMenusData): void,
  (e: "onInit", value: ConfigMenusData): void
}>();

watch(
    () => configs,
    (value) => {
      emits("onChange", value);
    }, { deep: true }
);

emits("onInit", configs);

defineProps({
  width: {
    type: String,
    default: "20%"
  }
});
</script>

<template>
  <div class="config-menus" :style="{ 'width': width }">
    <div class="cfig-item popup-color">
      <div class="label">气泡色</div>
      <lay-color-picker v-model="configs.popColor" :preset="resets"></lay-color-picker>
    </div>
  </div>
</template>

<style scoped>
.config-menus {
  box-sizing: border-box;
  height: 100%;
  padding: 10px 10px;
  border-radius: 4px;
  border-left-width: 1px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-right-width: 0;
  border-color: #E9E9E9;
  border-style: solid;
}

.config-menus .cfig-item {
  margin-bottom: 15px;
}

.cfig-item .label {
  margin-bottom: 5px;
}
</style>