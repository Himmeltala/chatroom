export class Message {
  public username: string;
  public avatar: string;
  public id: string;
  public text: string;
  public popColor: string;
  public type?: string;
  public socket_id?: string;

  constructor(username: string, avatar: string, id: string, text: string, popColor: string, type?: string, socket_id?: string) {
    this.username = username;
    this.avatar = avatar;
    this.id = id;
    this.text = text;
    this.popColor = popColor;
    this.type = type;
    this.socket_id = socket_id;
  }
}

export interface ConfigMenusData {
  popColor: string;
}
