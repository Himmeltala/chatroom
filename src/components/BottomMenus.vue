<script setup lang="ts">
import { ref, defineEmits, defineProps } from "vue";

let text = ref("");

defineProps({
  height: {
    type: String,
    default: "13%"
  }
});

const emits = defineEmits<{
  (e: "onSendText", text: string): void
}>();

/**
 * 监听可编辑的 <div> 元素，当输入文本时调用该函数。
 * 函数接收由 InputEvent 参数，获得监听的元素中的 innerText。
 * @param e InputEvent
 */
function changeText(e: any): void {
  text.value = e.target.innerText;
}

/**
 * 向父组件提交一个自定义事件，把数据文本信息传递给父组件。
 * 与此同时，清除消息输入框内的文本，使用 v-text 可以响应式地更新文本。
 */
function onSendText() {
  emits("onSendText", text.value);
  text.value = "";
}
</script>

<template>
  <div class="bottom-menus" :style="{'height': height}">
    <div class="sending">
      <div class="msg-textarea" contenteditable="true" v-text="text" @input="changeText"></div>
      <el-button class="sending-btn" @click="onSendText">发送</el-button>
    </div>
  </div>
</template>

<style scoped>
.sending {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
}

.sending .msg-textarea {
  box-sizing: border-box;
  padding: 4px;
  outline: none;
  height: 100%;
  width: 100%;
  border: 1px solid #E9E9E9;
  border-radius: 4px;
  caret-color: #9B9191;
  overflow-x: auto;
  transition: 0.6s;
}

.sending .msg-textarea:hover {
  border-color: #D0CBCB;
}

.sending .msg-textarea:focus {
  transition: 0.6s;
  border-color: #409EFF;
}

.sending .sending-btn {
  height: 100%;
}
</style>