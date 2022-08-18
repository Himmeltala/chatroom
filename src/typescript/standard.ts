export class Message {
  public username: string;
  public text: string;
  public avatar: string;
  public popColor: string;
  public type?: string;

  constructor(username: string, text: string, avatar: string, popColor: string, type?: string) {
    this.username = username;
    this.text = text;
    this.avatar = avatar;
    this.popColor = popColor;
    this.type = type;
  }
}

export interface ConfigMenusData {
  username: string;
  popColor: string;
  avatar: string;
}
