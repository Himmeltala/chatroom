import { useCookies } from "@vueuse/integrations/useCookies";

/**
 * 检查是否已经登陆过一次，且 Cookie 是否存在，如果存在就导航到聊天室页面。
 */
export function checkCookie(
  cookeName: string,
  res: {
    exsit?: () => any;
    notExsit?: () => any;
  }
): any {
  const cookies = useCookies();
  if (cookies.get(cookeName)) {
    return res.exsit ? res.exsit() : "";
  } else {
    return res.notExsit ? res.notExsit() : "";
  }
}
