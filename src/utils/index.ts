import { useCookies } from "@vueuse/integrations/useCookies";

interface checkCookieReturn {
  callback: any;
  isExsit: boolean;
}

/**
 * 检查 Cookie 是否存在，走对应的回调函数。
 *
 * 1. 回调函数可以直接返回对应的处理结果，比如字符串，这很适用于 Router 的 Redirect 字段。
 * 2. 对于不直接返回字符串，直接使用 Router 进行路由跳转。
 *
 * @param cookeName Cookie 的名称。
 * @param callback 回调函数，存在走 exist，不存在走 notExsit。
 * @returns 返回结果都是 any 是避免对于第一种情况，Vue 报类型错误。
 */
export function checkCookie(cookeName: string, callback?: { exist?: () => any; none?: () => any }): checkCookieReturn {
  let result = <checkCookieReturn>{};
  result.isExsit = useCookies().get(cookeName);
  if ( result.isExsit ) {
    result.callback = callback?.exist ? callback?.exist() : "";
  } else {
    result.callback = callback?.none ? callback?.none() : "";
  }
  return result;
}
