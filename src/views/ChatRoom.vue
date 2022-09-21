<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useCookies } from "@vueuse/integrations/useCookies";
import { storeToRefs } from "pinia";
import { io } from "socket.io-client";
import { usePrivateMessagesStore, usePublicMessagesStore } from "@/pinia/stores";
import { IUser, IGroup, IMessage, ITemporaryMessage } from "@/types";
import { Message } from "@/models";
import { getIndexOfElInArr } from "@/utils";
import { queryListPanelService, queryGroupsService, queryFriendsService } from "@/service/userService";
import { groupBy } from "lodash";

let socket = io("http://localhost:3000");
let cookie = useCookies().get("USERINFO");
let methods: any = {};
let msgList = ref<IMessage[]>([]);
let chatPanel = ref<any>(null);
let configs = ref();
let friends = ref<IUser[]>([]);
let groups = ref<IGroup[]>([]);
let privateMessages = ref<IMessage[]>();
let publicMessages = ref<IMessage[]>();
let content = ref<string>("");
let pitchBuddy = ref<IUser>({});
let pitchGroup = ref<IGroup>({});
let nowType = ref<{ group?: boolean; friend?: boolean }>({ friend: true, group: false });

const privateStore = usePrivateMessagesStore();
let { privateTempMessages } = storeToRefs(privateStore);
const { pushPrivateMessageToStore } = privateStore;

const publicStore = usePublicMessagesStore();
let { publicTempMessages } = storeToRefs(publicStore);
const { pushPublicMessageToStore } = publicStore;

socket.on("connect", async () => {
  let reqs = await queryListPanelService({ socket_id: socket.id, id: cookie.id, is_online: 1 });
  friends.value = reqs[0].data.data;
  groups.value = reqs[1].data.data;
});

/**
 * 更新私密消息列表
 * @param message 消息类实体
 * @param id 好友 ID
 */
function updatePrivateMessages(message: IMessage, id: number) {
  pushPrivateMessageToStore(id, message);
  let index = getIndexOfElInArr<ITemporaryMessage>(privateTempMessages.value, arr => arr.id === id);
  privateMessages.value = privateTempMessages.value[index].messages;
}

/**
 * 更新群聊消息列表
 * @param message 消息类实体
 * @param id 群 ID
 */
function updatePublicMessages(message: IMessage, id: number) {
  pushPublicMessageToStore(id, message);
  let index = getIndexOfElInArr<ITemporaryMessage>(publicTempMessages.value, arr => arr.id === id);
  publicMessages.value = publicTempMessages.value[index].messages;
}

function sendMessage(label: string, text: string, sid: string, clb?: (res: IMessage) => void) {
  let message = new Message(cookie.username, cookie.avatar, cookie.id, text, configs.value.popColor, "others", sid);
  socket.emit(label, message);
  message.type = "self";
  clb && clb(message);
}

onMounted(() => {
  socket.on("echo-private", message => {
    updatePrivateMessages(message, pitchBuddy.value.id!);
    chatPanel.value.scrollTop = chatPanel.value.scrollHeight;
  });

  socket.on("echo-public", message => {
    updatePublicMessages(message, pitchGroup.value.id!);
    chatPanel.value.scrollTop = chatPanel.value.scrollHeight;
  });

  methods.sendText = (text: string) => {
    if (nowType.value.friend) {
      sendMessage("emit-private", text, pitchBuddy.value.socket_id!, message => {
        updatePrivateMessages(message, pitchBuddy.value.id!);
      });
    } else {
      sendMessage("emit-public", text, pitchGroup.value.room_id!, message => {
        updatePublicMessages(message, pitchGroup.value.id!);
      });
    }
    chatPanel.value.scrollTop = chatPanel.value.scrollHeight;
  };
});

function reloadFriends() {
  queryFriendsService({ id: cookie.id }).then(res => {
    friends.value = res.data.data;
  });
}

function reloadGroups() {
  queryGroupsService({ id: cookie.id }).then(res => {
    groups.value = res.data.data;
  });
}

function selectGroup(group: IGroup) {
  socket.emit("emit-join-public", { socket_id: socket.id, room_id: group.room_id });
  pitchGroup.value = group;
  console.log(group);
  let index = getIndexOfElInArr<ITemporaryMessage>(publicTempMessages.value, arr => arr.id === group.id);
  console.log(index);
  if (index === -1) {
    publicMessages.value = undefined;
  } else publicMessages.value = publicTempMessages.value[index].messages;
  nowType.value = { group: true, friend: false };
}

function selectFriend(user: IUser) {
  pitchBuddy.value = user;
  let index = getIndexOfElInArr<ITemporaryMessage>(privateTempMessages.value, arr => arr.id === user.id);
  if (index === -1) {
    privateMessages.value = undefined;
    // 从数据库中查询，赋值给 private
  } else privateMessages.value = privateTempMessages.value[index].messages;
  nowType.value = { group: false, friend: true };
}
</script>

<template>
  <div class="chatroom">
    <div class="wrapper">
      <ConfigMenus @on-change="(e: any) => (configs = e)" @on-init="(e: any) => (configs = e)" />
      <div class="content">
        <!-- chat panel start -->
        <template v-if="nowType.friend === true">
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
        </template>
        <template v-else>
          <div class="friends">
            <div class="username">{{ pitchGroup.name }}</div>
          </div>
        </template>
        <div class="msg-list" ref="chatPanel">
          <!-- 私聊 -->
          <template v-if="nowType.friend">
            <template v-if="privateMessages">
              <div class="msg-item" :class="message.type" v-for="(message, key) in privateMessages" :key="key">
                <template v-if="message.type === 'self'">
                  <div class="left">
                    <div class="msg-holder">{{ message.username }}</div>
                    <div class="msg-pop" :style="{ '--pop-color': message.popColor }">{{ message.text }}</div>
                  </div>
                  <div class="right"><img class="avatar" :src="message.avatar" alt="oops!" /></div>
                </template>
                <template v-else>
                  <div class="left"><img class="avatar" :src="message.avatar" alt="oops!" /></div>
                  <div class="right">
                    <div class="msg-holder">{{ message.username }}</div>
                    <div class="msg-pop" :style="{ '--pop-color': message.popColor }">{{ message.text }}</div>
                  </div>
                </template>
              </div>
            </template>
          </template>
          <!-- 群聊 -->
          <template v-if="nowType.group">
            <template v-if="publicMessages">
              <div class="msg-item" :class="message.type" v-for="(message, key) in publicMessages" :key="key">
                <template v-if="message.type === 'self'">
                  <div class="left">
                    <div class="msg-holder">{{ message.username }}</div>
                    <div class="msg-pop" :style="{ '--pop-color': message.popColor }">{{ message.text }}</div>
                  </div>
                  <div class="right"><img class="avatar" :src="message.avatar" alt="oops!" /></div>
                </template>
                <template v-else>
                  <div class="left"><img class="avatar" :src="message.avatar" alt="oops!" /></div>
                  <div class="right">
                    <div class="msg-holder">{{ message.username }}</div>
                    <div class="msg-pop" :style="{ '--pop-color': message.popColor }">{{ message.text }}</div>
                  </div>
                </template>
              </div>
            </template>
          </template>
        </div>
        <!-- chat panel end -->
        <BottomMenus :height="'12%'" @on-send-text="methods.sendText" @on-text-changed="(e: any) => content = e" />
      </div>
      <RightMenus :friends="friends" :groups="groups" @on-reload-friends="reloadFriends" @on-reload-groups="reloadGroups" @on-select-group="selectGroup" @on-select-friend="selectFriend" />
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
