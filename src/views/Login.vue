<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useCookies } from "@vueuse/integrations/useCookies";
import { checkUser } from "../apis/userApi";
import { ElMessage } from "element-plus";

const router = useRouter();

let data = ref({ username: "", password: "" });

/**
 * 查询 storage 是否存在用户的id，不存在说明没有登陆，没有登陆就不跳转到 /chat。
 */
onMounted(() => {
  const cookies = useCookies();
  if (cookies.get("USERID")) {
    router.push("/chat");
  }
});

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
  let p1 = /^[a-zA-Z\d_-]{2,10}$/;
  let p2 = /^[a-zA-Z\d_-]{6,16}$/;
  return p1.test(username) && p2.test(password);
}

/**
 * 点击登录，提交表单
 */
function onSubmit() {
  if (test(data.value.username, data.value.password)) {
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
