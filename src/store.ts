import { getIndexOfElInArr } from "@/utils";

function pushMessageToStore(tempMessage: ITemporaryMessage[], message: IMessage, id: any) {
  let index = getIndexOfElInArr<ITemporaryMessage>(tempMessage, arr => arr.id === parseInt(id));
  if (index === -1) {
    let _data = <ITemporaryMessage>{ id: id, messages: [] };
    _data.messages.push(message);
    tempMessage.push(_data);
  } else tempMessage[index].messages.push(message);
}

export const usePrivateMessagesStore = defineStore("PrivateMessagesStore", () => {
  let privateTempMessages = ref<ITemporaryMessage[]>([]);

  /**
   * 给 state 插入一条临时消息
   * @param id 好友 ID
   * @param message 消息实体类接口
   */
  function pushPrivateMessageToStore(id: any, message: IMessage): void {
    pushMessageToStore(privateTempMessages.value, message, id);
  }

  return { privateTempMessages, pushPrivateMessageToStore };
});

export const usePublicMessagesStore = defineStore("PublicMessagesStore", () => {
  let publicTempMessages = ref<ITemporaryMessage[]>([]);

  /**
   * 给 state 插入一条临时消息
   * @param id 群 ID
   * @param message 消息实体类接口
   */
  function pushPublicMessageToStore(id: any, message: IMessage): void {
    pushMessageToStore(publicTempMessages.value, message, id);
  }

  return { publicTempMessages, pushPublicMessageToStore };
});
