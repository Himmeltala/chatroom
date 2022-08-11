<script setup lang="ts">
import { onMounted, ref } from "vue";
import { io } from "socket.io-client";
import { MessageStandard } from "./standard";

const socket = io("http://localhost:3000");
const methods: any = {};
const resetColors = ["#009688", "#1E9FFF", "#FFB800", "#FF5722", "#5FB878"];

let socketId = ""; // socket id
let text = ref(""); // 消息编辑框的文本
let username = ref("游客"); // 用户名
let popColor = ref("#E9ECED"); // 气泡颜色
let avatar = ref("https://img2.baidu.com/it/u=1122189152,3409253069&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=499"); // 头像地址
let msgList = ref<Array<MessageStandard>>([]); // 消息数组
let msgListDom = ref<any>(null); // 消息数组 DOM

onMounted(() => {
  /**
   * socket 连接服务器。
   */
  socket.on("connect", () => {
    socketId = socket.id;
  });

  /**
   * 发送文本信息的点击事件，socket 发送事件 send-text，服务器监听该事件。
   * 服务器监听到该事件之后，通过广播把数据转发给其他人，除了自己。
   */
  methods.sendText = () => {
    let standard = new MessageStandard(username.value, text.value, avatar.value, popColor.value, "others");
    socket.emit("send-text", standard);
    text.value = "";
    standard.type = "self";
    msgList.value.push(standard);
    msgListDom.value.scrollTop = msgListDom.value.scrollHeight;
  };

  /**
   * 接收群聊广播信息，socket 监听 broadcast 事件。
   */
  socket.on("broadcast", e => {
    msgList.value.push(e);
    msgListDom.value.scrollTop = msgListDom.value.scrollHeight;
  });

  /**
   * 改变 div 元素的文本，并吧 innerText 赋值给 text 变量。
   * 与此同时，div 使用 v-text 指令更新文本信息。
   * @param e InputEvent
   */
  methods.changeDivText = (e: any): void => {
    text.value = e.target.innerText;
  };
});
</script>

<template>
  <div class="chatroom">
    <div class="wrapper">
      <!-- 配置信息：用户名、头像、气泡颜色 -->
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
          <lay-color-picker v-model="popColor" :preset="resetColors"></lay-color-picker>
        </div>
      </div>
      <!-- 聊天界面主内容区域 -->
      <div class="content">
        <!-- socket 唯一标识符 -->
        <div class="socket-id">Your identifier: {{ socketId }}</div>
        <!-- 信息列表容器 -->
        <div class="msg-list" ref="msgListDom">
          <!-- 信息列表其中的项 -->
          <div class="msg-item" :class="msg.type" v-for="(msg, key) in msgList" :key="key">
            <template v-if="msg.type === 'self'">
              <!-- 别人的消息 -->
              <div class="left">
                <div class="msg-holder">{{ msg.username }}</div>
                <div class="msg-pop" :style="{'--pop-color': msg.popColor}">{{ msg.text }}</div>
              </div>
              <div class="right"><img class="avatar" :src="msg.avatar" alt="oops!" /></div>
            </template>
            <template v-else>
              <!-- 自己的消息 -->
              <div class="left"><img class="avatar" :src="msg.avatar" alt="oops!" /></div>
              <div class="right">
                <div class="msg-holder">{{ msg.username }}</div>
                <div class="msg-pop" :style="{'--pop-color': msg.popColor}">{{ msg.text }}</div>
              </div>
            </template>
          </div>
        </div>
        <!-- 聊天菜单：发送按钮和信息编辑区域 -->
        <div class="menus">
          <div class="sending">
            <div class="msg-textarea" contenteditable="true" v-text="text" @input="methods.changeDivText"></div>
            <el-button class="sending-btn" @click="methods.sendText">发送</el-button>
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

.wrapper {
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

.socket-id {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  height: 7%;
  background-color: #F9F9F9;
}

.msg-list {
  width: 100%;
  height: 80%;
  overflow-x: auto;
}

.msg-list .msg-item {
  display: flex;
  margin-top: 20px;
}

.msg-list .self {
  justify-content: flex-end;
}

.msg-list .others.msg-item {
  padding-right: 50px;
  padding-left: 20px;
}

.msg-list .self.msg-item {
  padding-right: 20px;
  padding-left: 50px;
}

.msg-list .others .left {
  margin-right: 20px;
  width: 12%;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: flex-start;
}

.msg-list .self .right {
  margin-left: 20px;
  width: 12%;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: flex-start;
}

.msg-list .self .left .msg-holder {
  text-align: right;
}

.msg-list .msg-pop {
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

.msg-list .others .msg-pop::before {
  position: absolute;
  content: "";
  top: 10px;
  left: -10px;
  border-top: 2px solid transparent;
  border-right: 12px solid var(--pop-color);
  border-bottom: 10px solid transparent;
}

.msg-list .self .msg-pop::after {
  position: absolute;
  content: "";
  top: 10px;
  right: -10px;
  border-top: 2px solid transparent;
  border-left: 12px solid var(--pop-color);
  border-bottom: 10px solid transparent;
}

.msg-list .avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-top: 10px;
}

.menus {
  height: 13%;
}

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