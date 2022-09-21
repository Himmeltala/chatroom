<template>
  <div class="messages">
    <template v-if="data">
      <div v-if="defineType === type" class="msg-item" :class="item.type" v-for="(item, key) in data" :key="key">
        <template v-if="item.type === 'self'">
          <div class="left">
            <div v-if="type === 'public'" class="msg-holder">{{ item.username }}</div>
            <div class="msg-pop" :style="{ '--pop-color': item.pop_color }">{{ item.text }}</div>
          </div>
          <div class="right"><img class="avatar" :src="item.avatar" alt="oops!" /></div>
        </template>
        <template v-else>
          <div class="left"><img class="avatar" :src="item.avatar" alt="oops!" /></div>
          <div class="right">
            <div v-if="type === 'public'" class="msg-holder">{{ item.username }}</div>
            <div class="msg-pop" :style="{ '--pop-color': item.pop_color }">{{ item.text }}</div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { IMessage } from "@/types";

defineProps({
  data: {
    type: Array<IMessage>
  },
  defineType: {
    validator(value: string) {
      return ["public", "private"].includes(value);
    }
  },
  type: {
    validator(value: string) {
      return ["public", "private"].includes(value);
    }
  }
});
</script>

<style lang="scss" scoped>
.messages {
  .msg-item {
    display: flex;
    margin-top: 20px;

    &:last-child {
      margin-bottom: 20px;
    }

    .msg-pop {
      position: relative;
      width: auto;
      margin-top: 5px;
      padding: 10px 10px;
      box-sizing: border-box;
      background-color: var(--pop-color);
      border-radius: $border-radius-large;

      word: {
        break: break-word;
        wrap: break-word;
      }
    }

    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }

    .msg-holder {
      text-align: right;
    }
  }

  .self {
    justify-content: flex-end;

    &.msg-item {
      padding: {
        right: 20px;
        left: 50px;
      }
    }

    .right {
      text-align: right;
      width: 12%;
    }

    .left {
      width: 88%;

      @include flex($align-items: flex-end) {
        flex-direction: column;
      }
    }

    .msg-pop::after {
      position: absolute;
      content: "";
      top: 10px;
      right: -10px;

      border: {
        top: 2px solid transparent;
        left: 12px solid var(--pop-color);
        bottom: 10px solid transparent;
      }
    }
  }

  .others {
    justify-content: flex-start;

    &.msg-item {
      padding: {
        right: 50px;
        left: 20px;
      }
    }

    .left {
      width: 12%;
    }

    .right {
      width: 88%;

      @include flex($align-items: flex-start) {
        flex-direction: column;
      }
    }

    .msg-pop::before {
      position: absolute;
      content: "";
      top: 10px;
      left: -10px;

      border: {
        top: 2px solid transparent;
        right: 12px solid var(--pop-color);
        bottom: 10px solid transparent;
      }
    }
  }
}
</style>
