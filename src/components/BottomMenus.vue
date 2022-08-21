<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";

let text = ref("");

const props = defineProps({
  height: {
    type: String,
    default: "13%"
  },
  isDisabled: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits<{
  (e: "onSendText", text: string): void;
  (e: "onTextChanged", text: string): void;
}>();

function textChanged(e: any) {
  text.value = e.target.innerText;
  emits("onTextChanged", text.value);
}

function sendText() {
  emits("onSendText", text.value);
  text.value = "";
}
</script>

<template>
  <div class="bottom-menus" :style="{ 'height': height }">
    <div class="menus-box">
      <div class="textarea" contenteditable="true" v-text="text" @input="textChanged"></div>
      <el-button :disabled="isDisabled" class="btn" @click="sendText">发送</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bottom-menus {
  .menus-box {
    width: 100%;
    height: 100%;

    @include flex($justify: space-between) {
      flex-direction: row;
      flex-wrap: nowrap;
    }

    .textarea {
      height: 100%;
      width: 100%;
      outline: none;
      padding: 4px;
      border: 1px solid $border-color;
      border-radius: 4px;
      overflow-x: auto;
      transition: 0.6s ease;
      box-sizing: border-box;

      &:hover {
        border-color: $hover-border-color;
      }

      &:focus {
        border-color: $focus-border-color;
      }
    }

    .btn {
      height: 100%;
    }
  }
}
</style>