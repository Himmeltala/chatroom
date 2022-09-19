<script setup lang="ts">
import { ref } from "vue";
import { checkUserService } from "../service/userService";

let user = ref({ username: "", password: "" });

function logon() {}
</script>

<template>
  <div class="login">
    <div class="content">
      <div class="input-box uname-int">
        <div class="label">账号</div>
        <input class="input" v-model="user.username" />
      </div>
      <div class="input-box pwd-int">
        <div class="label">密码</div>
        <input type="password" class="input" v-model="user.password" />
      </div>
      <div class="submit-btn">
        <el-button class="btn" @click="logon">注册</el-button>
        <el-button class="btn" type="primary" @click="checkUserService(user)">登陆</el-button>
      </div>
      <div class="other-box"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login {
  width: 100%;
  height: 100%;

  .content {
    background-color: white;
    width: 400px;
    border-radius: $border-radius-large;
    border: 1px solid $border-color;
    padding: 75px 60px;

    .input-box {
      margin-bottom: 40px;
      border: 1px solid $border-color;
      padding: 10px 10px;
      border-radius: $border-radius-large;

      .label {
        width: 15%;
        height: 25px;
      }

      .input {
        width: 85%;
        border: 0;
        outline: none;
        height: 25px;
        font-size: 16px;
      }
    }

    .submit-btn {
      button {
        width: 50%;
        height: 40px;
        font-size: 16px;
      }
    }
  }
}

.login,
.input-box,
.submit-btn,
.input-box > .label {
  @include flex();
}
</style>
