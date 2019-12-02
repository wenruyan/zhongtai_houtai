<template>
  <div class="login-page">
    <div class="gray-bg">
      <div class="banner">
        <p class="title">专属您的</p>
        <p class="title">企业员工福利卡</p>
        <p class="title-content">员工爱公司爱工作就靠这张卡员工爱公司爱工作就靠这张卡员工爱公司爱工作就</p>
      </div>
      <div class="login-wrap">
        <h3 :class="{'noErr': loginErr == 1}">登录</h3>
        <transition name="el-zoom-in-center">
          <div class="err-tips flex flex-cross-center" v-show="loginErr != 1">
            <i class="fa fa-minus-circle"></i>
            {{loginErr == 2 ? '账号输入错误请重试' : '密码输入错误请重试'}}
          </div>
        </transition>
        <!-- <el-form :model="loginForm" :rules="rules" ref="loginForm"> -->
        <el-form :model="loginForm" ref="loginForm">
          <el-form-item prop="username">
            <el-input
              :class="{'isErr': loginErr == 2}"
              v-model="loginForm.username"
              @focus="inputFocus"
              placeholder="用户名"
              suffix-icon="fa fa-user"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :class="{'isErr': loginErr == 3}"
              v-model="loginForm.password"
              @focus="inputFocus"
              type="password"
              placeholder="密码"
              suffix-icon="fa fa-lock"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          class="btn-style-1"
          type="primary"
          :loading="loading"
          @keyup.enter.native="login"
          @click="login"
        >登录</el-button>
        <div class="contact noselect" @click="changeContactInfo">联系客服</div>
        <transition name="el-zoom-in-center">
          <div class="ercode" v-show="showContactInfo">
            <img
              src="https://www.focus-base.com/cdn/template/e6f2eb3ba85170e8e86fac553653608.jpg"
              alt
            />
          </div>
        </transition>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from "../components/footer/Footer";
export default {
  components: {
    Footer
  },
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loading: false,
      loginErr: 1,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      showContactInfo: false
    };
  },
  created() {
    document.onkeydown = e => {
      // 全局监听enter按键
      if (e.keyCode == 13 && this.$route.name == "login") {
        this.login();
      }
    };
  },
  methods: {
    login() {
      this.$refs["loginForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          let param = {
            loginName: this.loginForm.username,
            loginPwd: this.loginForm.password
          };
          if (this.loginForm.username == "") {
            this.$message({
              message: "用户名不能为空",
              type: "warning"
            });
            this.loading = false;
          } else if (this.loginForm.password == "") {
            this.$message({
              message: "密码不能为空",
              type: "warning"
            });
            this.loading = false;
          } else {
            this.$http
              .post("/focus.loginAction", param)
              .then(res => {
                // console.log('res', res);
                if (res.code == 200) {
                  this.$store.commit("updateUserInfo", res.data[0]);
                  this.$message({
                    showClose: true,
                    message: "登录成功",
                    type: "success"
                  });
                  setTimeout(() => {
                    if (res.data[0].loginNum == "1") {
                      this.$store.commit("updateIsFirstLogin", "1");
                    }
                    console.log("hahahahaha");
                    this.$http
                      .post("/focus.findCompany", {})
                      .then(res => {
                        console.log("findCompany", res);
                        this.$store.commit("updateCompanyInfo", res.data);
                        this.PUSH({ name: "main-leye-myWork" });
                      })
                      .catch(err => {
                        console.log("err", err);
                      });
                  }, 300);
                } else if (res.code == 1001) {
                  if (res.errorCode == 701) {
                    // 用户名错误
                    this.loginErr = 2;
                    this.loading = false;
                  } else if (res.errorCode == 702) {
                    // 密码错误
                    this.loginErr = 3;
                    this.loading = false;
                  } else {
                    // 默认。用户名或密码错误
                    this.loginErr = 2;
                    this.loading = false;
                  }
                }
              })
              .catch(err => {
                console.log("err", err);
                this.loading = false;
              });
          }
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    changeContactInfo() {
      this.showContactInfo = !this.showContactInfo;
    },
    inputFocus() {
      this.loginErr = 1;
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
.login-page {
  width: 100%;
  min-width: 1200px;
  height: 100%;
  background-image: url("../assets/img/login_bg-1.png");
  background-size: cover;
  overflow: auto;
  .gray-bg {
    width: 1200px;
    margin: 128px auto 0;
    // height: calc(100% - 256px);
    background-color: #f4f4f4;
    border-radius: 10px;
    overflow: hidden;
    .banner {
      width: 570px;
      height: 510px;
      background-image: url("../assets/img/login_bg_small.png");
      margin: 95px 0 95px 100px;
      overflow: hidden;
      border-radius: 40px;
      float: left;
      padding: 120px 197px 0 73px;
      color: #fff;
      .title {
        font-size: 32px;
        margin-bottom: 20px;
      }
      .title-content {
        font-size: 12px;
        line-height: 25px;
        opacity: 0.8;
      }
    }
  }
  .login-wrap {
    float: left;
    width: 360px;
    margin: 120px 0 0 53px;
    text-align: center;
    h3 {
      font-size: 40px;
      font-weight: bold;
      color: #091d40;
      &.noErr {
        margin-bottom: 49px;
      }
    }
    img {
      margin-bottom: 23px;
    }
    .el-form-item {
      margin-bottom: 15px;
    }
    .el-input {
      .el-input__suffix {
        color: #dcdcdc;
      }
      &.isErr input {
        border-color: #ff4343;
        color: #ff4343;
      }
      input {
        height: 50px;
        line-height: 50px;
        background-color: #ffffff !important;
        border-color: #e9e9e9;
        color: #333333;
        caret-color: #387dff;
        &::-webkit-input-placeholder {
          color: #999999;
        }
        &:focus {
          border-color: #387dff;
          &::-webkit-input-placeholder {
            color: #333333;
          }
        }
      }
    }
    .el-button {
      width: 100%;
      padding: 15px 20px;
      background-color: #387dff;
      box-shadow: 0px 6px 10px rgba(188, 195, 255, 1);
      border-radius: 5px;
      font-size: 18px;
      font-family: Microsoft YaHei UI;
      font-weight: 400;
      margin-top: 25px;
    }
    .contact {
      color: #387dff;
      font-size: 13px;
      font-weight: 500;
      margin-top: 14px;
      cursor: pointer;
    }
    .ercode {
      margin-top: 14px;
      img {
        width: 100px;
        height: 100px;
      }
    }
    .err-tips {
      width: 100%;
      height: 46px;
      line-height: 46px;
      background-color: #ffd8d8;
      border-radius: 5px;
      border: 1px solid #ff4343;
      margin-top: 23px;
      margin-bottom: 12px;
      font-size: 16px;
      font-weight: 400;
      position: relative;
      .fa {
        color: #cc4946;
        font-size: 22px;
        margin: 0 12px 0 31px;
      }
    }
  }
}
</style>
