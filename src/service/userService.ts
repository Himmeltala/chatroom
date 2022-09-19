import { request } from "@/utils/request";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { UserModel } from "@/models";

function testUserPwdAndUname(data: any) {
  let u = /^[a-zA-Z0-9]{2,14}$/;
  let p = /^[a-zA-Z0-9]{6,16}$/;
  return u.test(data.username) && p.test(data.password);
}

export function checkUserService(data: UserModel) {
  if (!testUserPwdAndUname(data)) {
    ElMessage({ message: "密码或用户名不符合规范！", type: "error" });
  } else {
    request({ method: "post", url: "/login", data, withCredentials: true })
      .then(res => {
        if (res.data.status === 200) {
          ElMessage({ message: "登陆成功！", type: "success" });
          useRouter().push("/chat");
        } else {
          ElMessage({ message: "密码或用户名错误！", type: "error" });
        }
      })
      .catch(err => {
        ElMessage({ message: "密码或用户名错误！", type: "error" });
      });
  }
}

export async function updateUserService(data: UserModel) {
  await request({ method: "post", url: "/update/user", data });
  let reqs = await request.all([
    request({ method: "post", url: "/query/friends", data: { id: data.id } }),
    request({ method: "post", url: "/query/groups", data: { id: data.id } })
  ]);
  return reqs;
}

export async function queryFriendsService(data: UserModel): Promise<any> {
  let res = await request({ method: "post", url: "/query/friends", data });
  if (res.data.status == 200) {
    ElMessage({ message: "好友列表已更新", type: "success" });
  } else {
    ElMessage({ message: "好友列表更新失败", type: "warning" });
  }
  return res;
}

export async function queryGroupsService(data: UserModel): Promise<any> {
  let res = await request({ method: "post", url: "/query/groups", data });
  if (res.data.status == 200) {
    ElMessage({ message: "群聊列表已更新", type: "success" });
  } else {
    ElMessage({ message: "群聊列表更新失败", type: "warning" });
  }
  return res;
}
