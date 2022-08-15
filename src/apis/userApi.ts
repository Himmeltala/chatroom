import { request } from "./index";
import { UserModel } from "../models/userModel";

export function checkUser(username: string, password: string, onSuccess: (e: UserModel) => void, onError?: (e: any) => void) {
  request.post("/query/user/by/key", {
    username, password
  }).then(({ data }) => {
    if ( data.length !== 0 ) {
      onSuccess(data);
    } else {
      onError ? onError(data) : "";
    }
  }).catch(err => {
    onError ? onError(err) : "";
  });
}