<script setup lang="ts">
import { ElMessage } from "element-plus";
import { UserModel, GroupModel } from "@/models";

defineProps({
  friends: {
    type: Array<UserModel>
  },
  groups: {
    type: Array<GroupModel>
  },
  width: {
    type: String,
    default: "20%"
  }
});

const emits = defineEmits<{
  (event: "onSelectFriend", data: UserModel): void;
  (event: "onSelectGroup", data: GroupModel): void;
  (event: "onReloadFriends", onSuccess: Function, onError: Function): void;
  (event: "onReloadGroups", onSuccess: Function, onError: Function): void;
}>();

function reloadFriends() {
  emits(
    "onReloadFriends",
    () => {
      ElMessage({ message: "好友列表已更新", type: "success" });
    },
    () => {
      ElMessage({ message: "好友列表更新失败", type: "warning" });
    }
  );
}

function reloadGroups() {
  emits(
    "onReloadGroups",
    () => {
      ElMessage({ message: "群聊列表已更新", type: "success" });
    },
    () => {
      ElMessage({ message: "群聊列表更新失败", type: "warning" });
    }
  );
}

function selectGroup(group: GroupModel) {
  emits("onSelectGroup", group);
}
</script>

<template>
  <div class="right-menus" :style="{ width: width }">
    <div class="friends">
      <div class="reload-btn">
        <el-button plain size="small" @click="reloadFriends">刷新好友列表</el-button>
      </div>
      <template v-for="friend in friends">
        <div class="item" @click="emits('onSelectFriend', friend)">
          <div class="left">
            <div class="status" v-if="friend.is_online !== 0"></div>
            <img
              class="avatar"
              :src="friend.avatar"
              :class="friend.is_online === 0 ? 'outline' : ''"
              alt="avatar" />
          </div>
          <div class="right">
            <div class="username">{{ friend.username }}</div>
            <div class="signature">{{ friend.signature }}</div>
          </div>
        </div>
      </template>
    </div>
    <div class="groups">
      <div class="reload-btn">
        <el-button plain size="small" @click="reloadGroups">刷新群聊列表</el-button>
      </div>
      <template v-for="(group, index) in groups" :key="index">
        <div class="item" @click="selectGroup(group)">
          <div class="left">
            <img class="avatar" :src="group.avatar" />
          </div>
          <div class="right">
            <div class="username">{{ group.name }}</div>
            <div class="signature">{{ group.desc }}</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
@mixin avatar() {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.right-menus {
  height: 100%;

  border: {
    style: solid;
    width: 1px;
    color: $border-color;
    radius: $border-radius-small;
    top-width: 1px;
    bottom-width: 1px;
    right-width: 1px;
    left-width: 0;
  }

  .common-1 {
    padding: 10px;
    box-sizing: border-box;
  }

  .common-2 {
    margin-bottom: 15px;
  }

  .common-3 {
    @extend .common-2;
    @include flex(space-between);
  }

  .friends {
    @extend .common-1;

    .item {
      @extend .common-3;

      .left {
        width: 20%;
        position: relative;

        .status {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #54ed39;
          position: absolute;
          right: 0;
          bottom: 0;
        }

        .avatar {
          @include avatar();
        }

        .outline {
          filter: grayscale(100%);
        }
      }

      .right {
        width: 75%;

        .username {
          font-size: 14px;
        }

        .signature {
          font-size: 12px;
          @include ellipsis();
        }
      }
    }
  }

  .groups {
    @extend .common-1;

    .item {
      @extend .common-3;

      .left {
        width: 20%;
        position: relative;

        .avatar {
          @include avatar();
        }

        .outline {
          filter: grayscale(100%);
        }
      }

      .right {
        width: 75%;

        .username {
          font-size: 14px;
        }

        .signature {
          font-size: 12px;
          @include ellipsis();
        }
      }
    }
  }

  .reload-btn {
    @extend .common-2;

    button {
      width: 100%;
    }
  }
}
</style>
