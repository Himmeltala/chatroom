import { request } from "./index";
import { AxiosRequestConfig } from "axios";
import { UserModel } from "../models/userModel";

interface NormalizeAxiosRequestOnSuccess {
  (...arg: any): void;
}

interface NormalizeAxiosRequestOnError {
  (...arg: any): void;
}

interface NormalizeAxiosOptions<D> {
  url: string;
  data?: D;
  config?: AxiosRequestConfig;
}

function axiosGetNormalization<D>(options: NormalizeAxiosOptions<D>, onSuccess?: NormalizeAxiosRequestOnSuccess, onError?: NormalizeAxiosRequestOnError, cluase?: (data: any) => boolean): void {
  request
    .get(options.url, options.config)
    .then(({ data }) => {
      if (data.status == 200 && (cluase ? cluase(data) : true)) {
        onSuccess ? onSuccess(data) : "";
      } else {
        onError ? onError(data) : "";
      }
    })
    .catch((err) => {
      onError ? onError(err) : "";
    });
}

function axiosPostNormalization<D>(options: NormalizeAxiosOptions<D>, onSuccess?: NormalizeAxiosRequestOnSuccess, onError?: NormalizeAxiosRequestOnError, cluase?: (data: any) => boolean): void {
  request
    .post(options.url, options.data, options.config)
    .then(({ data }) => {
      if (data.status == 200 && (cluase ? cluase(data) : true)) {
        onSuccess ? onSuccess(data) : "";
      } else {
        onError ? onError(data) : "";
      }
    })
    .catch((err) => {
      onError ? onError(err) : "";
    });
}

export function checkUser(data: UserModel, onSuccess?: NormalizeAxiosRequestOnSuccess, onError?: NormalizeAxiosRequestOnError) {
  axiosPostNormalization({ url: "/login", data: data, config: { withCredentials: true } }, onSuccess, onError, (condition) => condition.data.length !== 0);
}

export function updateUser(data: UserModel, onSuccess?: NormalizeAxiosRequestOnSuccess, onError?: NormalizeAxiosRequestOnError) {
  axiosPostNormalization({ url: "/update/user", data: data }, onSuccess, onError);
}

export function queryFriends(data: UserModel, onSuccess: NormalizeAxiosRequestOnSuccess, onError?: NormalizeAxiosRequestOnError) {
  axiosPostNormalization({ url: "/query/friends", data: data }, onSuccess, onError);
}
