<template>
  <div class="main-content my-work">
    <div class="panel">
      <header class="flex flex-main-justify flex-cross-center">
        <h2>我的工作台</h2>
        <use-desc></use-desc>
      </header>
      <div class="body" @mouseover="sndShow = false">
        <div class="top">
          <div class="t-cont flex flex-main-justify">
            <div class="flex t-left flex-cross-center">
              <img :src="data.url" v-if="data.url" alt />
              <img src="../../assets/img/mologo.png" v-else alt />
              <div>
                <h4>欢迎回来！</h4>
                <p class="company-name">{{data.company}}</p>
              </div>
              <span
                class="editor-btn btn btn-style-2"
                @click="PUSH({name: 'main-leye-editInfo',query:{save: '2'}})"
              >编辑公司信息</span>
            </div>
            <div class="t-right flex">
              <div class="t-r-left">
                <p class="num">{{data.staffrate}}</p>
                <div class="desc flex flex-cross-center">
                  <span>当前员工数</span>
                  <img
                    class="question"
                    src="../../assets/img/question.png"
                    alt
                    @mouseover.stop="sndShow = true"
                  />
                  <div class="staff-num-desc" v-show="sndShow" @mouseover.stop="sndShow = true">
                    <p>前面的数字为当前有效员工</p>
                    <p>后面的数字为上传的所有员工数包括被冻结的员工</p>
                  </div>
                </div>
              </div>
              <div class="t-r-right">
                <p class="num">{{data.qynum}}</p>
                <p class="desc">当前权益数</p>
              </div>
            </div>
          </div>
        </div>
        <div class="center flex">
          <div class="c-one flex">
            <h4>乐业卡链接</h4>
            <div class="input flex flex-main-justify">
              <span class="leye-url">{{leyeUrl}}</span>
              <input id="copyObj" :value="leyeUrl" />
              <span class="operate" @click="copyTxt(leyeUrl)">复制</span>
            </div>
          </div>
          <div class="c-one flex">
            <h4>邀请码</h4>
            <div class="input flex flex-main-justify">
              <span>{{data.invitationcode}}</span>
              <span class="operate" @click="showChangeCodeModal" v-show="data.isedit == '10'">修改</span>
            </div>
          </div>
        </div>
        <div class="bottom flex">
          <div class="b-one flex flex-dir-top flex-cross-center">
            <div class="decorate"></div>
            <h4>编辑乐业卡</h4>
            <p class="b-o-desc">快速创建专属乐业卡</p>
            <p class="link btn" @click="PUSH({name: 'main-leye-editInfo'})">点击进入 ></p>
          </div>
          <div class="b-one flex flex-dir-top flex-cross-center">
            <div class="decorate"></div>
            <h4>员工管理</h4>
            <p class="b-o-desc">管理员工列表或审核员工信息</p>
            <p class="link btn" @click="goStaffManage">点击进入 ></p>
          </div>
        </div>
      </div>
    </div>
    <!-- 修改邀请码 -->
    <div class="modal change-code-modal" v-show="changeCodeModalShow">
      <div class="modal-content">
        <div class="m-c-header flex flex-main-justify flex-cross-center">
          <h4>修改邀请码</h4>
          <span class="el-icon-close" @click="hideChangeCodeModal"></span>
        </div>
        <div class="m-c-cont flex flex-dir-top flex-cross-center">
          <p class="tip" v-show="tipShow">此邀请码已存在</p>
          <div class="input flex flex-cross-center">
            <span>邀请码</span>
            <el-input
              v-model="data.invitationcode"
              placeholder="请输入内容"
              class="flex-1"
              :class="{'tip-show':tipShow}"
            ></el-input>
          </div>
          <p class="m-c-c-desc">*请谨慎操作邀请码仅可修改一次</p>
          <div class="operation flex flex-main-justify">
            <span class="btn-style-2" @click="hideChangeCodeModal">取消</span>
            <span class="btn-style-1" @click="showConfirmChangeCodeModal">保存</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 第一次进入 -->
    <div class="modal first-in-modal" v-show="firstInModalShow">
      <div class="modal-content flex flex-dir-top flex-cross-center">
        <img src="../../assets/img/first-in.png" alt />
        <h4>欢迎来到乐业卡</h4>
        <h5>是否要现在创建乐业卡</h5>
        <div class="operation flex flex-main-justify">
          <span class="btn-style-2" @click="firstInModalShow = false">不需要</span>
          <span class="btn-style-1" @click="PUSH({name: 'main-leye-editInfo'})">马上开始</span>
        </div>
      </div>
    </div>
    <!-- 确认修改邀请码 -->
    <div class="modal confirm-change-code-modal" v-show="confirmChangeModeModalShow">
      <div class="modal-content">
        <div class="m-c-header flex flex-main-justify flex-cross-center">
          <h4>确认修改邀请码</h4>
          <span class="el-icon-close"></span>
        </div>
        <div class="m-c-cont">
          <p>
            要修改将邀请码修改为
            <span>{{data.invitationcode}}</span>
          </p>
          <p>仅可修改一次请谨慎操作</p>
          <div class="operation flex flex-main-justify">
            <span class="btn-style-2" @click="hideComfirmChangeModal">取消</span>
            <span class="btn-style-1" @click="changeCode">确定</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useDesc from "../../components/useDesc";
