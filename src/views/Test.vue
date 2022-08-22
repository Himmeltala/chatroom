<script setup lang="ts"></script>

<template>
  <div class="test">
    <div class="normal skill web">Hello Web!</div>
    <div class="normal skill js">Hello JavaScript!</div>
    <div class="normal skill html">Hello HTML!</div>
    <div class="normal skill css">Hello CSS!</div>
    <div class="skill particular">Hello Sass!</div>
  </div>
</template>

<style scoped lang="scss">
.test {
  .normal {
    color: blueviolet;
    font-size: 16px;
  }

  .normal.skill {
    background-color: aqua;
  }

  .particular {
    @extend .normal;
    font-weight: bold;
  }
}
</style>
