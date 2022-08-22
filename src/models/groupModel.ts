interface GroupModel {
  id: number;
  name: string;
  avatar: string;
  desc: string;
  created_date?: Date;
  room_id?: string;
}

export default GroupModel;