export default {
  data() {
    return {
      sndShow: false,
      changeCodeModalShow: false,
      firstInModalShow: false,
      confirmChangeModeModalShow: false,
      codeVal: "focusVIP",
      tipShow: false,
      leyeUrl: "",
      data: {},
      originCode: ""
    };
  },
  components: { useDesc },
  computed: {},
  watch: {},
  methods: {
    goStaffManage() {
      this.$store.commit("updateActiveIndex", "1");
      this.PUSH({ name: "main-leye-staffManage" });
    },
    hideComfirmChangeModal() {
      this.confirmChangeModeModalShow = false;
      this.data.invitationcode = this.originCode;
    },
    changeCompanyInfo() {
      this.$http
        .post("/focus.findCompany", {})
        .then(res => {
          console.log("findCompany", res);
          this.data = res.data;
          this.$store.commit("updateCompanyInfo", res.data);
        })
        .catch(err => {
          console.log("err", err);
        });
      this.$http
        .post("/focus.middleGroundParam", {})
        .then(res => {
          console.log("middleGroundParam", res);
          this.leyeUrl = res.data.leyeH5lUrl;
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    showConfirmChangeCodeModal() {
      this.$http
        .post("/focus.codeIsRepeat", {
          id: this.data.id,
          invitationcode: this.data.invitationcode
        })
        .then(res => {
          console.log("codeIsRepeat", res);
          if (res.data.codeIsRepeat != "0") {
            this.tipShow = true;
          } else {
            this.changeCodeModalShow = false;
            this.confirmChangeModeModalShow = true;
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    // 修改邀请码
    changeCode() {
      this.$http
        .post("/focus.saveUpdateCompany", {
          id: this.data.id,
          invitationcode: this.data.invitationcode
        })
        .then(res => {
          console.log("saveUpdateCompany", res);
          if (res.code == "200") {
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.confirmChangeModeModalShow = false;
            this.changeCompanyInfo();
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    showChangeCodeModal() {
      this.tipShow = false;
      this.originCode = this.data.invitationcode;
      this.changeCodeModalShow = true;
    },
    hideChangeCodeModal() {
      this.data.invitationcode = this.originCode;
      this.changeCodeModalShow = false;
    },
    // 复制
    copyTxt(text) {
      // 数字没有 .length 不能执行selectText 需要转化成字符串
      const textString = text.toString();
      let input = document.querySelector("#copyObj");
      input.value = textString;
      // ios必须先选中文字且不支持 input.select();
      selectText(input, 0, textString.length);
      console.log(document.execCommand("copy"), "execCommand");
      if (document.execCommand("copy")) {
        document.execCommand("copy");
        // alert("已复制到粘贴板");
      }
      input.blur();

      // input自带的select()方法在苹果端无法进行选择，所以需要自己去写一个类似的方法
      // 选择文本。createTextRange(setSelectionRange)是input方法
      function selectText(textbox, startIndex, stopIndex) {
        if (textbox.createTextRange) {
          // ie
          const range = textbox.createTextRange();
          range.collapse(true);
          range.moveStart("character", startIndex); // 起始光标
          range.moveEnd("character", stopIndex - startIndex); // 结束光标
          range.select(); // 不兼容苹果
        } else {
          // firefox/chrome
          textbox.setSelectionRange(startIndex, stopIndex);
          textbox.focus();
        }
      }
      this.$message({ type: "success", message: "复制成功" });

      // 复制文字
      // 必须手动触发 点击事件或者其他事件，不能直接使用js调用！！！
      // this.copyTxt("h5实现一键复制到粘贴板 兼容ios");
    }
  },
  mounted() {
    if (this.$store.state.isFirstLogin == "1") {
      this.firstInModalShow = true;
      this.$store.commit("updateIsFirstLogin", "2");
    }
    this.changeCompanyInfo();
  }
};
</script>

<style lang="scss">
$text-color: #091d40;
.my-work {
  h2,
  h4,
  h5 {
    font-weight: bold;
    color: $text-color;
  }
  .btn {
    cursor: pointer;
  }
  .el-icon-close {
    cursor: pointer;
  }
  .panel {
    width: 1200px;
    height: 800px;
    header {
      height: 76px;
      padding: 0 30px;
      border-bottom: 1px solid rgba(221, 231, 255, 1);
      h2 {
        font-size: 24px;
        color: $text-color;
      }
    }
    .body {
      padding: 0 40px;
      .top {
        padding: 60px 94px 40px 102px;
        border-bottom: 1px solid rgba(234, 234, 234, 1);
        .t-cont {
          height: 88px;
        }
        img {
          width: 88px;
          height: 100%;
        }
        .company-name {
          width: 184px;
          margin-top: 14px;
        }
        .t-left {
          div {
            color: $text-color;
            padding: 10px 0;
            height: 88px;
            margin: 0 40px 0 24px;
          }
          h4 {
            font-size: 22px;
          }
          p {
            font-size: 16px;
          }
          .editor-btn {
            padding: 0 20px;
            height: 36px;
            line-height: 36px;
            border-radius: 5px;
            background: rgba(229, 237, 255, 1);
            border: 1px solid rgba(56, 125, 255, 1);
            color: #387dff;
            font-size: 12px;
          }
        }
        .t-right {
          height: 62px;
          .t-r-left {
            padding-right: 76px;
            position: relative;
            &:after {
              content: "";
              width: 1px;
              height: 30px;
              background-color: #eaeaea;
              position: absolute;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
            }
            .desc {
              position: relative;
              span {
                margin-right: 5px;
              }
              img {
                width: 16px;
                height: 16px;
                cursor: pointer;
              }
            }
            .staff-num-desc {
              width: 264px;
              background: rgba(255, 255, 255, 1);
              box-shadow: 0px 10px 10px rgba(5, 16, 91, 0.16);
              color: $text-color;
              padding: 20px 28px;
              position: absolute;
              left: 100%;
              top: 100%;
              border-radius: 5px;
              p {
                font-size: 12px;
                font-weight: 500;
                &:first-child {
                  margin-bottom: 8px;
                }
              }
            }
          }
          .t-r-right {
            padding-left: 75px;
          }
          .num {
            color: #1c60ff;
            font-size: 24px;
            text-align: center;
          }
          .desc {
            color: #999;
            font-size: 14px;
            margin-top: 12px;
          }
        }
      }
      .center {
        padding: 26px 0 42px 70px;
        .c-one {
          height: 40px;
          line-height: 40px;
          &:first-child {
            margin-right: 90px;
          }
          h4 {
            font-size: 16px;
            font-weight: bold;
            color: rgba(117, 122, 130, 1);
            margin-right: 26px;
          }
          .input {
            width: 339px;
            padding-left: 32px;
            padding-right: 30px;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
            border-radius: 20px;
            color: #353e51;
            font-size: 14px;
            input {
              position: absolute;
              z-index: -1;
            }
            .leye-url {
              width: 240px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
            .operate {
              font-size: 14px;
              color: #387dff;
              cursor: pointer;
              &.cannot-change {
                color: #999;
                cursor: not-allowed;
              }
              &:hover {
                color: #9cbeff;
              }
            }
          }
        }
      }
      .bottom {
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(234, 234, 234, 1);
        padding: 75px 106px 75px 72px;
        .b-one {
          width: 440px;
          height: 210px;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 5px 10px rgba(5, 16, 91, 0.1);
          border-radius: 10px;
          &:hover {
            box-shadow: 0px 10px 20px rgba(5, 16, 91, 0.1);
          }
          &:first-child {
            margin-right: 60px;
            .decorate {
              background: rgba(56, 125, 255, 1);
            }
          }
          &:last-child {
            .decorate {
              background: rgba(170, 70, 255, 1);
            }
          }
          .decorate {
            width: 109px;
            height: 10px;
            border-radius: 0px 0px 10px 10px;
          }
          h4 {
            margin: 34px 0 16px 0;
            font-size: 22px;
            color: $text-color;
          }
          .b-o-desc {
            font-size: 14px;
            color: #999;
            margin-bottom: 38px;
          }
          .link {
            font-size: 14px;
            color: #1c60ff;
            &:hover {
              color: #9cbeff;
            }
          }
        }
      }
    }
  }
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.6);
    .modal-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      border-radius: 10px;
      .m-c-header {
        height: 66px;
        border-bottom: 1px solid #dde7ff;
        padding: 0 34px;
        .el-icon-close {
          font-weight: bold;
        }
      }
      .operation {
        height: 44px;
        line-height: 44px;
        width: 100%;
        span {
          height: 100%;
          display: inline-block;
          padding: 0 60px;
          font-size: 16px;
          border-radius: 5px;
          cursor: pointer;
        }
      }
    }
  }
  .change-code-modal {
    .modal-content {
      width: 540px;
      .m-c-cont {
        padding: 0 110px 54px 110px;
        position: relative;
        .tip {
          height: 44px;
          line-height: 44px;
          position: absolute;
          top: 0;
          color: $text-color;
          font-size: 10px;
        }
        .input {
          height: 40px;
          margin-top: 44px;
          width: 100%;
          span {
            color: $text-color;
            font-size: 14px;
            margin-right: 18px;
            margin-bottom: 10px;
          }
          .tip-show {
            input {
              border-color: #ff4343;
              color: #ff4343;
            }
          }
        }
        .m-c-c-desc {
          font-size: 10px;
          color: #999;
          margin: 10px 0 34px 0;
        }
      }
    }
  }
  .first-in-modal {
    .modal-content {
      padding: 63px 165px 105px 165px;
      img {
        width: 240px;
        height: 155px;
      }
      h4 {
        margin: 30px 0 10px 0;
        font-size: 20px;
      }
      h5 {
        font-size: 14px;
        margin-bottom: 44px;
      }
      .operation {
        span {
          width: 155px;
          height: 44px;
          padding: 0;
          text-align: center;
        }
        span:first-child {
          margin-right: 20px;
        }
      }
    }
  }
  .confirm-change-code-modal {
    .modal-content {
      width: 540px;
      .m-c-cont {
        padding: 37px 110px 54px 110px;
        text-align: center;
        p {
          margin-bottom: 14px;
          font-weight: 500;
          font-size: 18px;
        }
        span {
          color: #ff4343;
        }
        .operation {
          margin-top: 30px;
        }
      }
    }
  }
}
</style>
