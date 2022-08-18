<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { checkUser } from "../apis/userApi";
import { ElMessage } from "element-plus";
import { UserModel } from "../models/userModel";

const router = useRouter();

let data = ref({ username: "", password: "" });

/**
 * 检测用户名或密码是否符合如下规范：
 *
 * 用户名：字母、数字以及下划线，且 2~ 10 个字符之间
 * 密码：字母、数字以及下划线，且 6~16 个字符之间
 *
 * @param data 用户信息
 */
function test(data: any) {
  let p1 = /^[a-zA-Z0-9]{2,14}$/;
  let p2 = /^[a-zA-Z0-9]{6,16}$/;
  return p1.test(data.username) && p2.test(data.password);
}

function onSubmit() {
  if ( !test(data.value) ) {
    ElMessage({ message: "密码或用户名不符合规范！", type: "error" });
  } else {
    checkUser(
        data.value,
        () => {
          ElMessage({ message: "登陆成功！", type: "success" });
          router.push("/chat");
        },
        () => {
          ElMessage({ message: "密码或用户名错误！", type: "error" });
        }
    );
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
        <el-input type="password" show-password v-model="data.password" />
      </div>
      <div class="submit-btn">
        <el-button @click="onSubmit">登陆</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
