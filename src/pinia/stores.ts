import { defineStore } from "pinia";
import { ref } from "vue";
import { ITemporaryMessage, IMessage } from "@/types";
import { getIndexOfElInArr } from "@/utils";

export const usePrivateMessagesStore = defineStore("PrivateMessagesStore", () => {
  let privateTempMessages = ref<ITemporaryMessage[]>([]);

  /**
   * 给 state 插入一条临时消息
   * @param id 好友 ID
   * @param message 消息实体类接口
   */
  function pushPrivateMessageToStore(id: any, message: IMessage): void {
    let index = getIndexOfElInArr<ITemporaryMessage>(privateTempMessages.value, arr => arr.id == parseInt(id));
    if (index == -1) {
      let _data = <ITemporaryMessage>{ id: id, messages: [] };
      _data.messages.push(message);
      privateTempMessages.value.push(_data);
    } else privateTempMessages.value[index].messages.push(message);
  }

  return { privateTempMessages, pushPrivateMessageToStore };
});
