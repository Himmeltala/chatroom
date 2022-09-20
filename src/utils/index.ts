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

export function getElInArrayIndex<T>(arr: T[], reg: (arr: T) => boolean): number {
  let index = -1;
  if (arr.length === 0) index = -1;
  else {
    for (let i = 0; i < arr.length; i++) if (reg(arr[i])) index = i;
  }
  return index;
}
