<script setup lang="ts">
import { onMounted, ref } from "vue";
import { io } from "socket.io-client";
import { useCookies } from "@vueuse/integrations/useCookies";
import { Message } from "@/typescript/standard";
import { updateUserService, queryGroupsService, queryFriendsService } from "@/service/userService";
import { UserModel, GroupModel } from "@/models";

let socket = io("http://localhost:3000");
let cookie = useCookies().get("USERINFO");
let methods: any = {};
let msgList = ref<Array<Message>>([]);
let msgListDom = ref<any>(null);
let configs = ref();
let friends = ref<Array<UserModel>>([]);
let groups = ref<Array<GroupModel>>([]);

socket.on("connect", async () => {
  let reqs = await updateUserService({ socket_id: socket.id, id: cookie.id, is_online: 1 });
  friends.value = reqs[0].data.data;
  groups.value = reqs[1].data.data;
});

onMounted(() => {
  socket.on("echo-private", message => {
    msgList.value.push(message);
    msgListDom.value.scrollTop = msgListDom.value.scrollHeight;
  });

  socket.on("echo-public", message => {
    msgList.value.push(message);
    msgListDom.value.scrollTop = msgListDom.value.scrollHeight;
  });

  methods.onSendText = (text: string) => {
    if (nowType.value.friend) {
      let message = new Message(
        cookie.username,
        text,
        cookie.avatar,
        configs.value.popColor,
        "others",
        selectFriend.value.socket_id
      );
      socket.emit("emit-private", message);
      message.type = "self";
      msgList.value.push(message);
    } else {
      let message = new Message(
        cookie.username,
        text,
        cookie.avatar,
        configs.value.popColor,
        "others",
        selectedGroup.value.room_id
      );
      socket.emit("emit-public", message);
      message.type = "self";
      msgList.value.push(message);
    }
    msgListDom.value.scrollTop = msgListDom.value.scrollHeight;
  };
});

let content = ref<string>("");
let selectFriend = ref<UserModel>({});
let selectedGroup = ref<GroupModel>({});

function onReloadFriends() {
  queryFriendsService({ id: cookie.id }).then(res => {
    friends.value = res.data.data;
  });
}

function onReloadGroups() {
  queryGroupsService({ id: cookie.id }).then(res => {
    groups.value = res.data.data;
  });
}

let nowType = ref<{
  group?: boolean;
  friend?: boolean;
}>({ friend: true, group: false });

function onSelectedGroup(e: GroupModel) {
  socket.emit("emit-join-public", { socket_id: socket.id, room_id: e.room_id });
  selectedGroup.value = e;
  nowType.value = { group: true, friend: false };
}

function onSelectFriend(e: UserModel) {
  selectFriend.value = e;
  nowType.value = { group: false, friend: true };
}
</script>

<template>
  <div class="chatroom">
    <div class="wrapper">
      <ConfigMenus @on-change="(e: any) => (configs = e)" @on-init="(e: any) => (configs = e)" />
      <div class="content">
        <!-- start -->
        <template v-if="nowType.friend === true">
          <div class="friends">
            <div class="username">{{ selectFriend.username }}</div>
            <div class="is-online">
              <template v-if="selectFriend.username">
                <template v-if="selectFriend.is_online === 1">在线</template>
                <template v-else>离线</template>
              </template>
              <template v-else>未选择好友</template>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="friends">
            <div class="username">{{ selectedGroup.name }}</div>
          </div>
        </template>
        <div class="msg-list" ref="msgListDom">
          <div class="msg-item" :class="msg.type" v-for="(msg, key) in msgList" :key="key">
            <template v-if="msg.type === 'self'">
              <div class="left">
                <template v-if="nowType.group">
                  <div class="msg-holder">{{ msg.username }}</div>
                </template>
                <div class="msg-pop" :style="{ '--pop-color': msg.popColor }">{{ msg.text }}</div>
              </div>
              <div class="right"><img class="avatar" :src="msg.avatar" alt="oops!" /></div>
            </template>
            <template v-else>
              <div class="left"><img class="avatar" :src="msg.avatar" alt="oops!" /></div>
              <div class="right">
                <template v-if="nowType.group">
                  <div class="msg-holder">{{ msg.username }}</div>
                </template>
                <div class="msg-pop" :style="{ '--pop-color': msg.popColor }">{{ msg.text }}</div>
              </div>
            </template>
          </div>
        </div>
        <!-- end -->
        <BottomMenus
          :height="'12%'"
          @on-send-text="methods.onSendText"
          @on-text-changed="(e: any) => content = e" />
      </div>
      <RightMenus
        :friends="friends"
        :groups="groups"
        @on-reload-friends="onReloadFriends"
        @on-reload-groups="onReloadGroups"
        @on-select-group="onSelectedGroup"
        @on-select-friend="onSelectFriend" />
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
