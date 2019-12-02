<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  created() {
    let LoadingEle = document.getElementById('Loading')
    if (LoadingEle) {
      document.body.removeChild(LoadingEle)
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Microsoft YaHei";
  height: 100%;
  width: 100%;
  min-width: 1200px;
  .main-content {
    &>.panel {
      width: 1200px;
      height: 800px;
    }
    .public-header {
      height: 76px;
      line-height: 76px;
      color: #05105B;
      font-size: 24px;
      font-weight: bold;
      border-bottom: 1px solid #DDE7FF;
      padding: 0 20px;
    }
  }
}
.btn-style-1 {
  background-color: #387DFF;
  color: #FFFFFF!important;
  transition: all 0.3s!important;
  &:hover {
    background-color: #9CBEFF!important;
    border-color: #9CBEFF!important;
  }
}
.btn-style-2 {
  border-radius:5px;
  border: 1px solid #1C60FF!important;
  background-color: #E5EDFF!important;
  color: #387DFF!important;
  transition: all 0.3s!important;
  &:hover {
    background-color: #F2F6FF!important;
    border-color: #9CBEFF!important;
    color: #9CBEFF!important;
  }
}
</style>
