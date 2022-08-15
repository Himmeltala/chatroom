<script setup lang="ts">
import { ref } from "vue";
import { checkUser } from "../apis/userApi";
import { ElMessage } from "element-plus";

let data = ref({ username: "", password: "" });

/**
 * 检测用户名或密码是否符合如下规范：
 *
 * 用户名：字母、数字以及下划线，且 2~ 10 个字符之间
 * 密码：字母、数字以及下划线，且 6~16 个字符之间
 *
 * @param username 用户名
 * @param password 密码
 */
function test(username: string, password: string) {
  let pattern1 = /^[a-zA-Z\d_-]{2,10}$/;
  let pattern2 = /^[a-zA-Z\d_-]{6,16}$/;
  return pattern1.test(username!) && pattern2.test(password!);
}

/**
 * 点击登录，提交表单
 */
function onSubmit() {
  if ( test(data.value.username, data.value.password) ) {
    ElMessage({ message: "密码或用户名不符合规范！", type: "error" });
  } else {
    checkUser(data.value.username, data.value.password, () => {
      ElMessage({ message: "登陆成功！", type: "success" });
    }, () => {
      ElMessage({ message: "密码或用户名错误！", type: "error" });
    });
  }
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