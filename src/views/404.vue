<template>
  <div class="error-page">
    <p class="tips">
      404！页面未找到！
    </p>
    <p class="btn flex flex-main-justify">
      <a @click="GO(-1)">返回</a>
      <a @click="REPLACE({path: '/main'})">去首页</a>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loading: false,
      loginErr: false,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  created() {

  },
  methods: {
    goIndex() {

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
.error-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-align: center;
  .tips {
    font-size: 60px;
    padding-top: 200px;
  }
  .btn {
    width: 240px;
    margin: 140px auto 0;
    font-size: 30px;
    color: #aaa;
    a {
      border-bottom: 2px solid #aaa;
      padding-bottom: 6px;
    }
  }
}
</style>
