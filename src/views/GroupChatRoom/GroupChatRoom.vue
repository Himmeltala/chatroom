<script setup lang="ts">
import { ref } from "vue";
import { io } from "socket.io-client";
import { MessageStandard } from "./standard";

const socket = io("http://localhost:3000");
let socketId = "";

socket.on("connect", () => {
  socketId = socket.id;
});

socket.on("transfer", e => {
  msgList.value.push(e);
});

let text = ref("");
let username = ref("游客");
let popColor = ref("");
let avatar = ref("https://img2.baidu.com/it/u=1122189152,3409253069&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=499");
let msgList = ref<Array<MessageStandard>>([]);

function sendText(): void {
  let standard = new MessageStandard(username.value, text.value, avatar.value, popColor.value, "others");
  socket.emit("to-server", standard);
  text.value = "";
  standard.type = "self";
  msgList.value.push(standard);
}

function changeDivText(e: any): void {
  text.value = e.target.innerText;
}
</script>

<template>
  <div class="chatroom">
    <div class="wrap">
      <div class="config">
        <div class="item username">
          <div class="label">用户名</div>
          <el-input v-model="username"></el-input>
        </div>
        <div class="item avatar">
          <div class="label">头像</div>
          <el-input v-model="avatar"></el-input>
        </div>
        <div class="item popup-color">
          <div class="label">气泡色</div>
        </div>
      </div>
      <div class="content">
        <div class="identifier">Your identifier: {{ socketId }}</div>
        <div class="message-list">
          <div class="msg-item" :class="msg.type" v-for="(msg, key) in msgList" :key="key">
            <template v-if="msg.type === 'self'">
              <div class="left">
                <div class="msg-holder">{{ msg.username }}</div>
                <div class="msg-popup" :style="{'--pop-color': msg.popColor}">{{ msg.text }}</div>
              </div>
              <div class="right"><img class="avatar" :src="msg.avatar" alt="oops!" /></div>
            </template>
            <template v-else>
              <div class="left"><img class="avatar" :src="msg.avatar" alt="oops!" /></div>
              <div class="right">
                <div class="msg-holder">{{ msg.username }}</div>
                <div class="msg-popup" :style="{'--popup-color': msg.popColor}">{{ msg.text }}</div>
              </div>
            </template>
          </div>
        </div>
        <div class="chat-menu">
          <div class="send-menu">
            <div contenteditable="true" class="msg-input" @input="changeDivText"></div>
            <el-button class="send-btn" @click="sendText">发送</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chatroom {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrap {
  background-color: white;
  color: #4D4949;
  width: 800px;
  height: 580px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: flex-start;
}

.config {
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
  width: 30%;
}

.config .item {
  margin-bottom: 15px;
}

.config .label {
  margin-bottom: 5px;
}

.content {
  box-sizing: border-box;
  height: 100%;
  width: 70%;
  border: 1px solid #E9E9E9;
  border-radius: 4px;
}

.identifier {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  height: 7%;
  background-color: #F9F9F9;
}

.message-list {
  width: 100%;
  height: 80%;
  overflow-x: auto;
}

.message-list .msg-item {
  display: flex;
  margin-top: 20px;
}

.message-list .self {
  justify-content: flex-end;
}

.message-list .others.msg-item {
  padding-right: 50px;
  padding-left: 20px;
}

.message-list .self.msg-item {
  padding-right: 20px;
  padding-left: 50px;
}

.message-list .others .left {
  margin-right: 20px;
  width: 12%;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: flex-start;
}

.message-list .self .right {
  margin-left: 20px;
  width: 12%;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: flex-start;
}

.message-list .msg-popup {
  width: auto;
  margin-top: 5px;
  background-color: var(--pop-color);
  padding: 8px 8px;
  box-sizing: border-box;
  border-radius: 8px;
  word-break: break-word;
  word-wrap: break-word;
  position: relative;
}

.message-list .others .msg-popup::before {
  position: absolute;
  content: "";
  top: 10px;
  left: -10px;
  border-top: 2px solid transparent;
  border-right: 12px solid var(--pop-color);
  border-bottom: 10px solid transparent;
}

.message-list .self .msg-popup::after {
  position: absolute;
  content: "";
  top: 10px;
  right: -10px;
  border-top: 2px solid transparent;
  border-left: 12px solid var(--popup-color);
  border-bottom: 10px solid transparent;
}

.message-list .avatar {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  margin-top: 10px;
}

.chat-menu {
  height: 13%;
}

.send-menu {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
}

.send-menu .msg-input {
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

.send-menu .msg-input:hover {
  border-color: #D0CBCB;
}

.send-menu .msg-input:focus {
  transition: 0.6s;
  border-color: #409EFF;
}

.send-menu .send-btn {
  height: 100%;
}
</style>