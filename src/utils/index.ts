import { useCookies } from "@vueuse/integrations/useCookies";

interface normalizeCheckedCookieReturn {
  cookie?: any;
  isDefined: boolean;
}

export function checkCookie(name: string): normalizeCheckedCookieReturn {
  let cookieData = <normalizeCheckedCookieReturn>{};
  let localCookies = useCookies().get(name);
  cookieData.isDefined = !!localCookies;
  if (cookieData.isDefined) {
    localCookies.cookie = localCookies;
  }
  return cookieData;
}

export function findElInArray<T>(array: T[], reg: (v: T, i: number, o: T[]) => boolean) {
  return !!array.find(reg);
}

// 1. [{id: 0, data: []}, {id: 1, data: []}]
// 2. 点击一个聊天界面，得到 id，id 所对应的在数组中的 index 是多少，才能 push。
// 3. 循环数组，匹配 id 是否相等，相等返回 index，不相等返回 undefined 或 0。
export function getElInArrayIndex<T>(arr: T[], reg: (arr: T) => boolean): number {
  let index = -1;
  if (arr.length === 0) {
    index = -1;
  } else {
    for (let i = 0; i < arr.length; i++) {
      if (reg(arr[i])) {
        index = i;
      }
    }
  }
  return index;
}
