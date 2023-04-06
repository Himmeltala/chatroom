export class Message implements IMessage {
  // 用户名
  public username: string;
  // 头像地址
  public avatar: string;
  // 群或用户 ID
  public id: number;
  // 文本消息
  public text: string;
  // 气泡颜色
  public pop_color: string;
  // 本人发送的还是别人发送的消息
  public type?: string;
  // socket 标识符
  public socket_id?: string;

  constructor(username: string, avatar: string, id: number, text: string, pop_color: string, type?: string, socket_id?: string) {
    this.username = username;
    this.avatar = avatar;
    this.id = id;
    this.text = text;
    this.pop_color = pop_color;
    this.type = type;
    this.socket_id = socket_id;
  }
}

export interface ConfigMenusData {
  popColor: string;
}
