import { request } from "./index";
import { UserModel } from "../models/userModel";

export function checkUser(username: string, password: string, onSuccess: (e: Array<UserModel>, status: number) => void, onError?: (e: any) => void) {
  request.post("/login", {
    username, password
  }, {
    withCredentials: true
  }).then(({ data: res }) => {
    if ( res.data.length !== 0 && res.status == 200 ) {
      onSuccess(res.data, res.status);
    } else {
      onError ? onError(res) : "";
    }
  }).catch(err => {
    onError ? onError(err) : "";
  });
}