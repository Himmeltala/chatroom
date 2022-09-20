import { defineStore } from "pinia";
import { ref } from "vue";
import { TemporaryMessages } from "@/models";
import { getElInArrayIndex } from "@/utils";

export const useBuddyMessagesStore = defineStore("buddyMessagesStore", () => {
  let temporary = ref<TemporaryMessages[]>([]);

  function push(id: any, message: any): void {
    let index = getElInArrayIndex<TemporaryMessages>(temporary.value, arr => arr.id === id);
    if (index === -1) {
      let _data = <TemporaryMessages>{ id: id, messages: [] };
      _data.messages.push(message);
      temporary.value.push(_data);
    } else {
      temporary.value[index].messages.push(message);
    }
  }

  return { temporary, push };
});
