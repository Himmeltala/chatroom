<script setup lang="ts">
import { watch, reactive } from "vue";
import { ConfigMenusData } from "../typescript/standard";

const resets = ["#009688", "#1E9FFF", "#FFB800", "#FF5722", "#5FB878"];
let configs = reactive({
  popColor: "#E9ECED"
});

const emits = defineEmits<{
  (e: "onChange", value: ConfigMenusData): void;
  (e: "onInit", value: ConfigMenusData): void;
}>();

watch(
  () => configs,
  value => {
    emits("onChange", value);
  },
  { deep: true }
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
  <div class="config-menus" :style="{ width: width }">
    <div class="cfig-item popup-color">
      <div class="label">气泡色</div>
      <lay-color-picker v-model="configs.popColor" :preset="resets"></lay-color-picker>
    </div>
  </div>
</template>

<style scoped lang="scss">
.config-menus {
  height: 100%;
  padding: 10px 10px;
  box-sizing: border-box;

  border: {
    left-width: 1px;
    right-width: 0;
    top-width: 1px;
    bottom-width: 1px;
    radius: $border-radius-small;
    color: $border-color;
    style: solid;
  }

  .cfig-item {
    margin-bottom: 15px;

    .label {
      margin-bottom: 5px;
    }
  }
}
</style>
