export class Message {
  public username: string;
  public text: string;
  public avatar: string;
  public popColor: string;
  public type?: string;
  public socket_id?: string;

  constructor(username: string, text: string, avatar: string, popColor: string, type?: string, socketId?: string) {
    this.username = username;
    this.text = text;
    this.avatar = avatar;
    this.popColor = popColor;
    this.type = type;
    this.socket_id = socketId;
  }
}

export interface ConfigMenusData {
  popColor: string;
}
