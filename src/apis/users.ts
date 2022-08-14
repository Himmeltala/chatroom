import { request } from "./index";

export function checkUser(uname: string, pwd: string, onSuccess: Function, onError?: Function) {
  request.get("/query/user/by/key", {
    params: { "uname": uname, "pwd": pwd }
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