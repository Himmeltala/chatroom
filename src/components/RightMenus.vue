<script setup lang="ts">
import { UserModel } from "../models/userModel";

defineProps({
  data: {
    type: Array <UserModel>
  }
});

function selectedUser(item: UserModel) {

}
</script>

<template>
  <div class="right-menus">
    <div class="friends">
      <template v-for="item in data">
        <div class="item" @click="selectedUser(item)">
          <div class="left">
            <div class="status" v-if="item.is_online !== 0"></div>
            <img class="avatar" :src="item.avatar" :class="item.is_online === 0 ? 'outline': ''" alt="avatar" />
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

<style scoped>
.friends {
  padding: 10px;
  box-sizing: border-box;
}

.item {
  margin-bottom: 15px;
  width: 170px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}

.username {
  font-size: 14px;
}

.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.outline {
  filter: grayscale(100%);
}

.left {
  width: 20%;
  position: relative;
}

.status {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #54ED39;
  right: 0;
  bottom: 0;
}

.right {
  width: 75%;
}

.signature {
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>