interface UserModel {
  id?: number;
  is_online?: number;
  socket_id?: string;
  username?: string;
  password?: string;
  phone?: string;
  create_date?: Date;
  birthday?: Date;
  bg_img?: string;
  avatar?: string;
  thumb?: number;
  signature?: string;
  zodiac?: string;
  constellation?: string;
  sex?: string;
}

export default UserModel;
