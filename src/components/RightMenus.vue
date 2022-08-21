<script setup lang="ts">
import { UserModel } from "../models/userModel";
import { ElMessage } from "element-plus";

defineProps({
  data: {
    type: Array<UserModel>
  },
  width: {
    type: String,
    default: "20%"
  }
});

const emits = defineEmits<{
  (e: "onSelectFriend", value: UserModel): void;
  (e: "onReload"): void
}>();

function selectFriend(item: UserModel) {
  emits("onSelectFriend", item);
}

function reload() {
  emits("onReload");
  ElMessage({ message: "好友列表已更新", type: "success" });
}
</script>

<template>
  <div class="right-menus" :style="{ 'width': width }">
    <div class="friends">
      <div class="reload-btn">
        <el-button plain size="small" @click="reload">刷新好友列表</el-button>
      </div>
      <template v-for="item in data">
        <div class="item" @click="selectFriend(item)">
          <div class="left">
            <div class="status" v-if="item.is_online !== 0"></div>
            <img class="avatar" :src="item.avatar" :class="item.is_online === 0 ? 'outline' : ''" alt="avatar" />
          </div>
          <div class="right">
            <div class="username">{{ item.username }}</div>
            <div class="signature">{{ item.signature }}</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.right-menus {
  height: 100%;

  border: {
    radius: $border-radius-small;
    style: solid;
    width: 1px;
    color: $border-color;
    top-width: 1px;
    bottom-width: 1px;
    right-width: 1px;
    left-width: 0;
  }

  .friends {
    padding: 10px;
    box-sizing: border-box;
  }

  .item,
  .reload-btn {
    margin-bottom: 15px;
  }

  .reload-btn {
    &>button {
      width: 100%;
    }
  }

  .item {
    margin-bottom: 15px;
    @include flex(space-between);

    .left {
      width: 20%;
      position: relative;

      .status {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #54ED39;
        position: absolute;
        right: 0;
        bottom: 0;
      }

      .avatar {
        width: 35px;
        height: 35px;
        border-radius: 50%;
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
</style>