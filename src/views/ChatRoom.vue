<script setup lang="ts">
import { onMounted, ref } from "vue";
import { io } from "socket.io-client";
import { updateUser, queryFriends } from "../apis/userApi";
import { Message } from "../typescript/standard";
import { UserModel } from "../models/userModel";
import { useCookies } from "@vueuse/integrations/useCookies";

const socket = io("http://localhost:3000");
const methods: any = {};
let msgList = ref<Array<Message>>([]);
let msgListDom = ref<any>(null);
let configs = ref();
let content = ref<string>("");
let friends = ref<Array<UserModel>>([]);
let pitchBuddy = ref<UserModel>({});
let cookie = useCookies().get("USERINFO");

onMounted(() => {
  socket.on("connect", () => {
    updateUser({ socket_id: socket.id, id: cookie.id, is_online: 1 }, () => {
      queryFriends({ id: cookie.id }, ({ data }) => {
        friends.value = data;
      });
    });
  });

  socket.on("echo-private", message => {
    msgList.value.push(message);
    msgListDom.value.scrollTop = msgListDom.value.scrollHeight;
  });

  methods.onSendText = (text: string) => {
    let message = new Message(cookie.username, text, cookie.avatar, configs.value.popColor, "others", pitchBuddy.value.socket_id);
    socket.emit("emit-private", message);
    message.type = "self";
    msgList.value.push(message);
    msgListDom.value.scrollTop = msgListDom.value.scrollHeight;
  };
});

function onReload() {
  queryFriends({ id: cookie.id }, ({ data }) => {
    friends.value = data;
  });
}
</script>

<template>
  <div class="chatroom">
    <div class="wrapper">
      <ConfigMenus @on-change="(e: any) => (configs = e)" @on-init="(e: any) => (configs = e)" />
      <div class="content">
        <div class="friends">
          <div class="username">{{ pitchBuddy.username }}</div>
          <div class="is-online">
            <template v-if="pitchBuddy.username">
              <template v-if="pitchBuddy.is_online === 1">在线</template>
              <template v-else>离线</template>
            </template>
            <template v-else>未选择好友</template>
          </div>
        </div>
        <div class="msg-list" ref="msgListDom">
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
        <BottomMenus :is-disabled="!pitchBuddy.username" :height="'12%'" @on-send-text="methods.onSendText" @on-text-changed="(e: any) => content = e" />
      </div>
      <RightMenus @on-reload="onReload" :data="friends" @on-select-friend="(e: any) => pitchBuddy = e" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.chatroom {
  width: 100%;
  height: 100%;
  @include flex();

  .wrapper {
    background-color: white;
    color: #4d4949;
    width: 1100px;
    height: 580px;
    @include flex(space-between, $align-items: flex-start);

    .content {
      width: 60%;
      height: 100%;

      border: {
        color: $border-color;
        radius: $border-radius-small;
        style: solid;
        right-width: 1px;
        top-width: 1px;
        bottom-width: 1px;
        left-width: 1px;
      }

      .friends {
        height: 8%;
        background-color: #f9f9f9;

        @include flex() {
          flex-direction: column;
        }
      }
    }
  }
}

.msg-list {
  width: 100%;
  height: 80%;
  overflow-x: auto;

  .msg-item {
    display: flex;
    margin-top: 20px;

    &:last-child {
      margin-bottom: 20px;
    }

    .msg-pop {
      position: relative;
      width: auto;
      margin-top: 5px;
      padding: 10px 10px;
      box-sizing: border-box;
      background-color: var(--pop-color);
      border-radius: $border-radius-large;

      word: {
        break: break-word;
        wrap: break-word;
      }
    }

    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }

    .msg-holder {
      text-align: right;
    }
  }

  .self {
    justify-content: flex-end;

    &.msg-item {
      padding: {
        right: 20px;
        left: 50px;
      }
    }

    .right {
      text-align: right;
      width: 12%;
    }

    .left {
      width: 88%;

      @include flex($align-items: flex-end) {
        flex-direction: column;
      }
    }

    .msg-pop::after {
      position: absolute;
      content: "";
      top: 10px;
      right: -10px;

      border: {
        top: 2px solid transparent;
        left: 12px solid var(--pop-color);
        bottom: 10px solid transparent;
      }
    }
  }

  .others {
    justify-content: flex-start;

    &.msg-item {
      padding: {
        right: 50px;
        left: 20px;
      }
    }

    .left {
      width: 12%;
    }

    .right {
      width: 88%;

      @include flex($align-items: flex-start) {
        flex-direction: column;
      }
    }

    .msg-pop::before {
      position: absolute;
      content: "";
      top: 10px;
      left: -10px;

      border: {
        top: 2px solid transparent;
        right: 12px solid var(--pop-color);
        bottom: 10px solid transparent;
      }
    }
  }
}
</style>
