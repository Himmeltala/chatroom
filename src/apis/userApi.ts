import { request } from "./index";
import { UserModel } from "../models/userModel";

export function checkUser(data: UserModel, onSuccess: (e: Array<UserModel>, status: number) => void, onError?: (e: any) => void) {
  request
    .post("/login", data, {
      withCredentials: true,
    })
    .then(({ data: res }) => {
      if (res.data.length !== 0 && res.status == 200) {
        onSuccess(res.data, res.status);
      } else {
        onError ? onError(res) : "";
      }
    })
    .catch((err) => {
      onError ? onError(err) : "";
    });
}

export function updateUser(data: UserModel, onSuccess: () => void, onError: () => void) {
  request
    .post("/update/user", data)
    .then(({ data: res }) => {
      if (res.status == 200) {
        onSuccess();
      } else {
        onError();
      }
    })
    .catch((res) => {
      onError();
    });
}

export function queryFriends(data: UserModel, onSuccess: (e: Array<UserModel>) => void, onError?: () => void) {
  request
    .post("/query/friends", data)
    .then(({ data: res }) => {
      if (res.status == 200) {
        onSuccess(res.data);
      } else {
        onError ? onError() : "";
      }
    })
    .catch((res) => {
      onError ? onError() : "";
    });
}
