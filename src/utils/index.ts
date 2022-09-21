import { useCookies } from "@vueuse/integrations/useCookies";

interface normalizeCheckedCookieReturn {
  cookie?: any;
  isDefined: boolean;
}

export function checkCookie(name: string): normalizeCheckedCookieReturn {
  let cookieData = <normalizeCheckedCookieReturn>{};
  let localCookies = useCookies().get(name);
  cookieData.isDefined = !!localCookies;
  if (cookieData.isDefined) localCookies.cookie = localCookies;
  return cookieData;
}

export function findElInArray<T>(array: T[], reg: (v: T, i: number, o: T[]) => boolean) {
  return !!array.find(reg);
}

/**
 * 获取与 match 匹配的元素在数组的索引。
 * 
 * @param arr 源数组
 * @param match match 回调回传每轮循环的元素，arr[i].id == 1000，即查询元素中 id 字段等于 1000 的元素索引是多少。
 * @returns 匹配失败返回 -1，否则返回 index。
 */
export function getIndexOfElInArr<T>(arr: T[], match: (arr: T) => boolean): number {
  let index = -1;
  if (arr.length == 0) index = -1;
  else for (let i = 0; i < arr.length; i++) if (match(arr[i])) index = i;
  return index;
}
