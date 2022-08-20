<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { checkUser } from "../apis/userApi";
import { ElMessage } from "element-plus";

const router = useRouter();
let data = ref({ username: "", password: "" });

function test(data: any) {
  let p1 = /^[a-zA-Z0-9]{2,14}$/;
  let p2 = /^[a-zA-Z0-9]{6,16}$/;
  return p1.test(data.username) && p2.test(data.password);
}

function login() {
  if (!test(data.value)) {
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

function logon() {

}
</script>

<template>
  <div class="login">
    <div class="content">
      <div class="input-box uname-int">
        <div class="label">账号</div>
        <input class="input" v-model="data.username" />
      </div>
      <div class="input-box pwd-int">
        <div class="label">密码</div>
        <input type="password" class="input" v-model="data.password" />
      </div>
      <div class="submit-btn">
        <el-button class="btn" @click="logon">注册</el-button>
        <el-button class="btn" type="primary" @click="login">登陆</el-button>
      </div>
      <div class="other-box">

      </div>
    </div>
  </div>
</template>

<style scoped>
.login {
  width: 100%;
  height: 100%;
}

.login,
.input-box,
.submit-btn,
.input-box>.label {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
}

.content {
  background-color: white;
  width: 400px;
  border-radius: 10px;
  border: 1px solid #E7E7E7;
  padding: 75px 60px;
}

.input-box {
  margin-bottom: 40px;
  border: 1px solid #E7E7E7;
  padding: 10px 10px;
  border-radius: 10px;
}

.input-box>.label {
  width: 15%;
  height: 25px;
}

.input-box>.input {
  width: 85%;
  border: 0;
  outline: none;
  height: 25px;
  font-size: 16px;
}

.submit-btn>button {
  width: 50%;
  height: 40px;
  font-size: 16px;
}
</style>
