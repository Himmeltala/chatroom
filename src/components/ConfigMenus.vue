<script setup lang="ts">
import { watch, reactive } from "vue";
import { ConfigMenusData } from "@/typescript/standard";

const resets = ["#009688", "#1E9FFF", "#FFB800", "#FF5722", "#5FB878"];
let configs = reactive({
  username: "游客",
  popColor: "#E9ECED",
  avatar: "https://img2.baidu.com/it/u=1122189152,3409253069&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=499"
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
    default: "30%"
  }
});
</script>

<template>
  <div class="config-menus" :style="{'width': width}">
    <div class="cfig-item username">
      <div class="label">用户名</div>
      <el-input v-model="configs.username"></el-input>
    </div>
    <div class="cfig-item avatar">
      <div class="label">头像</div>
      <el-input v-model="configs.avatar"></el-input>
    </div>
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