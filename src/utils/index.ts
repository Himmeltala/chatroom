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
