<script setup lang="ts">
import { onMounted, ref } from "vue";
import { io } from "socket.io-client";
import { updateUser, queryFriends } from "../apis/userApi";
import { Message } from "../typescript/standard";
import { UserModel } from "../models/userModel";
import { useCookies } from "@vueuse/integrations/useCookies";

const socket = io("http://localhost:3000");
const methods: any = {};
let configs = ref();
let inputText = ref<string>("");
let msgList = ref<Array<Message>>([]); // 消息列表
let msgListDOM = ref<any>(null); // 模板引用
let friends = ref<Array<UserModel>>([]); // 好友列表
let selectedBuddy = ref<UserModel>({});

let cookie = useCookies().get("USERINFO");

onMounted(() => {
  socket.on("connect", () => {
    updateUser({ socket_id: socket.id, id: cookie.id, is_online: 1 }, () => {
      queryFriends({ id: cookie.id }, ({ data }) => {
        friends.value = data;
      });
    });
  });

  socket.on("echo-private", (e) => {
    msgList.value.push(e);
    msgListDOM.value.scrollTop = msgListDOM.value.scrollHeight;
  });

  methods.onSendText = (text: string) => {
    let message = new Message(cookie.username, text, cookie.avatar, configs.value.popColor, "others", selectedBuddy.value.socket_id);
    socket.emit("emit-private", message);
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

function onTextChanged(e: string) {
  inputText.value = e;
}

function onSelectFriend(e: UserModel) {
  selectedBuddy.value = e;
}

function onReload() {
  queryFriends({ id: cookie.id }, ({ data }) => {
    friends.value = data;
  });
}
</script>

<template>
  <div class="chatroom">
    <div class="wrapper">
      <ConfigMenus @on-change="onConfigMenusDataChange" @on-init="onConfigMenusInit" />
      <div class="content">
        <div class="friend">
          <div class="username">{{ selectedBuddy.username }}</div>
          <div class="is-online">
            <template v-if="selectedBuddy.username">
              <template v-if="selectedBuddy.is_online === 1">在线</template>
              <template v-else>离线</template>
            </template>
            <template v-else>未选择好友</template>
          </div>
        </div>
        <div class="msg-list" ref="msgListDOM">
          <div class="msg-item" :class="msg.type" v-for="(msg, key) in msgList" :key="key">
            <template v-if="msg.type === 'self'">
              <div class="left">
                <!-- <div class="msg-holder">{{ msg.username }}</div> -->
                <div class="msg-pop" :style="{ '--pop-color': msg.popColor }">{{ msg.text }}</div>
              </div>
              <div class="right"><img class="avatar" :src="msg.avatar" alt="oops!" /></div>
            </template>
            <template v-else>
              <div class="left"><img class="avatar" :src="msg.avatar" alt="oops!" /></div>
              <div class="right">
                <!-- <div class="msg-holder">{{ msg.username }}</div> -->
                <div class="msg-pop" :style="{ '--pop-color': msg.popColor }">{{ msg.text }}</div>
              </div>
            </template>
          </div>
        </div>
        <BottomMenus :is-disabled="!selectedBuddy.username" :height="'12%'" @on-send-text="methods.onSendText"
          @on-text-changed="onTextChanged" />
      </div>
      <RightMenus @on-reload="onReload" :data="friends" @on-select-friend="onSelectFriend">
        <div>Hello World!</div>
      </RightMenus>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
  width: 1100px;
  height: 580px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: flex-start;
}

.content {
  width: 60%;
  height: 100%;
  border-color: #E9E9E9;
  border-radius: 4px;
  border-style: solid;
  border-right-width: 1px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
}

.friend {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  height: 8%;
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
  width: 12%;
}

.msg-list .others .right {
  width: 88%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  align-content: center;
}

.msg-list .self .right {
  text-align: right;
  width: 12%;
}

.msg-list .self .left {
  width: 88%;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: flex-end;
}

.msg-list .self .left .msg-holder {
  text-align: right;
}

.msg-list .msg-pop {
  width: auto;
  margin-top: 5px;
  background-color: var(--pop-color);
  padding: 10px 10px;
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
}
</style>