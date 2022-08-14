<script setup lang="ts">
import { ref } from "vue";
import { checkUser } from "../apis/users";
import { ElMessage } from "element-plus";

let data = ref({ username: "", password: "" });

function onSubmit() {
  checkUser(data.value.username, data.value.password, () => {

  }, () => {
    ElMessage({ message: "密码或用户名错误！", type: "error" });
  });
}
</script>

<template>
  <div class="login">
    <div class="content">
      <div class="input uname-int">
        <el-input v-model="data.username" />
      </div>
      <div class="input pwd-int">
        <el-input v-model="data.password" />
      </div>
      <div class="submit-btn">
        <el-button @click="onSubmit">登陆</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>