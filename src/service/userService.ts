import { request } from "@/utils/request";

function checkFormat(user: IUser) {
  let u = /^[a-zA-Z0-9]{2,14}$/;
  let p = /^[a-zA-Z0-9]{6,16}$/;
  return u.test(user.username!) && p.test(user.password!);
}

export async function checkUserService(user: IUser): Promise<boolean> {
  let passport = false;
  if (!checkFormat(user)) {
    ElMessage({ message: "密码或用户名不符合规范！", type: "error" });
  } else {
    let { data: res } = await request({ method: "post", url: "/login", data: user, withCredentials: true });
    if (res.status === 200) {
      ElMessage({ message: "登陆成功！", type: "success" });
      passport = true;
    } else {
      ElMessage({ message: "密码或用户名错误！", type: "error" });
    }
  }
  return passport;
}

/**
 * 查询好友列表和群聊列表，并更新用户在线状态
 * @param user 用户实体类
 * @returns 返回好友列表以及群聊列表
 */
export async function queryFriendAndGroupService(user: IUser) {
  let response = await request.all([
    request({ method: "post", url: "/query/friends", data: { id: user.id } }),
    request({ method: "post", url: "/query/groups", data: { id: user.id } }),
    request({ method: "post", url: "/update/user", data: user })
  ]);
  return response;
}

export async function queryFriendsService(user: IUser): Promise<any> {
  let response = await request({ method: "post", url: "/query/friends", data: user });
  if (response.data.status == 200) {
    ElMessage({ message: "好友列表已更新", type: "success" });
  } else {
    ElMessage({ message: "好友列表更新失败", type: "warning" });
  }
  return response;
}

export async function queryGroupsService(user: IUser): Promise<any> {
  let response = await request({ method: "post", url: "/query/groups", data: user });
  if (response.data.status == 200) {
    ElMessage({ message: "群聊列表已更新", type: "success" });
  } else {
    ElMessage({ message: "群聊列表更新失败", type: "warning" });
  }
  return response;
}
