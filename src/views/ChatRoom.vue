<script setup lang="ts">
import { Message } from "@/models";
import { usePrivateMessagesStore, usePublicMessagesStore } from "@/pinia/stores";
import { queryFriendsService, queryGroupsService, queryFriendAndGroupService } from "@/service/userService";
import { IGroup, IMessage, ITemporaryMessage, IUser } from "@/types";
import { getIndexOfElInArr } from "@/utils";
import { useCookies } from "@vueuse/integrations/useCookies";
import { storeToRefs } from "pinia";
import { io } from "socket.io-client";
import { onMounted, ref } from "vue";

let socket = io("http://localhost:3000");
let cookie = useCookies().get("USERINFO");
let methods: any = {};
let chatPanel = ref<any>(null);
let configs = ref();
let friends = ref<IUser[]>([]);
let groups = ref<IGroup[]>([]);
let privateMessages = ref<IMessage[]>();
let publicMessages = ref<IMessage[]>();
let content = ref<string>("");
let clickUser = ref<IUser>({});
let clickGroup = ref<IGroup>({});
let chatType = ref<string>("private");

const privateStore = usePrivateMessagesStore();
let { privateTempMessages } = storeToRefs(privateStore);
const { pushPrivateMessageToStore } = privateStore;

const publicStore = usePublicMessagesStore();
let { publicTempMessages } = storeToRefs(publicStore);
const { pushPublicMessageToStore } = publicStore;

/**
 * 打开聊天室界面时连接 socket，并查询好友列表以及群聊列表
 */
socket.on("connect", async () => {
  let response = await queryFriendAndGroupService({ socket_id: socket.id, id: cookie.id, is_online: 1 });
  friends.value = response[0].data.data;
  groups.value = response[1].data.data;
});

/**
 * 更新私密消息列表：给状态存储插入一条新的消息，并将新的 state 赋值给组件内的消息变量
 * 点击发送消息时，调用该函数；从 socket 收到消息时，也需要调用该函数。
 * @param message 消息类实体
 * @param id 好友 ID
 */
function updatePrivateMessages(message: IMessage, id: number) {
  pushPrivateMessageToStore(id, message);
  let index = getIndexOfElInArr<ITemporaryMessage>(privateTempMessages.value, arr => arr.id === id);
  privateMessages.value = privateTempMessages.value[index].messages;
}

/**
 * 更新群聊消息列表：给状态存储插入一条新的消息，并将新的 state 赋值给组件内的消息变量
 * 点击发送消息时，调用该函数；从 socket 收到消息时，也需要调用该函数。
 * @param message 消息类实体
 * @param id 群 ID
 */
function updatePublicMessages(message: IMessage, id: number) {
  pushPublicMessageToStore(id, message);
  let index = getIndexOfElInArr<ITemporaryMessage>(publicTempMessages.value, arr => arr.id === id);
  publicMessages.value = publicTempMessages.value[index].messages;
}

/**
 * 发送私聊或群聊消息。
 * @param label socket.emit 函数发送的唯一标识符
 * @param text 发送的文本消息
 * @param skid 房间标识符或私密房间的 socket 标识符
 * @param calb 由于发送消息在更新全局状态存储的函数不一样，需要把本次发送的消息回传到调用层进行存储；
 * socket 监听其他人发送的消息，再调用全局状态存储函数
 */
function sendMessage(label: string, text: string, skid: string, calb?: (res: IMessage) => void) {
  let message = new Message(cookie.username, cookie.avatar, cookie.id, text, configs.value.popColor, "others", skid);
  socket.emit(label, message);
  message.type = "self";
  calb && calb(message);
}

onMounted(() => {
  socket.on("echo-private", message => {
    updatePrivateMessages(message, clickUser.value.id!);
    chatPanel.value.scrollTop = chatPanel.value.scrollHeight;
  });

  socket.on("echo-public", message => {
    updatePublicMessages(message, clickGroup.value.id!);
    chatPanel.value.scrollTop = chatPanel.value.scrollHeight;
  });

  methods.sendText = (text: string) => {
    if (chatType.value === "private") {
      sendMessage("emit-private", text, clickUser.value.socket_id!, message => {
        updatePrivateMessages(message, clickUser.value.id!);
      });
    } else {
      sendMessage("emit-public", text, clickGroup.value.room_id!, message => {
        updatePublicMessages(message, clickGroup.value.id!);
      });
    }
    chatPanel.value.scrollTop = chatPanel.value.scrollHeight;
  };
});

async function reloadFriends() {
  let response = await queryFriendsService({ id: cookie.id });
  friends.value = response.data.data;
}

async function reloadGroups() {
  let response = await queryGroupsService({ id: cookie.id });
  groups.value = response.data.data;
}

function selectGroup(group: IGroup) {
  socket.emit("emit-join-public", { socket_id: socket.id, room_id: group.room_id });
  clickGroup.value = group;
  let index = getIndexOfElInArr<ITemporaryMessage>(publicTempMessages.value, arr => arr.id === group.id);
  if (index === -1) {
    publicMessages.value = undefined;
  } else publicMessages.value = publicTempMessages.value[index].messages;
  chatType.value = "public";
}

function selectUser(user: IUser) {
  clickUser.value = user;
  let index = getIndexOfElInArr<ITemporaryMessage>(privateTempMessages.value, arr => arr.id === user.id);
  if (index === -1) {
    privateMessages.value = undefined;
    // 1. 查询数据
  } else privateMessages.value = privateTempMessages.value[index].messages;
  chatType.value = "private";
}
</script>

<template>
  <div class="chatroom">
    <div class="wrapper">
      <ConfigMenus @on-change="(e: any) => (configs = e)" @on-init="(e: any) => (configs = e)" />
      <div class="content">
        <!-- chat panel start -->
        <template v-if="chatType === 'private'">
          <div class="friends">
            <div class="username">{{ clickUser.username }}</div>
            <div class="is-online">
              <template v-if="clickUser.username">
                <template v-if="clickUser.is_online === 1">在线</template>
                <template v-else>离线</template>
              </template>
              <template v-else>未选择好友</template>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="friends">
            <div class="username">{{ clickGroup.name }}</div>
          </div>
        </template>
        <div class="chat-panel" ref="chatPanel">
          <Messages :data="privateMessages" defineType="private" :type="chatType" />
          <Messages :data="publicMessages" defineType="public" :type="chatType" />
        </div>
        <!-- chat panel end -->
        <BottomMenus :height="'12%'" @on-send-text="methods.sendText" @on-text-changed="(e: any) => content = e" />
      </div>
      <RightMenus :friends="friends" :groups="groups" @on-reload-friends="reloadFriends" @on-reload-groups="reloadGroups" @on-select-group="selectGroup" @on-select-friend="selectUser" />
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

.chat-panel {
  width: 100%;
  height: 80%;
  overflow-x: auto;
}
</style>
