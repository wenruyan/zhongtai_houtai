<template>
  <div class="question-mark flex flex-cross-center">
    <span class="question"></span>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss">
.question-mark {
  .question {
    width: 16px;
    height: 16px;
    background-image: url("../assets/img/question.png");
    cursor: pointer;
  }
}
</style>
