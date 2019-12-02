<template>
  <div class="show page-container">
    <Header />
    <div class="content">
      <router-view v-if="routerShow"></router-view>
    </div>
  </div>
</template>

<script>
import Header from "../components/header/Header.vue";

export default {
  name: "app",
  components: {
    Header
  },
  data() {
    return {
      routerShow: false
    };
  },
  methods: {},
  mounted() {
    this.NProgress.done();
    console.log(this.$store.state.companyInfo);
    if (this.$store.state.userInfo.id) {
      this.routerShow = true;
    }
  },
  created() {
    this.$router.beforeEach((to, from, next) => {
      this.NProgress.start();
      next();
    });
    this.$router.afterEach(() => {
      this.NProgress.done();
    });
  },
  computed: {
    companyNo() {
      return this.$store.state.companyInfo.id;
    }
  },
  watch: {
    companyNo() {
      console.log("变了");
      this.routerShow = true;
    }
  }
};
</script>

<style lang="scss">
html,
body,
#app {
  height: 100%;
}
.page-container {
  height: 100%;
  position: relative;
}
.content {
  background-color: #f4f4f4;
  width: 100%;
  height: calc(100vh - 60px);
  overflow-y: auto;
  box-sizing: border-box;
  position: relative;
  top: 60px;
}
.main-content {
  padding-top: 60px;
  .panel {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 10px rgba(5, 16, 91, 0.07);
    opacity: 1;
    border-radius: 20px;
    margin: 0 auto;
    height: calc(100vh - 180px);
  }
}
// 提示
.el-message {
  // width: 198px;
  padding: 0 37px;
  min-width: 198px;
  height: 53px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 5px;
  border: none;
  justify-content: center;
  top: 70px;
  .el-message__content {
    color: #fff !important;
    font-size: 16px;
  }
  .el-icon-success {
    color: #00d151;
  }
  .el-icon-close {
    display: none;
  }
}
</style>
