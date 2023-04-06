<script setup lang="ts">
import { ConfigMenusData } from "@/models";

const props = defineProps({
  width: {
    type: String,
    default: "20%"
  },
  configs: {
    type: Object as PropType<{
      popColor: string;
    }>,
    required: true
  }
});

const emits = defineEmits<{
  (e: "update:configs", value: ConfigMenusData): void;
}>();

const resets = ["#009688", "#1E9FFF", "#FFB800", "#FF5722", "#5FB878"];

watch(
  () => props.configs,
  value => {
    emits("update:configs", value);
  },
  { deep: true }
);

emits("update:configs", props.configs);
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
