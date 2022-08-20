import { useCookies } from "@vueuse/integrations/useCookies";

interface normalizeCheckedCookieReturn {
  cookie?: any;
  isExsit: boolean;
}

interface normalizeExist {
  (e: any): any;
}

export function checkCookie(name: string): normalizeCheckedCookieReturn {
  let result = <normalizeCheckedCookieReturn>{};
  let cookie = useCookies().get(name);
  result.isExsit = cookie ? true : false;
  if (result.isExsit) {
    cookie.cookie = cookie;
  }
  return result;
}
