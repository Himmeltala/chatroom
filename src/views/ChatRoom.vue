<script setup lang="ts">
import { onMounted, ref } from "vue";
import { io } from "socket.io-client";
import { Message } from "../typescript/standard";
import { updateUser, queryFriends } from "../apis/userApi";
import { UserModel } from "../models/userModel";
import { useCookies } from "@vueuse/integrations/useCookies";
import { ElMessage } from "element-plus";

const socket = io("http://localhost:3000");
const methods: any = {};

let configs = ref();
let msgList = ref<Array<Message>>([]); // 消息列表
let msgListDOM = ref<any>(null); // 模板引用
let friends = ref<Array<UserModel>>([]); // 好友列表

onMounted(() => {
  socket.on("connect", () => {
    updateUser({ socket_id: socket.id, id: useCookies().get("USERID"), is_online: 1 }, () => {
      queryFriends({ id: useCookies().get("USERID") }, ({ data }) => {
        friends.value = data;
      });
    });
  });

  socket.on("refresh-friends", () => {
    queryFriends({ id: useCookies().get("USERID") }, ({ data }) => {
      friends.value = data;
    });
  })

  socket.on("broadcast", (e) => {
    msgList.value.push(e);
    msgListDOM.value.scrollTop = msgListDOM.value.scrollHeight;
  });

  methods.onSendText = (text: string) => {
    let message = new Message(configs.value.username, text, configs.value.avatar, configs.value.popColor, "others");
    socket.emit("sending", message);
    message.type = "self";
    msgList.value.push(message);
    msgListDOM.value.scrollTop = msgListDOM.value.scrollHeight;
  };
});

function onConfigMenusDataChange(e: any) {
  configs.value = e;
}

function onConfigMenusInit(e: any) {
  configs.value = e;
}
</script>

<template>
  <div class="chatroom">
    <div class="wrapper">
      <ConfigMenus @on-change="onConfigMenusDataChange" @on-init="onConfigMenusInit" />
      <div class="content">
        <div class="uid">Your socket ID: {{ }}</div>
        <div class="msg-list" ref="msgListDOM">
          <div class="msg-item" :class="msg.type" v-for="(msg, key) in msgList" :key="key">
            <template v-if="msg.type === 'self'">
              <div class="left">
                <div class="msg-holder">{{ msg.username }}</div>
                <div class="msg-pop" :style="{ '--pop-color': msg.popColor }">{{ msg.text }}</div>
              </div>
              <div class="right"><img class="avatar" :src="msg.avatar" alt="oops!" /></div>
            </template>
            <template v-else>
              <div class="left"><img class="avatar" :src="msg.avatar" alt="oops!" /></div>
              <div class="right">
                <div class="msg-holder">{{ msg.username }}</div>
                <div class="msg-pop" :style="{ '--pop-color': msg.popColor }">{{ msg.text }}</div>
              </div>
            </template>
          </div>
        </div>
        <BottomMenus @on-send-text="methods.onSendText" />
      </div>
      <RightMenus :data="friends" />
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

.content {
  width: 70%;
  height: 100%;
  border-color: #E9E9E9;
  border-radius: 4px;
  border-style: solid;
  border-right-width: 1px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
}

.uid {
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

.msg-list .msg-item:last-child {
  margin-bottom: 20px;
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
</style>